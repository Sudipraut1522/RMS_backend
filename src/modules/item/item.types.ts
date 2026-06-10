export interface CreateItemInput {
  name: string;
  price: number;
  image_url?: string | null;
  cloudinary_id?: string | null;
}
