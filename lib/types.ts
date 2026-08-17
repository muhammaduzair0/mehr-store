
export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  featured: boolean;
  on_sale: boolean;
  stock_status: string;
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