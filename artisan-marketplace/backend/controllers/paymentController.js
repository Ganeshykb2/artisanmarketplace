import Payment from '../models/Payments.js';
import Order from '../models/Orders.js';
import Customer from '../models/Customers.js';
import Artist from '../models/Artists.js';

// Submit Payment Reference ID
export const submitPaymentReference = async (req, res) => {
  try {
    const { orderId, paymentReferenceId, paymentMethod, amount, artisanId, customerId } = req.body;

    if (!orderId || !paymentReferenceId || !paymentMethod || !amount || !artisanId || !customerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the order, customer, and artisan
    const order = await Order.findById(orderId);
    const customer = await Customer.findById(customerId);
    const artisan = await Artist.findById(artisanId);

    if (!order || !customer || !artisan) {
      return res.status(404).json({ message: 'Order, Customer, or Artist not found' });
    }

    // Create a new payment entry
    const payment = new Payment({
      orderId,
      customerId,
      artisanId,
      amount,
      paymentMethod,
      status: 'pending', // Initial status is pending
      transactionId: paymentReferenceId, // Store the payment reference ID
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment reference submitted successfully, awaiting verification.',
      payment,
    });
  } catch (error) {
    console.error('Error submitting payment reference:', error);
    res.status(500).json({ message: 'Error submitting payment reference', error: error.toString() });
  }
};

// Verify Payment Manually
export const verifyPaymentManually = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Manually verify the payment (you can add custom checks here)
    payment.status = 'completed'; // Update payment status to completed
    await payment.save();

    // Optionally, you can update the associated order status to 'paid'
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.status = 'paid'; // Mark order as paid
      await order.save();
    }

    res.status(200).json({
      message: 'Payment verified successfully, order is now paid.',
      payment,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.toString() });
  }
};
