import HealthModel, { IHealth } from "../../models/fillDetails/Health";

/**
 * Save Health Details to DB
 */
export const saveHealthDetails = async (data: Partial<IHealth>) => {
  const newHealth = new HealthModel(data);
  return await newHealth.save();
};
