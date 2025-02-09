'use client'

import React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Layout, Menu } from 'antd'
import { UserOutlined, ShoppingOutlined, OrderedListOutlined, CalendarOutlined, LogoutOutlined, LoginOutlined, ContactsOutlined } from '@ant-design/icons'

const { Sider, Content } = Layout

const AdminLayout = ({ children }) => {
  const selectedLayoutSegment = useSelectedLayoutSegment()

  const handleLogout = async () => {
    try {
      const response = await fetch('/admin-dashboard/logout/api', {
        method: 'GET',
      });
  
      if (response.ok) {
        alert('You have been logged out successfully.');
        const API_NOT_BASE = process.env.NOT_BASE;
        window.location.href = `${API_NOT_BASE}/admin-dashboard/login`; // Redirect to the login page
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
        alert(`Logout failed: ${data.message}`);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const menuItems = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link href="/admin-dashboard/login">Login</Link>,
    },
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
      key: 'events',
      icon: <CalendarOutlined />,
      label: <Link href="/admin-dashboard/events">Events</Link>,
    },
    {
      key: 'contacts',
      icon: <ContactsOutlined />,
      label: <Link href="/admin-dashboard/contacts">Contacts</Link>,
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
