export type Availability = 'in-stock' | 'made-to-order' | 'inquiry';

export type OrderFieldKey = 'shade' | 'length' | 'wrist' | 'hardware' | 'clasp' | 'comment';

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  price: number | null;
  category: string;
  availability: Availability;
  image: string;
  imagePosition?: string;
  description: string;
  materials: string[];
  collection?: string;
  relatedIds: string[];
  orderFields: OrderFieldKey[];
  featured?: boolean;
};

export type ProductOptionValues = Partial<Record<OrderFieldKey, string>>;

export type CartItem = {
  productId: string;
  quantity: number;
  options: ProductOptionValues;
};

export type CustomerDetails = {
  name: string;
  contact: string;
  note: string;
};

