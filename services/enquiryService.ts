import Vehicle from "../models/fillDetails/Vehicle";
import Health from "../models/fillDetails/Health";
import Auditing from "../models/fillDetails/Auditing";
import BooksStationary from "../models/fillDetails/BooksStationary";
import { Model, Document } from "mongoose";

type AnyModel = Model<Document>;

export const getModelByService = (service: string): AnyModel | null => {
  switch (service) {
    case "Vehicle Insurance": return Vehicle as unknown as AnyModel;
    case "Health Insurance": return Health as unknown as AnyModel;
    case "Auditing": return Auditing as unknown as AnyModel;
    case "BooksStationary": return BooksStationary as unknown as AnyModel;
    default: return null;
  }
};

export const getEnquiriesData = async (service: string) => {
  const Model = getModelByService(service);
  if (!Model) throw new Error("Invalid service");

  // Total & sub-service counts
  const total = await Model.countDocuments();
  const subGroup = await Model.aggregate([
    { $group: { _id: "$subService", count: { $sum: 1 } } }
  ]);
  const subCounts: any = {};
  subGroup.forEach((s: any) => subCounts[s._id] = s.count);

  // Weekly graph (last 7 days)
  const last7Days = new Date(Date.now() - 7*24*60*60*1000);
  const weeklyData = await Model.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weeklyGraph = days.map((day, i) => {
    const item = weeklyData.find((d:any) => d._id === i+1);
    return { name: day, value: item ? item.count : 0 };
  });

  // Monthly & Yearly (placeholders)
  const monthlyGraph = Array.from({ length: 4 }, (_, i) => ({ name: `Week ${i+1}`, value: Math.floor(Math.random()*5)+1 }));
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const yearlyGraph = months.map(m => ({ name: m, value: Math.floor(Math.random()*3)+1 }));

  // Rows
  const rowsData = await Model.find().sort({ createdAt: -1 }).lean();
  const rows = rowsData.map((r: any, idx: number) => {
    switch (service) {
      case "Vehicle Insurance":
        return {
          id: idx+1,
          name: r.fullName,
          email: r.email,
          mobile: r.phone,
          vehicle: r.vehicleNumber || "",
          location: r.location || "",
          mainService: r.mainService,
          subService: r.subService
        };
      case "Health Insurance":
        return {
          id: idx+1,
          name: r.fullName,
          email: r.email,
          dob: r.dob || "",
          location: r.location || "",
          occupation: r.occupation || "",
          annualIncome: r.annualIncome || 0,
          familyMembers: r.familyMembers || 0,
          mobile: r.phone,
          mainService: r.mainService,
          subService: r.subService
        };
      case "Auditing":
      case "BooksStationary":
        return {
          id: idx+1,
          name: r.fullName,
          email: r.email,
          mobile: r.phone,
          companyName: r.companyName || r.schoolName || "",
          address: r.address || "",
          turnover: r.turnover || "",
          yearEstablished: r.yearEstablished || "",
          mainService: r.mainService,
          subService: r.subService
        };
      default:
        return { id: idx+1, ...r };
    }
  });

  return {
    totalEnquiries: { total, ...subCounts },
    graphData: { Weekly: weeklyGraph, Monthly: monthlyGraph, Yearly: yearlyGraph },
    rows
  };
};
