import AuditingModel, { IAuditing } from "../../models/fillDetails/Auditing";

/**
 * Save Auditing Details to DB
 */
export const saveAuditingDetails = async (data: Partial<IAuditing>) => {
  const newAuditing = new AuditingModel(data);
  return await newAuditing.save();
};
