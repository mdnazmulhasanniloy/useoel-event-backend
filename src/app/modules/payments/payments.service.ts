import Stripe from 'stripe';
import config from '../../config';
import { IPayment } from './payments.interface';
import { ISubscriptions } from '../subscription/subscription.interface';
import Subscription from '../subscription/subscription.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import Payment from './payments.models';
import { User } from '../user/user.models';
import { createCheckoutSession } from './payments.utils';
import { startSession } from 'mongoose';
import { IPackage } from '../packages/packages.interface';
import { modeType } from '../notification/notification.interface';
import { USER_ROLE } from '../user/user.constants';
import moment from 'moment';
import { IUser } from '../user/user.interface';
import { Notification } from '../notification/notification.model';
import Package from '../packages/packages.models';
import generateRandomString from '../../utils/generateRandomString';

const stripe = new Stripe(config.stripe?.stripe_api_secret as string, {
  apiVersion: '2024-06-20',
  typescript: true,
});

const checkout = async (payload: IPayment) => {
  const tranId = generateRandomString(10);
  let paymentData: IPayment;
  const subscription: ISubscriptions | null = await Subscription.findById(
    payload?.subscription,
  ).populate('package');

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, 'subscription Not Found!');
  }

  const isExistPayment: IPayment | null = await Payment.findOne({
    subscription: payload?.subscription,
    isPaid: false,
    user: payload?.user,
  });

  if (isExistPayment) {
    const payment = await Payment.findByIdAndUpdate(
      isExistPayment?._id,
      { tranId },
      { new: true },
    );

    paymentData = payment as IPayment;
  } else {
    payload.tranId = tranId;
    payload.amount = subscription?.amount;
    const createdPayment = await Payment.create(payload);
    if (!createdPayment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create payment',
      );
    }
    paymentData = createdPayment;
  }

  if (!paymentData)
    throw new AppError(httpStatus.BAD_REQUEST, 'payment not found');

  const checkoutSession = await createCheckoutSession({
    // customerId: customer.id,
    product: {
      amount: paymentData?.amount,
      //@ts-ignore
      name: subscription?.package?.title,
      quantity: 1,
    },

    //@ts-ignore
    paymentId: paymentData?._id,
  });

  return checkoutSession?.url;
};

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query;
  const session = await startSession();
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  const paymentIntentId = PaymentSession.payment_intent as string;

  if (PaymentSession.status !== 'complete') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    );
  }

  try {
    session.startTransaction();
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { isPaid: true, paymentIntentId: paymentIntentId },
      { new: true, session },
    ).populate('user');

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!');
    }

    const oldSubscription = await Subscription.findOneAndUpdate(
      {
        user: payment?.user,
        isPaid: true,
        isExpired: false,
      },
      {
        isExpired: true,
      },
      { upsert: false, session },
    );
    const subscription: ISubscriptions | null = await Subscription.findById(
      payment?.subscription,
    )
      .populate('package')
      .session(session);

    let expiredAt;

    // Check if the old subscription has an expiration date greater than now
    if (
      oldSubscription?.expiredAt &&
      moment(oldSubscription.expiredAt).isAfter(moment())
    ) {
      // Calculate remaining time from the old expiration date
      const remainingTime = moment(oldSubscription.expiredAt).diff(moment());
      expiredAt = moment().add(remainingTime, 'milliseconds');
    } else {
      expiredAt = moment();
    }

    // Add the new subscription's duration days
    if ((subscription?.package as IPackage)?.durationDay) {
      expiredAt = expiredAt.add(
        (subscription?.package as IPackage)?.durationDay,
        'days',
      );
    }

    // Convert expiredAt back to a Date object if necessary
    expiredAt = expiredAt.toDate();

    await Subscription.findByIdAndUpdate(
      payment?.subscription,
      {
        isPaid: true,
        trnId: payment?.tranId,
        expiredAt: expiredAt,
      },
      {
        session,
      },
    ).populate('package');

    if (!subscription) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subscription Not Found!');
    }

    await Package.findByIdAndUpdate(
      (subscription?.package as IPackage)?._id,
      {
        $inc: { popularity: 1 },
      },
      { upsert: false, new: true, session },
    );
    const admin = await User.findOne({ role: USER_ROLE.admin });

    await Notification.create(
      [
        {
          receiver: (payment?.user as IUser)?._id, // Receiver is the user
          message: 'Your subscription payment was successful!',
          description: `Your payment with ID ${payment._id} has been processed successfully. Thank you for subscribing!`,
          refference: payment?._id, // Correct spelling should be `reference` unless it's intentional
          model_type: modeType?.payment,
        },
        {
          receiver: admin?._id, // Admin ID as the receiver
          message: 'A new subscription payment has been made.',
          description: `User ${(payment.user as IUser)?.email} has successfully made a payment for their subscription. Payment ID: ${payment._id}.`,
          refference: payment?._id, // Same note about `reference`
          model_type: modeType?.payment,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
        });
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message);
      }
    }

    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

 

const createPayments = async () => {};
const getAllPayments = async () => {};
const getPaymentsById = async () => {};
const updatePayments = async () => {};
const deletePayments = async () => {};

export const paymentsService = {
  createPayments,
  getAllPayments,
  getPaymentsById,
  updatePayments,
  deletePayments,
  checkout,
  confirmPayment, 
};
