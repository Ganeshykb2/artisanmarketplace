'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Layout, Menu } from 'antd'
import { UserOutlined, ShoppingOutlined, OrderedListOutlined, CalendarOutlined, LogoutOutlined } from '@ant-design/icons'

const { Sider, Content } = Layout

const AdminLayout = ({ children }) => {
  const selectedLayoutSegment = useSelectedLayoutSegment()

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked')
  }

  const menuItems = [
    {
      key: 'artists',
      icon: <UserOutlined />,
      label: <Link href="/admin-dashboard/artists">Artist & Products</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link href="/admin-dashboard/allartists">Artists</Link>,
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: <Link href="/admin-dashboard/orders">Orders</Link>,
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: <Link href="/admin-dashboard/events">Events</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedLayoutSegment]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout

