import * as yup from 'yup';

export const createItemSchema = yup.object({
  body: yup.object({
    name: yup.string().required('Item name is required').min(2, 'Name must be at least 2 characters'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
  }),
});
