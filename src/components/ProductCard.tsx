import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Eye } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description?: string;
}

const ProductCard = ({ name, category, price, image, description }: ProductCardProps) => {
  const whatsappNumber = "2347035471468";
  const whatsappMessage = encodeURIComponent(
    `Hello JM Square, I'm interested in ${name}. Can you provide more details?`
  );

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {/* Quick view modal logic */}}
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
        </div>
        <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
          {category}
        </span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}
        <p className="text-2xl font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          asChild
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Order via WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
