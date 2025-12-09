import BooksStationary, { IBooksStationary } from "../../models/fillDetails/BooksStationary";

export const createBooksStationary = async (data: Partial<IBooksStationary>): Promise<IBooksStationary> => {
  const entry = new BooksStationary(data);
  return await entry.save();
};

export const getAllBooksStationary = async (): Promise<IBooksStationary[]> => {
  return await BooksStationary.find().sort({ createdAt: -1 });
};
