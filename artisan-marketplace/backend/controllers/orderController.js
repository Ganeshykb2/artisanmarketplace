import Order from '../models/Orders.js';
import Product from '../models/Products.js';
import Customer from '../models/Customers.js';
import Artist from '../models/Artists.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;
    const { customerId } = req.user; // Assuming the user is authenticated and their ID is stored in the JWT token

    const product = await Product.findById(productId);
    const customer = await Customer.findById(customerId);

    if (!product || !customer) {
      return res.status(404).json({ message: 'Product or Customer not found' });
    }

    const totalAmount = product.price * quantity;

    const order = new Order({
      productId,
      artisanId: product.artistId,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity,
      totalAmount,
      customerId,
      shippingAddress,
      status: 'pending',
    });

    await order.save();
    customer.purchaseHistory.push(order);
    await customer.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const { customerId, artistId } = req.user; // Extracting user details from token

  try {
    const order = await Order.findById(orderId).populate('productId customerId artisanId');

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the requesting customer or artisan
    if (order.customerId.toString() !== customerId && order.artisanId.toString() !== artistId) {
      return res.status(403).json({ message: 'You are not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Get All Orders for a Customer
export const getOrdersByCustomer = async (req, res) => {
  const { customerId } = req.user; // Get customer ID from token

  try {
    const orders = await Order.find({ customerId }).populate('productId artisanId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error });
  }
};

// Get All Orders for an Artist
export const getOrdersByArtist = async (req, res) => {
  const { artistId } = req.user; // Get artist ID from token

  try {
    const orders = await Order.find({ 'artisanId': artistId }).populate('productId customerId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this artist' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist orders', error });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
