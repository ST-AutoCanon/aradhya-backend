import fs from "fs/promises";
import XLSX from "xlsx";
import Policy from "../../models/policyInfo";

interface ImportResult {
  successCount: number;
  failedCount: number;
  totalRows: number;
  importedPolicies: any[];
  failedRows: {
    row: number;
    data: any;
    error: string;
  }[];
}

const PAYMENT_MODES = [
  "CASH",
  "UPI",
  "BANK_TRANSFER",
  "CARD",
  "CHEQUE",
  "ONLINE",
  "OTHER",
];

const requiredFields = [
  "month",
  "slNo",
  "customerName",
  "contact",
  "vehicleNo",
  "variant",
  "insurerCompany",
  "policyNumber",
  "policyStartDate",
  "endDate",
  "idv",
  "ncb",
  "premium",
  "netPremium",
  "policyPaymentMode",
];

const isEmpty = (value: any): boolean => {
  return value === undefined || value === null || String(value).trim() === "";
};

const parseNumber = (value: any, fieldName: string): number => {
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new Error(`${fieldName} must be a valid number`);
    }

    return value;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  return parsed;
};

// const parseDate = (value: any, fieldName: string): Date => {
//   // Excel Date object
//   if (value instanceof Date) {
//     if (!Number.isNaN(value.getTime())) {
//       return value;
//     }

//     throw new Error(`${fieldName} must be a valid date`);
//   }

//   // Excel serial number
//   if (typeof value === "number") {
//     const excelDate = XLSX.SSF.parse_date_code(value);

//     if (!excelDate) {
//       throw new Error(`${fieldName} must be a valid date`);
//     }

//     return new Date(
//       excelDate.y,
//       excelDate.m - 1,
//       excelDate.d,
//       excelDate.H || 0,
//       excelDate.M || 0,
//       excelDate.S || 0
//     );
//   }

//   if (typeof value === "string") {
//     const trimmedValue = value.trim();

//     if (!trimmedValue) {
//       throw new Error(`${fieldName} must be a valid date`);
//     }

//     // YYYY-MM-DD
//     const yyyyMmDdMatch = trimmedValue.match(
//       /^(\d{4})-(\d{2})-(\d{2})$/
//     );

//     if (yyyyMmDdMatch) {
//       const [, year, month, day] = yyyyMmDdMatch;

//       const date = new Date(
//         Number(year),
//         Number(month) - 1,
//         Number(day)
//       );

//       if (
//         date.getFullYear() === Number(year) &&
//         date.getMonth() === Number(month) - 1 &&
//         date.getDate() === Number(day)
//       ) {
//         return date;
//       }
//     }

//     // DD/MM/YYYY
//     const ddMmYyyyMatch = trimmedValue.match(
//       /^(\d{2})\/(\d{2})\/(\d{4})$/
//     );

//     if (ddMmYyyyMatch) {
//       const [, day, month, year] = ddMmYyyyMatch;

//       const date = new Date(
//         Number(year),
//         Number(month) - 1,
//         Number(day)
//       );

//       if (
//         date.getFullYear() === Number(year) &&
//         date.getMonth() === Number(month) - 1 &&
//         date.getDate() === Number(day)
//       ) {
//         return date;
//       }
//     }

//     // MM/DD/YYYY
//     const mmDdYyyyMatch = trimmedValue.match(
//       /^(\d{2})\/(\d{2})\/(\d{4})$/
//     );

//     if (mmDdYyyyMatch) {
//       const [, month, day, year] = mmDdYyyyMatch;

//       const date = new Date(
//         Number(year),
//         Number(month) - 1,
//         Number(day)
//       );

//       if (
//         date.getFullYear() === Number(year) &&
//         date.getMonth() === Number(month) - 1 &&
//         date.getDate() === Number(day)
//       ) {
//         return date;
//       }
//     }

//     // Last fallback
//     const date = new Date(trimmedValue);

//     if (!Number.isNaN(date.getTime())) {
//       return date;
//     }
//   }

//   throw new Error(`${fieldName} must be a valid date`);
// };


const parseDate = (value: any, fieldName: string): Date => {
  // -----------------------------------------
  // 1. Excel / JavaScript Date object
  // -----------------------------------------
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid date`);
    }

    // Remove timezone/time component.
    // Store date-only value at UTC midnight.
    return new Date(
      Date.UTC(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      )
    );
  }

  // -----------------------------------------
  // 2. Excel serial number
  // -----------------------------------------
  if (typeof value === "number") {
    const excelDate = XLSX.SSF.parse_date_code(value);

    if (!excelDate) {
      throw new Error(`${fieldName} must be a valid date`);
    }

    return new Date(
      Date.UTC(
        excelDate.y,
        excelDate.m - 1,
        excelDate.d
      )
    );
  }

  // -----------------------------------------
  // 3. String
  // -----------------------------------------
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error(`${fieldName} must be a valid date`);
    }

    // -----------------------------------------
    // DD/MM/YYYY
    // Example: 28/03/2027
    // Also accepts: 28/3/2027
    // -----------------------------------------
    let match = trimmedValue.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (match) {
      const [, day, month, year] = match;

      const date = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day)
        )
      );

      if (
        date.getUTCFullYear() === Number(year) &&
        date.getUTCMonth() === Number(month) - 1 &&
        date.getUTCDate() === Number(day)
      ) {
        return date;
      }

      throw new Error(
        `${fieldName} must be a valid date`
      );
    }

    // -----------------------------------------
    // DD/MM/YYYY HH:mm:ss AM/PM
    // Example:
    // 28/3/2027 12:00:10 AM
    // -----------------------------------------
    match = trimmedValue.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+\d{1,2}:\d{2}:\d{2}\s*(AM|PM)$/i
    );

    if (match) {
      const [, day, month, year] = match;

      const date = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day)
        )
      );

      if (
        date.getUTCFullYear() === Number(year) &&
        date.getUTCMonth() === Number(month) - 1 &&
        date.getUTCDate() === Number(day)
      ) {
        return date;
      }

      throw new Error(
        `${fieldName} must be a valid date`
      );
    }

    // -----------------------------------------
    // ISO date
    // Example:
    // 2026-07-31T18:29:59.999Z
    // -----------------------------------------
    const isoDate = new Date(trimmedValue);

    if (!Number.isNaN(isoDate.getTime())) {
      return new Date(
        Date.UTC(
          isoDate.getUTCFullYear(),
          isoDate.getUTCMonth(),
          isoDate.getUTCDate()
        )
      );
    }
  }

  throw new Error(
    `${fieldName} must be in DD/MM/YYYY format`
  );
};

const DUMMY_CUSTOMER_NAMES = [
  "rahul example",
  "test",
  "dummy",
];

const isDummyRow = (row: any): boolean => {
  const customerName = String(row?.customerName ?? "")
    .trim()
    .toLowerCase();

  return DUMMY_CUSTOMER_NAMES.includes(customerName);
};

const validateRow = (row: any, rowNumber: number) => {
  // Check required fields
  for (const field of requiredFields) {
    if (isEmpty(row[field])) {
      throw new Error(`${field} is required`);
    }
  }

  const slNo = parseNumber(row.slNo, "slNo");
  const idv = parseNumber(row.idv, "idv");
  const ncb = parseNumber(row.ncb, "ncb");
  const premium = parseNumber(row.premium, "premium");
  const netPremium = parseNumber(row.netPremium, "netPremium");

  const cashBack = isEmpty(row.cashBack)
    ? 0
    : parseNumber(row.cashBack, "cashBack");

  const balancePayment = isEmpty(row.balancePayment)
    ? 0
    : parseNumber(row.balancePayment, "balancePayment");

  if (slNo < 0) {
    throw new Error("slNo cannot be negative");
  }

  if (idv < 0) {
    throw new Error("idv cannot be negative");
  }

  if (ncb < 0) {
    throw new Error("ncb cannot be negative");
  }

  if (premium < 0) {
    throw new Error("premium cannot be negative");
  }

  if (netPremium < 0) {
    throw new Error("netPremium cannot be negative");
  }

  if (cashBack < 0) {
    throw new Error("cashBack cannot be negative");
  }

  if (balancePayment < 0) {
    throw new Error("balancePayment cannot be negative");
  }

  const policyPaymentMode = String(row.policyPaymentMode)
    .trim()
    .toUpperCase();

  if (!PAYMENT_MODES.includes(policyPaymentMode)) {
    throw new Error(
      `Invalid policyPaymentMode. Allowed values: ${PAYMENT_MODES.join(", ")}`
    );
  }

  const policyStartDate = parseDate(
    row.policyStartDate,
    "policyStartDate"
  );

  const endDate = parseDate(row.endDate, "endDate");

  if (endDate < policyStartDate) {
    throw new Error("endDate cannot be before policyStartDate");
  }

  return {
    month: String(row.month).trim(),
    slNo,

    customerName: String(row.customerName).trim(),

    email: isEmpty(row.email)
      ? undefined
      : String(row.email).trim().toLowerCase(),

    contact: String(row.contact).trim(),

    reference: isEmpty(row.reference)
      ? undefined
      : String(row.reference).trim(),

    vehicleNo: String(row.vehicleNo).trim().toUpperCase(),

    variant: String(row.variant).trim(),

    insurerCompany: String(row.insurerCompany).trim(),

    policyNumber: String(row.policyNumber).trim(),

    brokingCode: isEmpty(row.brokingCode)
      ? undefined
      : String(row.brokingCode).trim(),

    policyStartDate,

    endDate,

    idv,

    ncb,

    premium,

    netPremium,

    cashBack,

    balancePayment,

    policyPaymentMode,

    isActive: true,
  };
};

export const importPoliciesFromExcel = async (
  filePath: string
): Promise<ImportResult> => {
  try {
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new Error("Excel file does not contain any sheet");
    }

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: true,
    });

    if (rows.length === 0) {
      throw new Error("Excel file does not contain any data");
    }

    const importedPolicies: any[] = [];

    const failedRows: {
      row: number;
      data: any;
      error: string;
    }[] = [];

    /*
     * Process rows one by one.
     *
     * Excel row starts from 2 because row 1 contains headers.
     */
for (let index = 0; index < rows.length; index++) {
  const rowNumber = index + 2;
  const row = rows[index] as any;

  // Skip dummy/template rows
  if (isDummyRow(row)) {
    console.log(
      `Skipping dummy/template row ${rowNumber}: ${String(
        row.customerName
      ).trim()}`
    );

    continue;
  }

  try {
    const policyData = validateRow(row, rowNumber);

    // Check duplicate policy number
    const existingPolicy = await Policy.findOne({
      policyNumber: policyData.policyNumber,
    });

    if (existingPolicy) {
      throw new Error(
        `Policy number already exists: ${policyData.policyNumber}`
      );
    }

    // Check duplicate policy number inside the same Excel file
    const duplicateInCurrentFile = importedPolicies.find(
      (policy) =>
        policy.policyNumber === policyData.policyNumber
    );

    if (duplicateInCurrentFile) {
      throw new Error(
        `Duplicate policy number in Excel file: ${policyData.policyNumber}`
      );
    }

    const createdPolicy = await Policy.create(policyData);

    importedPolicies.push(createdPolicy);
  } catch (error) {
    failedRows.push({
      row: rowNumber,
      data: row,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

    return {
      successCount: importedPolicies.length,
      failedCount: failedRows.length,
      totalRows: rows.length,
      importedPolicies,
      failedRows,
    };
  } finally {
    /*
     * Delete uploaded Excel file after processing.
     */
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Failed to delete uploaded Excel file:", error);
    }
  }
};