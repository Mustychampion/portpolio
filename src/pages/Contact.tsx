import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["No. 9 & 44 Oria Plaza", "Opp. Festival near Police Station", "Wambai Market, Kano"],
    },
    {
      icon: MapPin,
      title: "Branch 1",
      details: ["No 3 Sadi Gabari House", "Kurmi Market, Kano"],
    },
    {
      icon: MapPin,
      title: "Branch 2",
      details: ["D1, D9 and D16", "Beside Kofar Wambai Primary School", "Wambai, Kano"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["08136959832", "07035471468", "09095569295"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@jmsquare.com", "sales@jmsquare.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 8:00 AM - 6:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <div className="min-h-screen bg-background font-['Poppins']">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/20 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <ContactForm />
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Find Our Store
              </h2>
              <p className="text-muted-foreground mb-8">
                Visit our physical store in Kano to see our products firsthand and speak with our team.
              </p>
              <div className="bg-muted rounded-lg overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250645.53534459136!2d8.493480750000001!3d12.0022068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ae817a7b9cd7f1%3A0x6a34586265bf3f5e!2sKano%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JM Square Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground mb-12 text-center">
            Quick answers to common questions about our products and services
          </p>
          
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Do you offer wholesale pricing?</h3>
              <p className="text-muted-foreground">
                Yes! We offer competitive wholesale rates for bulk orders. Contact us for a custom quote.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">What is your delivery timeframe?</h3>
              <p className="text-muted-foreground">
                We deliver nationwide across Nigeria within 3-7 business days depending on your location.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Do you have a warranty policy?</h3>
              <p className="text-muted-foreground">
                All our products come with a manufacturer's warranty. Contact us for specific warranty details.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I return or exchange products?</h3>
              <p className="text-muted-foreground">
                Yes, we accept returns within 7 days of delivery for unused items in original packaging.
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

export default Contact;
