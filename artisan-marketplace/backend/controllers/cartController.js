import Cart from "../models/Cart.js";
import Product from '../models/Products.js';

// Get cart of a user
export const getCart = async (req,res) => {
    const user = req.user;

    try {
        // Check if a cart already exists for the user
        let cart = req.userType === 'artist' ? await Cart.findOne({ artistId: user.id }) : await Cart.findOne({customerId: user.id });
    
        if (cart) {
            res.status(200).json({ success: true, cart });
        } else {
            res.status(404).json({ success: false, message: 'Cart not found' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error', error });
      }
}

// Add item to cart
export const addItemToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body; // Default quantity is 1 if not provided
  const user = req.user;

  try {
    // Check if a cart already exists for the user
    let cart = req.userType === 'artist' ? await Cart.findOne({ artistId: user.id }) : await Cart.findOne({customerId: user.id });
    const product = await Product.findOne({productId});
    if(!product){
      res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (cart) {
      // Check if the product already exists in the cart
      const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

      if (productIndex > -1) {
        // If product exists, increase the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If product doesn't exist, add it to the cart
        cart.products.push({ productId, productName: product.name, productPrice: product.price, quantity });
      }

      await cart.save();
    } else {
      // Create a new cart if none exists

      cart = req.userType === 'artist' ? new Cart({
        artistId: user.id,
        products: [{ productId, productName: product.name, productPrice: product.price, quantity }]
      }) : new Cart({
        customerId: user.id,
        products: [{ productId, productName: product.name, productPrice: product.price, quantity }]
      });
      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error adding item to cart', error });
  }
};
  
  // Remove item from cart
  export const removeItemFromCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body; // Default quantity to remove is 1
    const user = req.user;
  
    try {
      // Find the user's cart
      let cart = req.userType === 'artist' ? await Cart.findOne({ artistId: user.id }) : await Cart.findOne({customerId: user.id });
  
      if (cart) {
        // Find the product in the cart
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
  
        if (productIndex > -1) {
          // Decrease quantity if more than 1
          if (cart.products[productIndex].quantity > quantity) {
            cart.products[productIndex].quantity -= quantity;
          } else {
            // If the quantity is 1 or less, remove the product completely
            cart.products.splice(productIndex, 1);
          }
  
          await cart.save();
          res.status(200).json({ success: true, cart });
        } else {
          res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
      } else {
        res.status(404).json({ success: false, message: 'Cart not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error removing item from cart', error });
    }
  };
  
  // Delete cart
  export const deleteCart = async (req, res) => {
    const user = req.user;
  
    try {
      // Delete the user's cart
      const result = req.userType === 'artist' ? await Cart.deleteOne({ artistId: user.id }) : await Cart.deleteOne({customerId: user.id });
  
      if (result.deletedCount > 0) {
        res.status(200).json({ success: true, message: 'Cart deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Cart not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting cart', error });
    }
  };