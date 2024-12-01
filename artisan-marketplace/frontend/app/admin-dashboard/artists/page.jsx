'use client'

import React, { useEffect, useState } from 'react'
import { Table, Typography } from 'antd'

const { Title } = Typography

const OrdersPage = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // TODO: Fetch orders data from API
    // For now, we'll use dummy data
    setOrders([
      { id: 1, artisan: 'Artisan 1', product: 'Product 1', quantity: 2, total: 39.98 },
      { id: 2, artisan: 'Artisan 2', product: 'Product 2', quantity: 1, total: 29.99 },
    ])
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Artisan',
      dataIndex: 'artisan',
      key: 'artisan',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
  ]

  return (
    <div>
      <Title level={2}>Orders</Title>
      <Table dataSource={orders} columns={columns} rowKey="id" />
    </div>
  )
}

export default OrdersPage