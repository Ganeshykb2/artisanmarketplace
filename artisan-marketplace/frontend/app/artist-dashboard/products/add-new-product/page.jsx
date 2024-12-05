'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [images, setImages] = useState([]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  useEffect(() => {
    setValue('images', images);
  }, [images, setValue]);

  const onSubmit = async (data) => {
    const productData = {
      ...data,
      images: images,
      quantity: parseInt(data.quantity),
      price: parseFloat(data.price),
      discount: parseFloat(data.discount),
      artistId: "placeholder-artist-id", // This should be replaced with the actual logged-in artist's ID
    };

    console.log(productData);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      console.log('Product added successfully:', result);
      // Here you might want to show a success message or redirect the user
    } catch (error) {
      console.error('Error adding product:', error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

