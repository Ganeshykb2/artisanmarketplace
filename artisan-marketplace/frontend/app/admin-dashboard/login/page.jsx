'use client'

import React, { useState } from 'react'
import { Form, Input, Button, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title } = Typography

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // TODO: Implement actual login logic
      console.log('Login values:', values)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Login successful')
      router.push('/admin-dashboard/artists')
    } catch (error) {
      message.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Admin Login</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage