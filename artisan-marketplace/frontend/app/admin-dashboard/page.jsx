'use client'
import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const AdminDashboardPage = () => {
  return (
    <div>
      <Title level={2}>Welcome to Admin Dashboard</Title>
      <p>Select a category from the sidebar to manage your data.</p>
    </div>
  )
}

export default AdminDashboardPage