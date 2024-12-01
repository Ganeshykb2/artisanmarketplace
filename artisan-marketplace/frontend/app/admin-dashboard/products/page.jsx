'use client'

import React, { useEffect, useState } from 'react'
import { Table, Typography } from 'antd'

const { Title } = Typography

const ProductsPage = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // TODO: Fetch products data from API
    // For now, we'll use dummy data
    setProducts([
      { id: 1, name: 'Product 1', price: 19.99, stock: 100 },
      { id: 2, name: 'Product 2', price: 29.99, stock: 50 },
    ])
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
  ]

  return (
    <div>
      <Title level={2}>Products</Title>
      <Table dataSource={products} columns={columns} rowKey="id" />
    </div>
  )
}

export default ProductsPage