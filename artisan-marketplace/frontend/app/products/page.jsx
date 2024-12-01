'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const sampleProducts = [
  // Add your sample product data here
  {
    _id: '1',
    name: 'Handmade Saree',
    category: 'saree',
    price: 1200.00,
    description: 'A beautiful handmade saree.',
    imageUrl: '/images/saree.jpg',
    artisan: { name: 'Artisan A' }
  },
  {
    _id: '2',
    name: 'Wooden Handicraft',
    category: 'handicraft',
    price: 750.00,
    description: 'A unique wooden handicraft.',
    imageUrl: '/images/handicraft.jpg',
    artisan: { name: 'Artisan B' }
  },
  {
    _id: '3',
    name: 'Traditional Jewelry',
    category: 'jewelry',
    price: 950.00,
    description: 'Traditional handmade jewelry.',
    imageUrl: '/images/jewelry.jpg',
    artisan: { name: 'Artisan C' }
  }
]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts)

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) &&
      (category === '' || product.category === category)
    )
    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category) => {
    setCategory(category)
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === '' || product.category === category)
    )
    setFilteredProducts(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="saree">Sarees</SelectItem>
              <SelectItem value="handicraft">Handicrafts</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id}>
                <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="w-full object-cover" />
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>By {product.artisan.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      
      </div>
    </div>
  )
}
