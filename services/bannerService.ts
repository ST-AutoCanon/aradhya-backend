import Banner, { IBanner } from "../models/Banner";

// Get latest banner
export const getBanner = async (): Promise<IBanner | null> => {
  return await Banner.findOne().sort({ createdAt: -1 }).exec();
};

// Create or update latest banner
export const saveBanner = async (messages: string[]): Promise<IBanner> => {
  // Find latest banner
  const latest = await Banner.findOne().sort({ createdAt: -1 });

  if (latest) {
    latest.messages = messages; // update existing
    return await latest.save();
  } else {
    const newBanner = new Banner({ messages }); // create new if none exists
    return await newBanner.save();
  }
};

// Delete banner by ID
export const deleteBanner = async (id: string): Promise<IBanner | null> => {
  return await Banner.findByIdAndDelete(id).exec();
};
