import VehicleModel, { IVehicle } from "../../models/fillDetails/Vehicle";

/**
 * Save Vehicle Details to DB
 */
export const saveVehicleDetails = async (data: Partial<IVehicle>) => {
  const newVehicle = new VehicleModel(data);
  return await newVehicle.save();
};
