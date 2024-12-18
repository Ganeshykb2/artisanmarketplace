'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous submission status
    setSubmissionStatus({
      loading: true,
      success: false,
      error: null
    });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmissionStatus({
          loading: false,
          success: true,
          error: null
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(responseData.message || 'Something went wrong');
      }
    } catch (error) {
      setSubmissionStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              We're here to help. Fill out the form below and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {submissionStatus.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionStatus.error}</AlertDescription>
              </Alert>
            )}

            {submissionStatus.success && (
              <Alert variant="default" className="mb-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your message has been sent successfully. We'll get back to you soon!
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={submissionStatus.loading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={submissionStatus.loading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here"
                    rows={5}
                    required
                    disabled={submissionStatus.loading}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleSubmit}
              disabled={submissionStatus.loading}
            >
              {submissionStatus.loading ? 'Sending...' : 'Send Message'}
            </Button>
          </CardFooter>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Get in touch with us through these channels
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">support@artisanmarketplace.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">+91 9876543210</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  123 Artisan Street, Varanasi, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}