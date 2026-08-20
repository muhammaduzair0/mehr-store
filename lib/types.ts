
export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  featured: boolean;
  on_sale: boolean;
  stock_status: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  low_stock_amount: number | null;
  backorders_allowed: boolean;
  purchase_note: string;
  short_description: string;
  description: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: { name: string; options: string[] }[];
  meta_data: { key: string; value: string }[];
  tags: { id: number; name: string; slug: string }[];
  type: string;
  status: string;
  catalog_visibility: string;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  variations: number[];
}

export interface WCVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders_allowed: boolean;
  image: { src: string; alt: string } | null;
  attributes: { name: string; option: string }[];
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  image: { src: string; alt: string } | null;
}

export interface WCOrder {
  id: number;
  number: string;
  order_key: string;
  status: string;
  total: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    city: string;
  };
  line_items: {
    id: number;
    name: string;
    quantity: number;
    total: string;
    product_id: number;
  }[];
}