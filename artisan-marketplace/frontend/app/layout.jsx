'use client'

import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Palette, Menu, ChevronDown, Search, User, ShoppingCart, LogOut, LogIn, UserPlus, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import './globals.css';
import { useEffect, useState } from 'react';
import { UserProvider } from './UserProvider';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Artisan Marketplace',
//   description: 'Discover and support the incredible artisans of Varanasi',
// };

export default function RootLayout({ children }) {

  const[user,setUser] = useState({});

  useEffect(()=>{
    const getUser = async () =>{
      try{
        const res = await fetch("/api/cookies",{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const userDetails = await res?.json();
        setUser(userDetails?.user);
      } catch(err){
        console.log(err);
      }
    }
    getUser();
  },[]);

  const logoutHandle =  async ()=>{
    try{
      const res = await fetch("/api/logout",{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if(res.ok){
        window.location.href = "/";
      }
    }catch(err){
      console.log(err);
    }
     
  }
  
  
  return (
    
    <>
      <UserProvider user={user}>
      <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
            <div className="container flex h-16 items-center">
              <div className="mr-4 hidden md:flex flex-1 items-center">
                <Link className="mr-6 flex items-center space-x-2" href="/">
                  <Palette className="h-6 w-6" />
                  <span className="hidden font-bold text-xl sm:inline-block">
                    Artisan.Connect
                  </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
                  <Link href="/artisans" className="hover:text-secondary transition-colors">Artisans</Link>
                  {
                    user?.userType?.value === "artist" ?<DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-secondary transition-colors">
                      Event <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/events" className="flex items-center w-full">
                          View Events
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/manage-events" className="flex items-center w-full">
                          Manage Events
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> 
                    : <Link href="/events" className="hover:text-secondary transition-colors">Events</Link>
                  }
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:text-secondary transition-colors">
                      About <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/about" className="flex items-center w-full">
                          About Us
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/contact" className="flex items-center w-full">
                          Contact Us
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </div>
              <div className="flex items-center space-x-4 ml-auto">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8 w-[200px]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  {user?.userName? <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/${user?.userType?.value}-dashboard`} className="flex items-center w-full gap-2">
                        <UserCircle className="h-5 w-5" />
                        {user?.userName?.value}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="" onClick={logoutHandle} className="flex items-center w-full gap-2">
                      <LogOut className="h-5 w-5" />
                        Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent> :<DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href="/login" className="flex items-center w-full gap-2">
                      <LogIn className="h-5 w-5" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/signup" className="flex items-center w-full gap-2">
                      <UserPlus className="h-5 w-5" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>}
                </DropdownMenu>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                  <Link href="/" className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    <span className="font-bold">Artisan.Connect</span>
                  </Link>
                  <div className="my-4">
                    <Input placeholder="Search" className="w-full" />
                  </div>
                  <nav className="flex flex-col space-y-3">
                    <Link href="/" className="flex items-center">
                      Home
                    </Link>
                    <Link href="/artisans" className="flex items-center">
                      Artisans
                    </Link>
                    <Link href="/events" className="flex items-center">
                      Events
                    </Link>
                    <Link href="/about" className="flex items-center">
                      About Us
                    </Link>
                    <Link href="/contact" className="flex items-center">
                      Contact Us
                    </Link>
                    <Link href="/login" className="flex items-center">
                      Login
                    </Link>
                    <Link href="/signup" className="flex items-center">
                      Sign Up
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <main className="flex-grow">
          {children}
          </main>

          <footer className="bg-primary text-primary-foreground py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">About Us</h3>
                  <p className="text-sm">Artisan.Connect is dedicated to supporting and promoting the incredible artisans of India.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/contact">Contact Us</Link></li>
                    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link href="/terms-of-service">Terms of Service</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary-foreground hover:text-secondary">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-primary-foreground hover:text-secondary">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 15.785 2 15.445 2 12.73v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.933 2.013 9.273 2 11.988 2h.08zm0 1.8c-2.393 0-2.723.012-3.683.059-.893.041-1.374.175-1.687.293a3.1 3.1 0 00-1.116.738 3.1 3.1 0 00-.738 1.116c-.118.313-.252.794-.293 1.687-.047.96-.059 1.29-.059 3.683v.063c0 2.393.012 2.723.059 3.683.041.893.175 1.374.293 1.687.171.443.414.835.738 1.116.281.324.673.567 1.116.738.313.118.794.252 1.687.293.96.047 1.29.059 3.683.059h.063c2.393 0 2.723-.012 3.683-.059.893-.041 1.374-.175 1.687-.293a3.1 3.1 0 001.116-.738 3.1 3.1 0 00.738-1.116c.118-.313.252-.794.293-1.687.047-.96.059-1.29.059-3.683v-.063c0-2.393-.012-2.723-.059-3.683-.041-.893-.175-1.374-.293-1.687a3.1 3.1 0 00-.738-1.116 3.1 3.1 0 00-1.116-.738c-.313-.118-.794-.252-1.687-.293-.96-.047-1.29-.059-3.683-.059H12.4zM12 7.567a4.433 4.433 0 100 8.866 4.433 4.433 0 000-8.866zm0 1.8a2.633 2.633 0 110 5.266 2.633 2.633 0 010-5.266zm4.926-1.25a1.05 1.05 0 100 2.1 1.05 1.05 0 000-2.1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
    </UserProvider>
    </>
    
  );
}

export const dynamic = 'force-dynamic';

/*
      userDetails Output Structure
       user: {
            "userId": {
                "name": "id",
                "value": "7daff2da-a81e-4ffb-bc93-8be8b45bcd5e",
                "path": "/"
            },
            "userName": {
                "name": "name",
                "value": "Ganesh Kumar",
                "path": "/"
            },
            "userEmail": {
                "name": "email",
                "value": "gani@gmail.com",
                "path": "/"
            },
            "userType": {
                "name": "type",
                "value": "customer",
                "path": "/"
            }
        }
      */