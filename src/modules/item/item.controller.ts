import { Request, Response } from 'express';
import { ItemService } from './item.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ItemController {
  static createItem = async (req: Request, res: Response): Promise<void> => {
    const { name, price } = req.body;
    
    // Delegate to service
    const item = await ItemService.createItem(name, parseFloat(price), req.file);
    
    // Return standard success response
    sendSuccess(res, item, 201, 'Item created successfully');
  };

  static getItems = async (req: Request, res: Response): Promise<void> => {
    // Delegate to service
    const items = await ItemService.getAllItems();
    
    // Return standard success response
    sendSuccess(res, items, 200, 'Items retrieved successfully');
  };
}
