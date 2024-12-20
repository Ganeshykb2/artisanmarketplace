'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AddressModal({ isOpen, onClose, cartItems, orderType, productId, quantity}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    setIsSubmitting(true)
    setMessage('')
    try {
        const address = {
            street: formValues.street,
            city: formValues.city,
            state: formValues.state,
            zipCode: formValues.zipCode,
            country: formValues.country,
          };
          
          const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`.trim();
          let productIds = [];
          let quantities = [];
          if(orderType == 'cart'){
            productIds = cartItems?.map(item => item.productId);
            quantities = cartItems?.map(item => item.quantity);
          } else {
            productIds = [productId];
            quantities = [quantity];
          }
          
          const res = await fetch('/Buynow/api',{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          body: JSON.stringify({ productIds, quantities, shippingAddress: addressString }),
          });
    
          const result = await res?.json();
          if(!res.ok){
            console.log(result?.message);
            throw new Error("Failed to Place order");
          }
          window.location.href = `/Buynow/order-placed?orderId=${result?.order?.orderId}`;
    } catch (error) {
      console.log(error);
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Shipping Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="street">Street</Label>
            <Input id="street" name="street" required />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" required />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" name="zipCode" required />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
          {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}

