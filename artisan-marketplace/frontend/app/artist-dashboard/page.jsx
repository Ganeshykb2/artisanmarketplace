'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { MapPin } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ArtisanDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('artist-dashboard/api')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch dashboard data')
        }
        
        // Ensure data.data exists and has the expected structure
        if (!data?.data) {
          throw new Error('Invalid data structure received from API')
        }
        
        setDashboardData(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  if (!dashboardData || !dashboardData.artist) return null

  const { artist, salesData = [], productData = [], metrics = {} } = dashboardData

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={artist?.profileImage || "/default-profile.jpg"} 
              alt={`${artist?.name || 'Artist'}'s Photo`} 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-900">{artist?.name || 'Unknown Artist'}</h1>
              <p className="text-xl text-gray-600">{artist?.businessName || 'Business Name Not Available'}</p>
              {artist?.city && artist?.state && (
                <div className="flex items-center mt-2 text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{artist.city}, {artist.state}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Specializations</div>
            <div className="flex flex-wrap gap-2">
              {(artist?.specialization || []).map((spec, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-900">
                ₹{(metrics?.totalRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-blue-700 font-medium">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-900">
                {metrics?.completedOrders || 0}
              </h3>
              <p className="text-green-700 font-medium">Orders Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-900">
                {(metrics?.rating || 0).toFixed(1)}
              </h3>
              <p className="text-yellow-700 font-medium">Average Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Your sales performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Breakdown of your product sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}