import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutUs() {
  const teamMembers = [
    { name: "Shreesha", role: "Co-Founder", image: "/shreesha.png" },
    { name: "Rahula", role: "Marketing Head", image: "/rahula.png" },
    { name: "Modi", role: "Design Lead", image: "/modi.png" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Artisan Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-lg mb-4">
            Artisan Marketplace is dedicated to supporting and promoting the incredible artisans of Varanasi. We believe in the power of traditional craftsmanship and aim to provide a platform for these skilled artisans to showcase their work to a global audience.
          </p>
          <p className="text-lg mb-4">
            Our mission is to preserve and celebrate the rich cultural heritage of Varanasi while empowering artisans to thrive in the modern marketplace. By connecting artisans directly with customers, we ensure fair compensation and recognition for their exceptional skills.
          </p>
          <p className="text-lg mb-4">
            Through our platform, we aim to bridge the gap between traditional artisans and modern buyers, creating opportunities for sustainable livelihoods. By leveraging technology, we make their exquisite crafts accessible to people worldwide.
          </p>
          <p className="text-lg">
            Join us in our journey to bring the beauty of Varanasi&#39;s handicrafts to the world, one artisan at a time.
          </p>
        </div>
        <Image src="/artisan-at-work.jpg" alt="Artisan at work" width={600} height={400} className="w-full rounded-lg shadow-md" />
      </div>
      
      <h2 className="text-3xl font-semibold mb-6">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>500+</CardTitle>
            <CardDescription>Artisans Supported</CardDescription>
          </CardHeader>
          <CardContent>
            We&#39;ve helped over 500 artisans showcase their products and reach a wider audience.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>₹10,000+</CardTitle>
            <CardDescription>Revenue Generated</CardDescription>
          </CardHeader>
          <CardContent>
            Our platform has facilitated over ₹10,000 in sales, directly benefiting local artisans.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>50+</CardTitle>
            <CardDescription>Events Organized</CardDescription>
          </CardHeader>
          <CardContent>
            We&#39;ve organized over 50 events to promote Varanasi&#39;s handicrafts and connect artisans with customers.
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-3xl font-semibold mb-6">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="flex flex-col items-center">
            <div className="w-full h-64 relative">
              <Image 
                src={member.image} 
                alt={`Image of ${member.name}`} 
                fill 
                className="object-cover rounded-t-lg"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top', // Focus on the upper part of the image
                }}
              />
            </div>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Brief description of {member.name}&#39;s role and passion for supporting artisans.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
