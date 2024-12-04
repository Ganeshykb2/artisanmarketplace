'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { MultiSelect } from '@/components/ui/multi-select'

const specializations = [
  { label: 'Painting', value: 'painting' },
  { label: 'Sculpture', value: 'sculpture' },
  { label: 'Photography', value: 'photography' },
  { label: 'Digital Art', value: 'digital-art' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Printmaking', value: 'printmaking' },
];

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState('consumer')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const userData = Object.fromEntries(formData.entries())
    userData.userType = activeTab
    let url = ""
    if (activeTab === 'seller') {
      //userData.specialization = selectedSpecializations
      url = 'artists'
    } else {
      url = "customers"
    }

    try {
      console.log(userData);
      const response = await fetch(`http://localhost:5000/api/${url}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
        })
        router.push('/login')
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up for Artisan Marketplace</CardTitle>
          <CardDescription>Create your account to start exploring or selling artisan products</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="consumer">Consumer</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="consumer">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consumer-name">Full Name</Label>
                    <Input id="consumer-name" name="name" placeholder="Enter your full name" required />
                  </div>
                  <div>
                    <Label htmlFor="consumer-email">Email</Label>
                    <Input id="consumer-email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <Label htmlFor="consumer-password">Password</Label>
                    <Input id="consumer-password" name="password" type="password" placeholder="Create a password" required />
                  </div>
                  {/* <div>
                    <Label htmlFor="consumer-dob">Date of Birth</Label>
                    <Input id="consumer-dob" name="DOB" type="date" required />
                  </div> */}
                  {/* <div>
                    <Label htmlFor="consumer-about">About Yourself</Label>
                    <Textarea id="consumer-about" name="AboutHimself" placeholder="Tell us about yourself" />
                  </div> */}
                  <div>
                    <Label htmlFor="consumer-contact">Contact Number</Label>
                    <Input id="consumer-contact" name="phoneNumber" placeholder="Enter your contact number" required />
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox id="consumer-verify" name="contact.verify" />
                    <Label htmlFor="consumer-verify">Verify contact number</Label>
                  </div> */}
                  <div>
                    <Label htmlFor="seller-address">Address</Label>
                    <Input id="seller-address" name="address" placeholder="Enter your address" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-city">City</Label>
                    <Input id="seller-city" name="city" placeholder="Enter your city" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-state">State</Label>
                    <Input id="seller-state" name="state" placeholder="Enter your state" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-pincode">Pincode</Label>
                    <Input id="seller-pincode" name="pincode" placeholder="Enter your pincode" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up as Consumer'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="seller">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seller-name">Full Name</Label>
                    <Input id="seller-name" name="name" placeholder="Enter your full name" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-email">Email</Label>
                    <Input id="seller-email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-password">Password</Label>
                    <Input id="seller-password" name="password" type="password" placeholder="Create a password" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-business-name">Business Name</Label>
                    <Input id="seller-business-name" name="businessName" placeholder="Enter your business name" required />
                  </div>
                  {/* Don't use this for now.
                  <div>
                    <Label htmlFor="seller-specialization">Specialization</Label>
                    <MultiSelect
                      options={specializations}
                      selected={selectedSpecializations}
                      onChange={setSelectedSpecializations}
                      placeholder="Select your specializations"
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="seller-dob">Date of Birth</Label>
                    <Input id="seller-dob" name="DOB" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-about">About Yourself</Label>
                    <Textarea id="seller-about" name="AboutHimself" placeholder="Tell us about yourself and your business" />
                  </div>
                  <div>
                    <Label htmlFor="seller-contact">Contact Number</Label>
                    <Input id="seller-contact" name="phoneNumber" placeholder="Enter your contact number" required />
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox id="seller-verify" name="contact.verify" />
                    <Label htmlFor="seller-verify">Verify contact number</Label>
                  </div> */}
                  <div>
                    <Label htmlFor="seller-address">Address</Label>
                    <Input id="seller-address" name="address" placeholder="Enter your address" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-city">City</Label>
                    <Input id="seller-city" name="city" placeholder="Enter your city" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-state">State</Label>
                    <Input id="seller-state" name="state" placeholder="Enter your state" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-pincode">Pincode</Label>
                    <Input id="seller-pincode" name="pincode" placeholder="Enter your pincode" required />
                  </div>
                  <div>
                    <Label htmlFor="seller-aadhar">Aadhar Number</Label>
                    <Input id="seller-aadhar" name="aadhar" placeholder="Enter your Aadhar number" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up as Seller'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a></p>
        </CardFooter>
      </Card>
    </div>
  )
}

