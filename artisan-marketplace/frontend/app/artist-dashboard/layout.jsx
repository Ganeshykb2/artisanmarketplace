'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Layout, Menu } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  OrderedListOutlined, 
  CalendarOutlined, 
  StarOutlined, 
  LogoutOutlined 
} from '@ant-design/icons'

const { Sider, Content } = Layout

const ArtistDashboardLayout = ({ children }) => {
  const selectedLayoutSegment = useSelectedLayoutSegment()

  const handleLogout = () => {
    // TODO: Implement logout logic
    
    console.log('Logout clicked')
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/artist-dashboard">Dashboard</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/artist-dashboard/profile">Profile</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link href="/artist-dashboard/products">Products</Link>,
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: <Link href="/artist-dashboard/orders">Orders</Link>,
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: <Link href="/artist-dashboard/events">Events</Link>,
    },
    {
      key: 'reviews',
      icon: <StarOutlined />,
      label: <Link href="/artist-dashboard/reviews">Reviews</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div 
          style={{ 
            height: '32px', 
            margin: '16px', 
            background: 'rgba(255, 255, 255, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Artist Dashboard
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedLayoutSegment]} 
          items={menuItems} 
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: '#fff',
            borderRadius: '8px'
          }}> 
            {children} 
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ArtistDashboardLayout