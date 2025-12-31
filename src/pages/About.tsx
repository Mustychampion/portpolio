import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Check, Award, Users, Clock, MapPin } from "lucide-react";
import headOfficeImage from "@/assets/head-office.jpg";
import branch1Image from "@/assets/branch-1.jpg";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "We source only the finest materials to ensure durability and excellence in every product.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We're committed to providing exceptional service and support.",
    },
    {
      icon: Clock,
      title: "Reliable Service",
      description: "Fast delivery, responsive support, and trustworthy partnerships you can count on.",
    },
  ];

  const features = [
    "Premium stainless steel construction",
    "Ergonomic and modern designs",
    "Affordable wholesale and retail pricing",
    "Nationwide delivery across Nigeria",
    "Quality assurance on all products",
    "Trusted by homes and restaurants",
  ];

  return (
    <div className="min-h-screen bg-background font-['Poppins']">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About JM Square Kitchen Utensils
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your trusted partner for premium kitchen utensils and cookware in Nigeria, 
              bringing quality and affordability to every kitchen since our founding.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  JM Square Kitchen Utensils was born from a simple vision: to make premium 
                  kitchenware accessible to every Nigerian household. Based in Kano, we've 
                  grown from a small shop to a trusted name in kitchen essentials.
                </p>
                <p>
                  Our journey began with a commitment to quality and customer satisfaction. 
                  Today, we serve thousands of families, restaurants, and businesses across 
                  Nigeria, providing them with durable, elegant, and affordable kitchen solutions.
                </p>
                <p>
                  Every product in our catalog is carefully selected to meet the highest standards 
                  of quality, functionality, and design. We believe your kitchen deserves the best, 
                  and we're here to deliver just that.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">5+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Why Choose JM Square?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-card p-4 rounded-lg">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Visit Our Stores
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find us at any of our convenient locations in Kano
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={headOfficeImage} 
                  alt="JM Square Kitchen Utensils Head Office Store Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Head Office</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No. 9 & 44 Oria Plaza<br />
                  Opp. Festival near Police Station<br />
                  Wambai Market, Kano
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={branch1Image} 
                  alt="JM Square Kitchen Utensils Branch 1 Store Interior at Kurmi Market" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Branch 1</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No 3 Sadi Gabari House<br />
                  Kurmi Market<br />
                  Kano
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Branch 2</h3>
              <p className="text-muted-foreground leading-relaxed">
                D1, D9 and D16<br />
                Beside Kofar Wambai Primary School<br />
                Wambai, Kano
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
