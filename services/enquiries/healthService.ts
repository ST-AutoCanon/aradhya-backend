//28-10-2025
import Health, { IHealth } from "../../models/fillDetails/Health";
import * as XLSX from "xlsx";
import fs from "fs";

// ✅ Get all health enquiries
export const getHealthEnquiries = async () => {
  const rowsData = await Health.find().sort({ createdAt: -1 }).lean();

    const rows = rowsData.map((r) => ({
    id: r._id, // use MongoDB _id for consistency
    name: r.fullName,
      email: r.email,
     mobile: r.phone,
    dob: r.dob || "",
    location: r.location || "",
    occupation: r.occupation || "",
    annualIncome: r.annualIncome || 0,
    familyMembers: r.familyMembers || 0,   
    subService: r.subService,
    uploadedFile: r.uploadedFile || ""
  }));

  const total = await Health.countDocuments();
  const subCounts = await Health.aggregate([
    { $group: { _id: "$subService", count: { $sum: 1 } } }
  ]).then((data: any) => {
    const obj: any = {};
    data.forEach((s: any) => (obj[s._id] = s.count));
    return obj;
  });

  // Weekly graph
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  const weeklyDataAgg = await Health.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }
  ]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyGraph = days.map((day, i) => {
    const item = weeklyDataAgg.find((d) => d._id === i + 1);
    return { name: day, value: item ? item.count : 0 };
  });

  // Monthly graph
  const monthlyDataAgg = await Health.aggregate([
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
  const yearlyDataAgg = await Health.aggregate([
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



export const createHealthEnquiry = async (payload: Partial<IHealth>) => {
  // 1️⃣ Validate required fields
  if (!payload.email && !payload.phone) {
    throw new Error("Either email or phone number is required.");
  }



  // 3️⃣ Create new entry
  return await Health.create(payload);
};


// ✅ Update health enquiry
export const updateHealthEnquiry = async (id: string, payload: Partial<IHealth>) => {
  return await Health.findByIdAndUpdate(id, payload, { new: true });
};

// ✅ Delete health enquiry
export const deleteHealthEnquiry = async (id: string) => {
  return await Health.findByIdAndDelete(id);
};



export const bulkCreateHealthFromExcel = async (filePath: string) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  const excelDateToJSDate = (serial: number) => {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const date = new Date(excelEpoch.getTime() + serial * 86400000);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};


  // 🔹 Normalize headers (case-insensitive)
  const enquiries: Partial<IHealth>[] = data.map((row) => {
    const normalizedRow: any = {};
    for (const key in row) {
      normalizedRow[key.trim().toLowerCase()] = row[key];
    }

    return {
      fullName: normalizedRow["full name"],
      email: normalizedRow["email"],
      phone: normalizedRow["phone"],
      // dob: normalizedRow["dob"] || "",
      dob:
  typeof normalizedRow["dob"] === "number"
    ? excelDateToJSDate(normalizedRow["dob"])
    : normalizedRow["dob"] || "",
      location: normalizedRow["location/pincode"] || "",
      occupation: normalizedRow["occupation"] || "",
      annualIncome: normalizedRow["annual income"] || 0,
      familyMembers: normalizedRow["family members"] || 0,
      mainService: normalizedRow["main service"],
      subService: normalizedRow["sub service"],
      bookAppointment: normalizedRow["book appointment"] === "Yes",
      uploadedFile: normalizedRow["uploaded file"] || ""
    };
  }).filter(
    (r) => !(r.fullName && r.fullName.trim().toLowerCase().startsWith("customer name"))
  );

  // ❌ Removed duplicate checking logic (emails/phones)

  // 🔹 Insert ALL entries (no filtering)
  const inserted = await Health.insertMany(enquiries);
  fs.unlinkSync(filePath); // remove file after processing

  return {
    message: `${inserted.length} enquiries added.`,
    insertedCount: inserted.length
  };
};

