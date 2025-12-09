//28-10-2025
import Vehicle, { IVehicle } from "../../models/fillDetails/Vehicle";
import * as XLSX from "xlsx";
import fs from "fs";

// ✅ Get all vehicle enquiries
export const getVehicleEnquiries = async () => {
  const rowsData = await Vehicle.find().sort({ createdAt: -1 }).lean();

  const rows = rowsData.map((r) => ({
    id: r._id,
    name: r.fullName,
    email: r.email,
    mobile: r.phone,
    vehicle: r.vehicleNumber || "",
    location: r.location || "",
    subService: r.subService,
    uploadedFile: r.uploadedFile || ""
  }));

  const total = await Vehicle.countDocuments();
  const subCounts = await Vehicle.aggregate([
    { $group: { _id: "$subService", count: { $sum: 1 } } }
  ]).then((data: any) => {
    const obj: any = {};
    data.forEach((s: any) => (obj[s._id] = s.count));
    return obj;
  });

  // Weekly graph
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  const weeklyDataAgg = await Vehicle.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
  ]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyGraph = days.map((day, i) => {
    const item = weeklyDataAgg.find((d) => d._id === i + 1);
    return { name: day, value: item ? item.count : 0 };
  });

  // Monthly graph
  const monthlyDataAgg = await Vehicle.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    },
    {
      $group: {
        _id: { $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] } },
        count: { $sum: 1 }
      }
    }
  ]);
  const monthlyGraph = Array.from({ length: 4 }, (_, i) => {
    const item = monthlyDataAgg.find((d) => d._id === i + 1);
    return { name: `Week ${i + 1}`, value: item ? item.count : 0 };
  });

  // Yearly graph
  const yearlyDataAgg = await Vehicle.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const yearlyGraph = months.map((m, i) => {
    const item = yearlyDataAgg.find((d) => d._id === i + 1);
    return { name: m, value: item ? item.count : 0 };
  });

  return {
    totalEnquiries: { total, ...subCounts },
    graphData: { Weekly: weeklyGraph, Monthly: monthlyGraph, Yearly: yearlyGraph },
    rows
  };
};

// ✅ Create single vehicle enquiry
// export const createVehicleEnquiry = async (payload: Partial<IVehicle>) => {
//   return await Vehicle.create(payload);
// };

export const createVehicleEnquiry = async (payload: Partial<IVehicle>) => {
  // 1️⃣ Validate required fields
  if (!payload.email && !payload.phone) {
    throw new Error("Either email or phone number is required.");
  }

  // 2️⃣ Check for existing entry with same email or phone
  // const existing = await Vehicle.findOne({
  //   $or: [
  //     { email: payload.email || null },
  //     { phone: payload.phone || null },
  //   ],
  // });

  // if (existing) {
  //   throw new Error("Duplicate entry: An enquiry with this email or phone already exists.");
  // }

  // 3️⃣ Create new entry
  return await Vehicle.create(payload);
};


// ✅ Update vehicle enquiry
export const updateVehicleEnquiry = async (id: string, payload: Partial<IVehicle>) => {
  return await Vehicle.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ Delete vehicle enquiry
export const deleteVehicleEnquiry = async (id: string) => {
  return await Vehicle.findByIdAndDelete(id);
};

// ✅ Bulk create from Excel (skip duplicates & return summary)
// export const bulkCreateVehicleFromExcel = async (filePath: string) => {
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data: any[] = XLSX.utils.sheet_to_json(sheet);

//   // 🔹 Normalize headers (case-insensitive)
//   const enquiries: Partial<IVehicle>[] = data.map((row) => {
//     const normalizedRow: any = {};
//     for (const key in row) {
//       normalizedRow[key.trim().toLowerCase()] = row[key];
//     }

//     return {
//       fullName: normalizedRow["full name"],
//       email: normalizedRow["email"],
//       phone: normalizedRow["phone"],
//       vehicleNumber: normalizedRow["vehicle number"] || "",
//       location: normalizedRow["location"] || "",
//       mainService: normalizedRow["main service"],
//       subService: normalizedRow["sub service"],
//       bookAppointment: normalizedRow["book appointment"] === "Yes",
//       uploadedFile: normalizedRow["uploaded file"] || ""
//     };
//   }).filter(
//     (r) =>
//       r.fullName &&
//       !r.fullName.trim().toLowerCase().startsWith("customer name")
//   );

//   // 🔹 Get existing emails, phones, or vehicle numbers
//   const allEmails = enquiries.map((e) => e.email).filter(Boolean);
//   const allPhones = enquiries.map((e) => e.phone).filter(Boolean);
//   const allVehicles = enquiries.map((e) => e.vehicleNumber).filter(Boolean);

//   const existing = await Vehicle.find({
//     $or: [
//       { email: { $in: allEmails } },
//       { phone: { $in: allPhones } },
//       { vehicleNumber: { $in: allVehicles } }
//     ]
//   }).lean();

//   const existingEmails = new Set(existing.map((e) => e.email));
//   const existingPhones = new Set(existing.map((e) => e.phone));
//   const existingVehicles = new Set(existing.map((e) => e.vehicleNumber));

//   // 🔹 Split duplicates and new entries
//   const duplicates: any[] = [];
//   const newEntries = enquiries.filter((e) => {
//     const isDuplicate =
//       (e.email && existingEmails.has(e.email)) ||
//       (e.phone && existingPhones.has(e.phone)) ||
//       (e.vehicleNumber && existingVehicles.has(e.vehicleNumber));
//     if (isDuplicate) duplicates.push(e);
//     return !isDuplicate;
//   });

//   // 🔹 Insert only unique ones
//   const inserted = await Vehicle.insertMany(newEntries);
//   fs.unlinkSync(filePath); // remove file after processing

//   return {
//     message: `${inserted.length} new enquiries added. ${duplicates.length} duplicates skipped.`,
//     insertedCount: inserted.length,
//     skippedCount: duplicates.length,
//     duplicates
//   };
// };


export const bulkCreateVehicleFromExcel = async (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  // 🔹 Normalize headers (case-insensitive)
  const enquiries: Partial<IVehicle>[] = data.map((row) => {
    const normalizedRow: any = {};
    for (const key in row) {
      normalizedRow[key.trim().toLowerCase()] = row[key];
    }

    return {
      fullName: normalizedRow["full name"],
      email: normalizedRow["email"],
      phone: normalizedRow["phone"],
      vehicleNumber: normalizedRow["vehicle number"] || "",
      location: normalizedRow["location"] || "",
      mainService: normalizedRow["main service"],
      subService: normalizedRow["sub service"],
      bookAppointment: normalizedRow["book appointment"] === "Yes",
      uploadedFile: normalizedRow["uploaded file"] || ""
    };
  }).filter(
    (r) =>
      r.fullName &&
      !r.fullName.trim().toLowerCase().startsWith("customer name")
  );

  // ❌ Removed: duplicate checking and filtering logic

  // 🔹 Insert ALL entries (no filtering)
  const inserted = await Vehicle.insertMany(enquiries);

  fs.unlinkSync(filePath); // remove file after processing

  return {
    message: `${inserted.length} enquiries added.`,
    insertedCount: inserted.length
  };
};
