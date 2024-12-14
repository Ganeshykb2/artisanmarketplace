// backend/controllers/productController.js
import Product from '../models/Products.js';
import Artist from '../models/Artists.js';

export const createProduct = async (req, res) => {
  try {
    // Extract product data from the request body
    const { name, description, price, quantity, images, category, status, discount } = req.body;

    // Get the artistId from the authenticated user (assuming it's attached to the request)
    // const artistId = req.user.id
    const artistId = "artistidhgmhdfvhjvn";

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      images,
      category,
      status,
      discount,
      artistId,
    });

    // Save the new product to the database
    await newProduct.save();

    // Return a success response
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    // Handle any errors and return an error response
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


 /*
 test payload :{
  "name": "Handmade Ceramic Mug",
  "description": "A beautifully crafted handmade ceramic mug perfect for your morning coffee.",
  "price": 15.99,
  "quantity": 50,
  "images": [
    "https://example.com/images/mug1.jpg",
    "https://example.com/images/mug2.jpg"
  ],
  "category": "Ceramics",
  "status": "available",
  "discount": 10
}
result: {
    "message": "Product created successfully",
    "product": {
        "name": "Handmade Ceramic Mug",
        "description": "A beautifully crafted handmade ceramic mug perfect for your morning coffee.",
        "price": 15.99,
        "images": [
            "https://example.com/images/mug1.jpg",
            "https://example.com/images/mug2.jpg"
        ],
        "quantity": 50,
        "category": "Ceramics",
        "status": "available",
        "reviews": [],
        "averageRating": 0,
        "salesCount": 0,
        "discount": 10,
        "artistId": "artistidhgmhdfvhjvn",
        "_id": "6751a795622b86f0fd50f2c9",
        "productId": "ded6d4c9-1bb3-453a-85a7-0d8583600cb5",
        "createdAt": "2024-12-05T13:16:05.080Z",
        "updatedAt": "2024-12-05T13:16:05.083Z",
        "__v": 0
    }
}
*/


export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
export const getFeaturedProducts = async (req, res) => {
  try {
    // Fetch the first 6 products with an average rating above 3
    let featuredProducts = await Product.find({ averageRating: { $gte: 3 } })
      .limit(6);

    // If no products are found with a rating above 3, fetch the first 6 available products
    if (featuredProducts.length === 0) {
      console.log('No products with rating above 3, fetching first 6 available products');
      featuredProducts = await Product.find({})
        .limit(6);
    }

    if (featuredProducts.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ message: 'Featured products fetched successfully', products: featuredProducts });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
};



export const getArtistProduct = async (req, res) => {
  try {
    // Get the artistId from the authenticated user (assuming it's attached to the request)
    // const artistId = req.user.id;
    const artistId = "artistidhgmhdfvhjvn"; // Placeholder artistId

    // Fetch products for the specific artist from the database
    const products = await Product.find({ artistId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }

    // Return the fetched products
    res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    // Handle any errors and return an error response
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
