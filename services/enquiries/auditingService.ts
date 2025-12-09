import Auditing, { IAuditing } from "../../models/fillDetails/Auditing";
import * as XLSX from "xlsx";
import fs from "fs";

// ✅ Get all enquiries
export const getAuditingEnquiries = async () => {
  const rowsData = await Auditing.find().sort({ createdAt: -1 }).lean();

  const rows = rowsData.map((r) => ({
    id: r._id,
    name: r.fullName,
    email: r.email,
    mobile: r.phone,
    companyName: r.companyName || "",
    turnover: r.turnover || "",
    yearEstablished: r.yearEstablished || "",
    subService: r.subService,
    uploadedFile: r.uploadedFile || "",
  }));

  const total = await Auditing.countDocuments();
  const subCounts = await Auditing.aggregate([
    { $group: { _id: "$subService", count: { $sum: 1 } } },
  ]).then((data: any) => {
    const obj: any = {};
    data.forEach((s: any) => (obj[s._id] = s.count));
    return obj;
  });

  // Weekly graph
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  const weeklyDataAgg = await Auditing.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
  ]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyGraph = days.map((day, i) => {
    const item = weeklyDataAgg.find((d) => d._id === i + 1);
    return { name: day, value: item ? item.count : 0 };
  });

  // Monthly graph
  const monthlyDataAgg = await Auditing.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    {
      $group: {
        _id: { $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] } },
        count: { $sum: 1 },
      },
    },
  ]);
  const monthlyGraph = Array.from({ length: 4 }, (_, i) => {
    const item = monthlyDataAgg.find((d) => d._id === i + 1);
    return { name: `Week ${i + 1}`, value: item ? item.count : 0 };
  });

  // Yearly graph
  const yearlyDataAgg = await Auditing.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
      },
    },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
  ]);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const yearlyGraph = months.map((m, i) => {
    const item = yearlyDataAgg.find((d) => d._id === i + 1);
    return { name: m, value: item ? item.count : 0 };
  });

  return {
    totalEnquiries: { total, ...subCounts },
    graphData: { Weekly: weeklyGraph, Monthly: monthlyGraph, Yearly: yearlyGraph },
    rows,
  };
};

// ✅ Create enquiry (prevents duplicates)
export const createAuditingEnquiry = async (payload: Partial<IAuditing>) => {
  if (!payload.email && !payload.phone) {
    throw new Error("Either email or phone number is required.");
  }

  // const existing = await Auditing.findOne({
  //   $or: [{ email: payload.email || null }, { phone: payload.phone || null }],
  // });

  // if (existing) {
  //   throw new Error("Duplicate entry: An enquiry with this email or phone already exists.");
  // }

  return await Auditing.create(payload);
};

// ✅ Update enquiry
export const updateAuditingEnquiry = async (id: string, payload: Partial<IAuditing>) => {
  return await Auditing.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ Delete enquiry
export const deleteAuditingEnquiry = async (id: string) => {
  return await Auditing.findByIdAndDelete(id);
};

// ✅ Bulk create from Excel (skip duplicates, insert rest, and report)
// export const bulkCreateFromExcel = async (filePath: string) => {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data: any[] = XLSX.utils.sheet_to_json(sheet);

//     const enquiries: Partial<IAuditing>[] = data
//       .map((row) => ({
//         fullName: row["Full Name"],
//         email: row["Email"],
//         phone: row["Phone"],
//         companyName: row["Company Name"] || "",
//         turnover: row["Turnover"] || "",
//         yearEstablished: row["Year Established"] || "",
//         mainService: row["Main Service"],
//         subService: row["Sub Service"],
//         bookAppointment: row["Book Appointment"] === "Yes",
//         uploadedFile: row["Uploaded File"] || "",
//       }))
//       .filter(
//         (r) =>
//           r.fullName &&
//           !r.fullName.trim().toLowerCase().startsWith("customer name")
//       );

//     // Find existing entries by email or phone
//     const existing = await Auditing.find({
//       $or: [
//         { email: { $in: enquiries.map((e) => e.email).filter(Boolean) } },
//         { phone: { $in: enquiries.map((e) => e.phone).filter(Boolean) } },
//       ],
//     }).lean();

//     const existingEmails = new Set(existing.map((e) => e.email));
//     const existingPhones = new Set(existing.map((e) => e.phone));

//     const duplicates: any[] = [];
//     const newEntries: Partial<IAuditing>[] = [];

//     for (const e of enquiries) {
//       if (existingEmails.has(e.email || "") || existingPhones.has(e.phone || "")) {
//         duplicates.push({
//           fullName: e.fullName,
//           email: e.email,
//           phone: e.phone,
//         });
//       } else {
//         newEntries.push(e);
//       }
//     }

//     // Insert only non-duplicates
//     let inserted: any[] = [];
//     if (newEntries.length > 0) {
//       inserted = await Auditing.insertMany(newEntries, { ordered: false });
//     }

//     return {
//       message: `${inserted.length} new enquiries added. ${duplicates.length} duplicates skipped.`,
//       insertedCount: inserted.length,
//       skippedCount: duplicates.length,
//       duplicates,
//       inserted,
//     };
//   } catch (err) {
//     console.error("Bulk upload error:", err);
//     return {
//       message: "Error during bulk upload",
//       insertedCount: 0,
//       skippedCount: 0,
//       duplicates: [],
//       inserted: [],
//     };
//   } finally {
//     // ✅ Always delete uploaded file
//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//   }
// };



export const bulkCreateFromExcel = async (filePath: string) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    const enquiries: Partial<IAuditing>[] = data
      .map((row) => ({
        fullName: row["Full Name"],
        email: row["Email"],
        phone: row["Phone"],
        companyName: row["Company Name"] || "",
        turnover: row["Turnover"] || "",
        yearEstablished: row["Year Established"] || "",
        mainService: row["Main Service"],
        subService: row["Sub Service"],
        bookAppointment: row["Book Appointment"] === "Yes",
        uploadedFile: row["Uploaded File"] || "",
      }))
      .filter(
        (r) =>
          r.fullName &&
          !r.fullName.trim().toLowerCase().startsWith("customer name")
      );

    // ❌ Removed all duplicate-checking logic

    // Insert EVERYTHING
    let inserted: any[] = [];
    if (enquiries.length > 0) {
      inserted = await Auditing.insertMany(enquiries, { ordered: false });
    }

    return {
      message: `${inserted.length} enquiries added.`,
      insertedCount: inserted.length,
      inserted,
    };
  } catch (err) {
    console.error("Bulk upload error:", err);
    return {
      message: "Error during bulk upload",
      insertedCount: 0,
      inserted: [],
    };
  } finally {
    // ✅ Always delete uploaded file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};


