//28-10-2025
import BooksStationary, { IBooksStationary } from "../../models/fillDetails/BooksStationary";
import * as XLSX from "xlsx";
import fs from "fs";

// ✅ Get all books & stationary enquiries
export const getBooksStationaryEnquiries = async () => {
  const rowsData = await BooksStationary.find().sort({ createdAt: -1 }).lean();

  const rows = rowsData.map((r) => ({
    id: r._id, // MongoDB _id for consistency
    name: r.fullName,
    email: r.email,
    mobile: r.phone,
    schoolName: r.schoolName || "",
    address: r.address || "",
    subService: r.subService,
    uploadedFile: r.uploadedFile || ""
  }));

  const total = await BooksStationary.countDocuments();
  const subCounts = await BooksStationary.aggregate([
    { $group: { _id: "$subService", count: { $sum: 1 } } }
  ]).then((data: any) => {
    const obj: any = {};
    data.forEach((s: any) => (obj[s._id] = s.count));
    return obj;
  });

  // Weekly graph
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  const weeklyDataAgg = await BooksStationary.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
  ]);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weeklyGraph = days.map((day, i) => {
    const item = weeklyDataAgg.find((d) => d._id === i + 1);
    return { name: day, value: item ? item.count : 0 };
  });

  // Monthly graph
  const monthlyDataAgg = await BooksStationary.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
    { $group: {
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
  const yearlyDataAgg = await BooksStationary.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } }
  ]);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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

// ✅ Create single books & stationary enquiry
// export const createBooksStationaryEnquiry = async (payload: Partial<IBooksStationary>) => {
//   return await BooksStationary.create(payload);
// };
export const createBooksStationaryEnquiry = async (payload: Partial<IBooksStationary>) => {
  // 1️⃣ Validate required fields
  if (!payload.email && !payload.phone) {
    throw new Error("Either email or phone number is required.");
  }

  // 2️⃣ Check for existing entry with same email or phone
  // const existing = await BooksStationary.findOne({
  //   $or: [
  //     { email: payload.email || null },
  //     { phone: payload.phone || null },
  //   ],
  // });

  // if (existing) {
  //   throw new Error("Duplicate entry: An enquiry with this email or phone already exists.");
  // }

  // 3️⃣ Create new entry
  return await BooksStationary.create(payload);
};


// ✅ Update books & stationary enquiry
export const updateBooksStationaryEnquiry = async (id: string, payload: Partial<IBooksStationary>) => {
  return await BooksStationary.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ Delete books & stationary enquiry
export const deleteBooksStationaryEnquiry = async (id: string) => {
  return await BooksStationary.findByIdAndDelete(id);
};

// ✅ Bulk create from Excel (skip duplicates & show which ones were skipped)
// export const bulkCreateBooksStationaryFromExcel = async (filePath: string) => {
//   const workbook = XLSX.readFile(filePath);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];
//   const data: any[] = XLSX.utils.sheet_to_json(sheet);

//   // 🔹 Normalize headers (case-insensitive)
//   const enquiries: Partial<IBooksStationary>[] = data.map((row) => {
//     const normalizedRow: any = {};
//     for (const key in row) {
//       normalizedRow[key.trim().toLowerCase()] = row[key];
//     }

//     return {
//       fullName: normalizedRow["full name"],
//       email: normalizedRow["email"],
//       phone: normalizedRow["phone"],
//       schoolName: normalizedRow["school name"] || "",
//       address: normalizedRow["address"] || "",
//       mainService: normalizedRow["main service"],
//       subService: normalizedRow["sub service"],
//       bookAppointment: normalizedRow["book appointment"] === "Yes",
//       uploadedFile: normalizedRow["uploaded file"] || ""
//     };
//   }).filter(
//     (r) => !(r.fullName && r.fullName.trim().toLowerCase().startsWith("customer name"))
//   );

//   // 🔹 Find existing emails & phones
//   const allEmails = enquiries.map((e) => e.email).filter(Boolean);
//   const allPhones = enquiries.map((e) => e.phone).filter(Boolean);

//   const existing = await BooksStationary.find({
//     $or: [
//       { email: { $in: allEmails } },
//       { phone: { $in: allPhones } }
//     ]
//   }).lean();

//   const existingEmails = new Set(existing.map((e) => e.email));
//   const existingPhones = new Set(existing.map((e) => e.phone));

//   // 🔹 Split duplicates & new ones
//   const duplicates: any[] = [];
//   const newEntries = enquiries.filter((e) => {
//     const isDuplicate =
//       (e.email && existingEmails.has(e.email)) ||
//       (e.phone && existingPhones.has(e.phone));
//     if (isDuplicate) duplicates.push(e);
//     return !isDuplicate;
//   });

//   // 🔹 Insert new ones only
//   const inserted = await BooksStationary.insertMany(newEntries);
//   fs.unlinkSync(filePath); // remove file after processing

//   return {
//     message: `${inserted.length} new enquiries added. ${duplicates.length} duplicates skipped.`,
//     insertedCount: inserted.length,
//     skippedCount: duplicates.length,
//     duplicates
//   };
// };

export const bulkCreateBooksStationaryFromExcel = async (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  // 🔹 Normalize headers (case-insensitive)
  const enquiries: Partial<IBooksStationary>[] = data.map((row) => {
    const normalizedRow: any = {};
    for (const key in row) {
      normalizedRow[key.trim().toLowerCase()] = row[key];
    }

    return {
      fullName: normalizedRow["full name"],
      email: normalizedRow["email"],
      phone: normalizedRow["phone"],
      schoolName: normalizedRow["school name"] || "",
      address: normalizedRow["address"] || "",
      mainService: normalizedRow["main service"],
      subService: normalizedRow["sub service"],
      bookAppointment: normalizedRow["book appointment"] === "Yes",
      uploadedFile: normalizedRow["uploaded file"] || ""
    };
  }).filter(
    (r) => !(r.fullName && r.fullName.trim().toLowerCase().startsWith("customer name"))
  );

  // ❌ Removed duplicate checking logic (emails/phones)

  // 🔹 Insert ALL entries
  const inserted = await BooksStationary.insertMany(enquiries);

  fs.unlinkSync(filePath); // remove file after processing

  return {
    message: `${inserted.length} enquiries added.`,
    insertedCount: inserted.length
  };
};
