'use client'

import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { MultiSelect } from '@/components/ui/multi-select'
import { useForm } from 'react-hook-form'


const specializations = [
  { label: 'Painting', value: 'painting' },
  { label: 'Sculpture', value: 'sculpture' },
  { label: 'Photography', value: 'photography' },
  { label: 'Digital Art', value: 'digital-art' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Printmaking', value: 'printmaking' },
];

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState('customers')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [image, setImage] = useState(null); 

  // Function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      const base64 = await convertToBase64(file);
      setImage(base64); // Set the single image state
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setImage(null); // Reset the image state to null
  };

  // Update form value when the image changes
  useEffect(() => {
    setValue('image', image); // Send the base64 image to the form
  }, [image, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true)
    data.userType = activeTab;
    if (activeTab === 'artists') {
      data.specialization = selectedSpecializations;
    }

    try {
      console.log(data);
      const response = await fetch(`http://localhost:5000/api/${activeTab}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
              <TabsTrigger value="customers">Customer</TabsTrigger>
              <TabsTrigger value="artists">Artist</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consumer-name">Full Name</Label>
                    <Input id="consumer-name" name="name" {...register('name', { required: true })} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="consumer-email">Email</Label>
                    <Input id="consumer-email" name="email" type="email" {...register('email', { required: true })} placeholder="Enter your email" />
                  </div>
                  <div>
                    <Label htmlFor="consumer-password">Password</Label>
                    <Input id="consumer-password" name="password" type="password" {...register('password', { required: true })} placeholder="Create a password" />
                  </div>
                  <div>
                    <Label htmlFor="consumer-contact">Contact Number</Label>
                    <Input id="consumer-contact" name="phoneNumber" {...register('phoneNumber', { required: true })} placeholder="Enter your contact number" />
                  </div>
                  <div>
                    <Label htmlFor="seller-address">Address</Label>
                    <Input id="seller-address" name="address" {...register('address', { required: true })} placeholder="Enter your address" />
                  </div>
                  <div>
                    <Label htmlFor="seller-city">City</Label>
                    <Input id="seller-city" name="city" {...register('city', { required: true })} placeholder="Enter your city" />
                  </div>
                  <div>
                    <Label htmlFor="seller-state">State</Label>
                    <Input id="seller-state" name="state" {...register('state', { required: true })} placeholder="Enter your state" />
                  </div>
                  <div>
                    <Label htmlFor="seller-pincode">Pincode</Label>
                    <Input id="seller-pincode" name="pincode" {...register('pincode', { required: true })} placeholder="Enter your pincode" />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up as Consumer'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="artists">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seller-name">Full Name</Label>
                    <Input id="seller-name" name="name" {...register('name', { required: true })} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="seller-email">Email</Label>
                    <Input id="seller-email" name="email" type="email" {...register('email', { required: true })} placeholder="Enter your email" />
                  </div>
                  <div>
                    <Label htmlFor="seller-password">Password</Label>
                    <Input id="seller-password" name="password" type="password" {...register('password', { required: true })} placeholder="Create a password" />
                  </div>
                  <div>
                    <Label htmlFor="seller-profile-image">Profile Image</Label>
                    <Input
                      type="file"
                      id="seller-profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100"
                    />
                    {image && (
                      <div className="mt-2 relative mx-auto">
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto relative">
                          <img src={image} alt="Profile Preview" className="w-full h-full object-cover" />
                        </div>
                        <button 
                            type="button"
                            onClick={removeImage} 
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-2 text-sm"
                          >
                            X
                          </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="seller-business-name">Business Name</Label>
                    <Input id="seller-business-name" name="businessName" {...register('businessName', { required: true })} placeholder="Enter your business name" />
                  </div>
                  <div>
                    <Label htmlFor="seller-specialization">Specialization</Label>
                    <MultiSelect
                      options={specializations}
                      selected={selectedSpecializations}
                      onChange={setSelectedSpecializations}
                      placeholder="Select your specializations"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seller-dob">Date of Birth</Label>
                    <Input id="seller-dob" name="DOB" type="date" {...register('DOB', { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="seller-about">About Yourself</Label>
                    <Textarea id="seller-about" name="AboutHimself" {...register('AboutHimself')} placeholder="Tell us about yourself and your business" />
                  </div>
                  <div>
                    <Label htmlFor="seller-contact">Contact Number</Label>
                    <Input id="seller-contact" name="phoneNumber" {...register('phoneNumber', { required: true })} placeholder="Enter your contact number" />
                  </div>
                  <div>
                    <Label htmlFor="seller-address">Address</Label>
                    <Input id="seller-address" name="address" {...register('address', { required: true })} placeholder="Enter your address" />
                  </div>
                  <div>
                    <Label htmlFor="seller-city">City</Label>
                    <Input id="seller-city" name="city" {...register('city', { required: true })} placeholder="Enter your city" />
                  </div>
                  <div>
                    <Label htmlFor="seller-state">State</Label>
                    <Input id="seller-state" name="state" {...register('state', { required: true })} placeholder="Enter your state" />
                  </div>
                  <div>
                    <Label htmlFor="seller-pincode">Pincode</Label>
                    <Input id="seller-pincode" name="pincode" {...register('pincode', { required: true })} placeholder="Enter your pincode" />
                  </div>
                  <div>
                    <Label htmlFor="seller-aadhar">Aadhar Number</Label>
                    <Input id="seller-aadhar" name="aadhar" {...register('aadhar', { required: true })} placeholder="Enter your Aadhar number" />
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

