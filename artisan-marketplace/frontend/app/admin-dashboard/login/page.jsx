'use client';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target)
      const adminData = Object.fromEntries(formData.entries())
      const response = await fetch('/admin-dashboard/login/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data?.message || 'Login successful!');
        router.push('/admin-dashboard');
      } else {
        setMessage(data?.message || 'Login failed!');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h1 level={2} style={{ textAlign: 'center' }}>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="consumer-email">Username</Label>
              <Input id="username" type="text" name="username" placeholder="Enter your Username" required />
            </div>
            <div>
              <Label htmlFor="consumer-password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="Enter your password" required />
            </div>
            <Button type="submit" className="w-full">Login as Admin</Button>
            <div>
            {message&&<p className='text-red-500 text-center'>{message}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
