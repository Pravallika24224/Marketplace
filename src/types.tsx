export interface Company {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number;
  industry: string;
  seller_name: string;
  seller_email: string;
  seller_id: string;
}

export interface Buyer {
  user_id: string;
}
