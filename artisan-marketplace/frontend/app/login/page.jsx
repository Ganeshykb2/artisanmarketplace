'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('customers')
  const [message, setMessage] = useState("");
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = Object.fromEntries(formData.entries())
    userData.userType = activeTab
    try{
      const response = await fetch(`/login/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const user = await response.json();
      if(response.ok){
        router.push('/')
      } else{
        setMessage(user?.message)
        toast({
          title: "Error",
          description: user?.message,
          variant: "destructive",
        })
      }
    } catch(err){
      setMessage("Something went wrong")
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
      console.log(err);
    }
    console.log(`${activeTab} login submitted`)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Artisan Marketplace</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customers">Customer</TabsTrigger>
              <TabsTrigger value="artists">Artist</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consumer-email">Email</Label>
                    <Input id="consumer-email" type="email" name="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <Label htmlFor="consumer-password">Password</Label>
                    <Input id="consumer-password" type="password" name="password" placeholder="Enter your password" required />
                  </div>
                  <Button type="submit" className="w-full">Login as Consumer</Button>
                  <div>
                  {message&&<p className='text-red-500 text-center'>{message}</p>}
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="artists">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seller-email">Email</Label>
                    <Input id="seller-email" type="email" name="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-password">Password</Label>
                    <Input id="seller-password" type="password" name="password" placeholder="Enter your password" required />
                  </div>
                  <Button type="submit" className="w-full">Login as Seller</Button>
                  <div>
                  {message&&<p className='text-red'>{message}</p>}
                  </div>
                </div>
                
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a></p>
        </CardFooter>
      </Card>
    </div>
  )
}
















