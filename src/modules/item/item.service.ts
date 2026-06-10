import { ItemRepository } from './item.repository.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';
import { Item } from './item.entity.js';
import { CreateItemInput } from './item.types.js';
import { BadRequestError } from '../../errors/BadRequestError.js';

export class ItemService {
  static async createItem(
    name: string,
    price: number,
    imageFile?: Express.Multer.File
  ): Promise<Item> {
    let imageUrl = null;
    let cloudinaryId = null;

    if (imageFile) {
      try {
        const uploadResult = await uploadToCloudinary(imageFile.buffer, 'pos_items');
        imageUrl = uploadResult.secure_url;
        cloudinaryId = uploadResult.public_id;
      } catch (error) {
        throw new BadRequestError('Failed to upload item image to Cloudinary');
      }
    }

    const input: CreateItemInput = {
      name,
      price,
      image_url: imageUrl,
      cloudinary_id: cloudinaryId,
    };

    return await ItemRepository.create(input);
  }

  static async getAllItems(): Promise<Item[]> {
    return await ItemRepository.findAll();
  }
}
