import Order from '../models/Orders.js';
import Product from '../models/Products.js';
import Customer from '../models/Customers.js';
import Artists from '../models/Artists.js'; 

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { productIds, quantities, shippingAddress} = req.body;
    const customerId  = req.user.id;
    // Fetch products based on the array of productIds
    const products = await Product.find({ productId: { $in: productIds } });

    if (!products || products.length !== productIds.length) {
      console.log('Some products were not found');
      return res.status(404).json({ message: 'Some products were not found' });
    }

    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Calculate total amount and create order items
    const items = [];
    const artistIds = new Set();
    let totalAmount = 0;

    products.forEach((product, index) => {
      const quantity = quantities[index];

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for product: ${product._id}` });
      }
      artistIds.add(product.artistId);
      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      items.push({
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity,
      });
    });

    const uniqueArtistIds = Array.from(artistIds);

    const order = new Order({
      customerId,
      artistIds: uniqueArtistIds,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
    });

    await order.save();

    // Add the order to the customer's purchase history
    customer.purchaseHistory.push(order._id);
    await customer.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error placing order', error });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const customerId = req.user.id; // Extracting user details from token

  try {
    const order = await Order.findOne({ orderId });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the requesting customer or artisan
    if (order.customerId.toString() !== customerId) {
      return res.status(403).json({ message: 'You are not authorized to view this order' });
    }

    res.status(200).json({message: 'Order fetched successfully', order});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Get All Orders for a Customer
export const getOrdersByCustomer = async (req, res) => {
  const customerId = req.user.id;
  try {
    // First try to get orders without population
    const orders = await Order.find({ customerId });
    
    // Then populate only if orders exist
    if (orders && orders.length > 0) {
      const populatedOrders = await Order.find({ customerId })
        .populate('items.productId');
      
      return res.json(populatedOrders);
    }
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
  }
};

// Get All Orders for an Artisan
export const getOrdersByArtist = async (req, res) => {
  const { artisanId } = req.user; // Get artisan ID from token

  try {
    const orders = await Order.find({ artisanId }).populate('items.productId customerId');

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
    const order = await Order.findOne({ orderId });
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
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
