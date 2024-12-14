'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Component for displaying image previews
const ImagePreview = ({ image, onRemove, index }) => (
  <div className="relative inline-block mr-2 mb-2">
    <img src={image} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
    >
      X
    </button>
  </div>
);


export default function AddNewProduct() {
  // Initialize form handling with React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  // State for managing uploaded images
  const [images, setImages] = useState([]);

    // New state variables for loading and messages
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + newImages.length >= 5) break;
      const base64 = await convertToBase64(files[i]);
      newImages.push(base64);
    }

    setImages([...images, ...newImages]);
  };

  // Remove an image from the selection
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Update form value when images change
  useEffect(() => {
    setValue('images', images);
  }, [images, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true when submission starts
    setMessage({ type: '', content: '' }); // Clear any previous messages

    // const result = await addProduct(data);

    const productData = {
      ...data,
      images: images,
      quantity: parseInt(data.quantity),
      price: parseFloat(data.price),
      discount: parseFloat(data.discount),
    };

    try {
      const response = await fetch(`/artist-dashboard/products/add-new-product/api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage({type: 'error', content: 'Failed to add product' || result?.message});
        throw new Error("Failed to add product");
      }
      console.log('Product added successfully:', result);
      setMessage({ type: 'success', content: 'Product added successfully!' || result?.message});

     /// Navigate back after a short delay
      // setTimeout(() => {
      //   window.history.back();
      // }, 2000);
       
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'error', content: 'Failed to add product. Please try again.' || result?.message});
    } finally {
      setIsLoading(false); // Set loading to false when submission ends
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

            {/* Display loading message */}
            {isLoading && (
        <div className="mb-4 text-center text-blue-600">
          Loading... Please wait while we add your product.
        </div>
      )}

      {/* Display success or error message */}
      {message.content && (
        <div className={`mb-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.content}
        </div>
      )}


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name input field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Description input field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Price input field */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            step="0.01"
            {...register("price", { required: "Price is required", min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        {/* Image upload field */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images (Upload up to 5, at least 1 required)
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>}
          <div className="mt-2">
            {images.map((image, index) => (
              <ImagePreview key={index} image={image} onRemove={removeImage} index={index} />
            ))}
          </div>
          {images.length > 0 && <p className="mt-1 text-sm text-gray-600">{images.length} image(s) selected</p>}
        </div>

        {/* Quantity input field */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", { required: "Quantity is required", min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
        </div>

        {/* Category input field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Status select field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="available">Available</option>
            <option value="out of stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        {/* Discount input field */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
          <input
            type="number"
            id="discount"
            step="0.01"
            {...register("discount", { min: 0, max: 100 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount.message}</p>}
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isLoading} // Disable button while loading
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

