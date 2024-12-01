// backend/controllers/orderController.js
import Order from '../models/Orders.js';
import Product from '../models/Product.js';
import Customer from '../models/Customers.js';

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, customerId } = req.body;
    const product = await Product.findById(productId);
    const customer = await Customer.findById(customerId);

    if (!product || !customer) {
      return res.status(404).json({ message: 'Product or Customer not found' });
    }

    const order = new Order({
      productId,
      artisanId: product.artistId,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity,
    });

    await order.save();
    customer.purchaseHistory.push(order);
    await customer.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};
