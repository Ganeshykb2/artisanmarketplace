// backend/controllers/productController.js
import Product from '../models/Products.js';
import Artists from '../models/Artists.js';
export const createProduct = async (req, res) => {
  try {
    // Extract product data from the request body
    const { name, description, price, quantity, images, category, status, discount } = req.body;

    // Get the artistId from the authenticated user (assuming it's attached to the request)
    const artistId = req.user.id;

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
export const getArtistsWithProducts = async (req, res) => {
  try {
    // Fetch only specific artist fields
    const artists = await Artists.find({}, 'id name verified').lean();

    // Check if artists is null or undefined
    if (!artists || artists.length === 0) {
      return res.status(404).json({ message: "No artists found" });
    }

    // Fetch products for each artist and attach them
    const artistsWithProducts = await Promise.all(
      artists.map(async (artist) => {
        // Ensure artist.id exists before querying
        if (!artist.id) {
          console.warn('Artist missing ID:', artist);
          return { ...artist, products: [] };
        }

        try {
          const products = await Product.find({ 
            artistId: artist.id 
          }, 'productId name price quantity description category status').lean(); // Fetch comprehensive product details

          return { 
            ...artist, 
            products: products || [] 
          };
        } catch (productFetchError) {
          console.error(`Error fetching products for artist ${artist.id}:`, productFetchError);
          return { 
            ...artist, 
            products: [],
            productFetchError: productFetchError.message 
          };
        }
      })
    );

    // Ensure we always return a valid response
    res.status(200).json({
      message: "Artists and products fetched successfully",
      data: artistsWithProducts,
      total: artistsWithProducts.length
    });

  } catch (error) {
    console.error("Error in getArtistsWithProducts:", error);
    res.status(500).json({
      message: "Error fetching artists and products",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getArtistProducts = async (req, res) => {
  try {
    // Get the artistId from the authenticated user (assuming it's attached to the request)
    const {artistId} = req.params;

    // Fetch products for the specific artist from the database
    const products = await Product.find({artistId});

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
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    // Check if there are no products
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the list of all products
    res.status(200).json({ message: 'All products fetched successfully', products });
  } catch (error) {
    // Handle any errors
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Error fetching all products', error: error.message });
  }
};

export const getProductsById = async (req,res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ productId: { $in: productId } });
    // Check if there are no products
    if (!product) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Return the list of all products
    res.status(200).json({ message: 'All products fetched successfully', product });
  } catch (error) {
    // Handle any errors
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Error fetching all products', error: error.message });
  }
}

export const getProductsByIds = async (req, res) => {
  try {
    // Extract the products array from the request body
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid products array' });
    }

    // Extract product IDs from the products array
    const productIds = products.map(product => product.productId);

    // Fetch products from the database matching the IDs
    const fetchedProducts = await Product.find({ productId: { $in: productIds } });

    // Return the fetched products
    return res.status(200).json({ success: true, products: fetchedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Error fetching products', error });
  }
};
