// import fs from "fs/promises";
// import XLSX from "xlsx";
// import Policy from "../../models/policyInfo";

// interface ImportResult {
//   successCount: number;
//   failedCount: number;
//   totalRows: number;
//   importedPolicies: any[];
//   failedRows: {
//     row: number;
//     data: any;
//     error: string;
//   }[];
// }

// const PAYMENT_MODES = [
//   "CASH",
//   "UPI",
//   "BANK_TRANSFER",
//   "CARD",
//   "CHEQUE",
//   "ONLINE",
//   "OTHER",
// ];

// const requiredFields = [
//   "month",
//   "slNo",
//   "customerName",
//   "contact",
//   "vehicleNo",
//   "variant",
//   "insurerCompany",
//   "policyNumber",
//   "policyStartDate",
//   "endDate",
//   "idv",
//   "ncb",
//   "premium",
//   "netPremium",
//   "policyPaymentMode",
// ];

// const isEmpty = (value: any): boolean => {
//   return value === undefined || value === null || String(value).trim() === "";
// };

// const parseNumber = (value: any, fieldName: string): number => {
//   if (typeof value === "number") {
//     if (Number.isNaN(value)) {
//       throw new Error(`${fieldName} must be a valid number`);
//     }

//     return value;
//   }

//   const parsed = Number(value);

//   if (Number.isNaN(parsed)) {
//     throw new Error(`${fieldName} must be a valid number`);
//   }

//   return parsed;
// };



// const parseDate = (value: any, fieldName: string): Date => {
//   // -----------------------------------------
//   // 1. Excel / JavaScript Date object
//   // -----------------------------------------
//   if (value instanceof Date) {
//     if (Number.isNaN(value.getTime())) {
//       throw new Error(`${fieldName} must be a valid date`);
//     }

//     // Remove timezone/time component.
//     // Store date-only value at UTC midnight.
//     return new Date(
//       Date.UTC(
//         value.getFullYear(),
//         value.getMonth(),
//         value.getDate()
//       )
//     );
//   }

//   // -----------------------------------------
//   // 2. Excel serial number
//   // -----------------------------------------
//   if (typeof value === "number") {
//     const excelDate = XLSX.SSF.parse_date_code(value);

//     if (!excelDate) {
//       throw new Error(`${fieldName} must be a valid date`);
//     }

//     return new Date(
//       Date.UTC(
//         excelDate.y,
//         excelDate.m - 1,
//         excelDate.d
//       )
//     );
//   }

//   // -----------------------------------------
//   // 3. String
//   // -----------------------------------------
//   if (typeof value === "string") {
//     const trimmedValue = value.trim();

//     if (!trimmedValue) {
//       throw new Error(`${fieldName} must be a valid date`);
//     }

//     // -----------------------------------------
//     // DD/MM/YYYY
//     // Example: 28/03/2027
//     // Also accepts: 28/3/2027
//     // -----------------------------------------
//     let match = trimmedValue.match(
//       /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
//     );

//     if (match) {
//       const [, day, month, year] = match;

//       const date = new Date(
//         Date.UTC(
//           Number(year),
//           Number(month) - 1,
//           Number(day)
//         )
//       );

//       if (
//         date.getUTCFullYear() === Number(year) &&
//         date.getUTCMonth() === Number(month) - 1 &&
//         date.getUTCDate() === Number(day)
//       ) {
//         return date;
//       }

//       throw new Error(
//         `${fieldName} must be a valid date`
//       );
//     }

//     // -----------------------------------------
//     // DD/MM/YYYY HH:mm:ss AM/PM
//     // Example:
//     // 28/3/2027 12:00:10 AM
//     // -----------------------------------------
//     match = trimmedValue.match(
//       /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+\d{1,2}:\d{2}:\d{2}\s*(AM|PM)$/i
//     );

//     if (match) {
//       const [, day, month, year] = match;

//       const date = new Date(
//         Date.UTC(
//           Number(year),
//           Number(month) - 1,
//           Number(day)
//         )
//       );

//       if (
//         date.getUTCFullYear() === Number(year) &&
//         date.getUTCMonth() === Number(month) - 1 &&
//         date.getUTCDate() === Number(day)
//       ) {
//         return date;
//       }

//       throw new Error(
//         `${fieldName} must be a valid date`
//       );
//     }

//     // -----------------------------------------
//     // ISO date
//     // Example:
//     // 2026-07-31T18:29:59.999Z
//     // -----------------------------------------
//     const isoDate = new Date(trimmedValue);

//     if (!Number.isNaN(isoDate.getTime())) {
//       return new Date(
//         Date.UTC(
//           isoDate.getUTCFullYear(),
//           isoDate.getUTCMonth(),
//           isoDate.getUTCDate()
//         )
//       );
//     }
//   }

//   throw new Error(
//     `${fieldName} must be in DD/MM/YYYY format`
//   );
// };

// const DUMMY_CUSTOMER_NAMES = [
//   "rahul example",
//   "test",
//   "dummy",
// ];

// const isDummyRow = (row: any): boolean => {
//   const customerName = String(row?.customerName ?? "")
//     .trim()
//     .toLowerCase();

//   return DUMMY_CUSTOMER_NAMES.includes(customerName);
// };

// const validateRow = (row: any, rowNumber: number) => {
//   // Check required fields
//   for (const field of requiredFields) {
//     if (isEmpty(row[field])) {
//       throw new Error(`${field} is required`);
//     }
//   }

//   const slNo = parseNumber(row.slNo, "slNo");
//   const idv = parseNumber(row.idv, "idv");
//   const ncb = parseNumber(row.ncb, "ncb");
//   const premium = parseNumber(row.premium, "premium");
//   const netPremium = parseNumber(row.netPremium, "netPremium");

//   const cashBack = isEmpty(row.cashBack)
//     ? 0
//     : parseNumber(row.cashBack, "cashBack");

//   const balancePayment = isEmpty(row.balancePayment)
//     ? 0
//     : parseNumber(row.balancePayment, "balancePayment");

//   if (slNo < 0) {
//     throw new Error("slNo cannot be negative");
//   }

//   if (idv < 0) {
//     throw new Error("idv cannot be negative");
//   }

//   if (ncb < 0) {
//     throw new Error("ncb cannot be negative");
//   }

//   if (premium < 0) {
//     throw new Error("premium cannot be negative");
//   }

//   if (netPremium < 0) {
//     throw new Error("netPremium cannot be negative");
//   }

//   if (cashBack < 0) {
//     throw new Error("cashBack cannot be negative");
//   }

//   if (balancePayment < 0) {
//     throw new Error("balancePayment cannot be negative");
//   }

//   const policyPaymentMode = String(row.policyPaymentMode)
//     .trim()
//     .toUpperCase();

//   if (!PAYMENT_MODES.includes(policyPaymentMode)) {
//     throw new Error(
//       `Invalid policyPaymentMode. Allowed values: ${PAYMENT_MODES.join(", ")}`
//     );
//   }

//   const policyStartDate = parseDate(
//     row.policyStartDate,
//     "policyStartDate"
//   );

//   const endDate = parseDate(row.endDate, "endDate");

//   if (endDate < policyStartDate) {
//     throw new Error("endDate cannot be before policyStartDate");
//   }

//   return {
//     month: String(row.month).trim(),
//     slNo,

//     customerName: String(row.customerName).trim(),

//     email: isEmpty(row.email)
//       ? undefined
//       : String(row.email).trim().toLowerCase(),

//     contact: String(row.contact).trim(),

//     reference: isEmpty(row.reference)
//       ? undefined
//       : String(row.reference).trim(),

//     vehicleNo: String(row.vehicleNo).trim().toUpperCase(),

//     variant: String(row.variant).trim(),

//     insurerCompany: String(row.insurerCompany).trim(),

//     policyNumber: String(row.policyNumber).trim(),

//     brokingCode: isEmpty(row.brokingCode)
//       ? undefined
//       : String(row.brokingCode).trim(),

//     policyStartDate,

//     endDate,

//     idv,

//     ncb,

//     premium,

//     netPremium,

//     cashBack,

//     balancePayment,

//     policyPaymentMode,

//     isActive: true,
//   };
// };

// export const importPoliciesFromExcel = async (
//   filePath: string
// ): Promise<ImportResult> => {
//   try {
//     const workbook = XLSX.readFile(filePath, {
//       // cellDates: true,
//         cellDates: false,
//     });

//     const sheetName = workbook.SheetNames[0];

//     if (!sheetName) {
//       throw new Error("Excel file does not contain any sheet");
//     }

//     const worksheet = workbook.Sheets[sheetName];

//     const rows = XLSX.utils.sheet_to_json(worksheet, {
//       defval: "",
//       raw: true,
//     });

//     if (rows.length === 0) {
//       throw new Error("Excel file does not contain any data");
//     }

//     const importedPolicies: any[] = [];

//     const failedRows: {
//       row: number;
//       data: any;
//       error: string;
//     }[] = [];

//     /*
//      * Process rows one by one.
//      *
//      * Excel row starts from 2 because row 1 contains headers.
//      */
// for (let index = 0; index < rows.length; index++) {
//   const rowNumber = index + 2;
//   const row = rows[index] as any;

//   // Skip dummy/template rows
//   if (isDummyRow(row)) {
//     console.log(
//       `Skipping dummy/template row ${rowNumber}: ${String(
//         row.customerName
//       ).trim()}`
//     );

//     continue;
//   }

//   try {
//     console.log("policyStartDate RAW:", row.policyStartDate);
// console.log("policyStartDate TYPE:", typeof row.policyStartDate);

// console.log("endDate RAW:", row.endDate);
// console.log("endDate TYPE:", typeof row.endDate);
//     const policyData = validateRow(row, rowNumber);

//     // Check duplicate policy number
//     const existingPolicy = await Policy.findOne({
//       policyNumber: policyData.policyNumber,
//     });

//     if (existingPolicy) {
//       throw new Error(
//         `Policy number already exists: ${policyData.policyNumber}`
//       );
//     }

//     // Check duplicate policy number inside the same Excel file
//     const duplicateInCurrentFile = importedPolicies.find(
//       (policy) =>
//         policy.policyNumber === policyData.policyNumber
//     );

//     if (duplicateInCurrentFile) {
//       throw new Error(
//         `Duplicate policy number in Excel file: ${policyData.policyNumber}`
//       );
//     }

//     const createdPolicy = await Policy.create(policyData);

//     importedPolicies.push(createdPolicy);
//   } catch (error) {
//     failedRows.push({
//       row: rowNumber,
//       data: row,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Unknown error",
//     });
//   }
// }

//     return {
//       successCount: importedPolicies.length,
//       failedCount: failedRows.length,
//       totalRows: rows.length,
//       importedPolicies,
//       failedRows,
//     };
//   } finally {
//     /*
//      * Delete uploaded Excel file after processing.
//      */
//     try {
//       await fs.unlink(filePath);
//     } catch (error) {
//       console.error("Failed to delete uploaded Excel file:", error);
//     }
//   }
// };




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

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const isEmpty = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
};

/*
 * Check whether an entire Excel row is empty.
 *
 * This is important because the template creates date cells
 * in empty rows up to row 1000.
 *
 * Those rows should NOT be validated.
 */
const isCompletelyEmptyRow = (row: any): boolean => {
  return !Object.values(row).some((value) => {
    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );
  });
};

const parseNumber = (
  value: any,
  fieldName: string
): number => {
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new Error(
        `${fieldName} must be a valid number`
      );
    }

    return value;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(
      `${fieldName} must be a valid number`
    );
  }

  return parsed;
};

/*
 * =========================================================
 * DATE PARSER
 * =========================================================
 *
 * ONLY DD/MM/YYYY is accepted.
 *
 * Examples:
 *
 * 01/08/2026 -> 1 August 2026
 * 1/8/2026   -> 1 August 2026
 * 31/07/2027 -> 31 July 2027
 *
 * Excel serial numbers are intentionally rejected.
 *
 * Why?
 *
 * If Excel has already converted:
 *
 * 01/08/2026
 *
 * into an Excel serial number, the original DD/MM/YYYY
 * information has already been lost.
 *
 * The backend cannot safely know whether the user originally
 * entered DD/MM/YYYY or MM/DD/YYYY.
 */
const parseDate = (
  value: any,
  fieldName: string
): Date => {
  /*
   * -------------------------------------------------------
   * 1. Reject JavaScript Date objects
   * -------------------------------------------------------
   *
   * We want the Excel import to use explicit DD/MM/YYYY
   * strings only.
   */
  if (value instanceof Date) {
    throw new Error(
      `${fieldName} must be entered as DD/MM/YYYY`
    );
  }

  /*
   * -------------------------------------------------------
   * 2. Reject Excel serial numbers
   * -------------------------------------------------------
   *
   * Example:
   *
   * 46394
   *
   * We cannot safely determine whether this originally
   * represented DD/MM/YYYY or MM/DD/YYYY.
   */
  if (typeof value === "number") {
    throw new Error(
      `${fieldName} must be entered as DD/MM/YYYY`
    );
  }

  /*
   * -------------------------------------------------------
   * 3. DD/MM/YYYY string
   * -------------------------------------------------------
   */
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error(
        `${fieldName} must be entered as DD/MM/YYYY`
      );
    }

    /*
     * Accept:
     *
     * 01/08/2026
     * 1/8/2026
     * 01/8/2026
     * 1/08/2026
     */
    const match = trimmedValue.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (!match) {
      throw new Error(
        `${fieldName} must be in DD/MM/YYYY format. Example: 01/08/2026`
      );
    }

    const [, dayStr, monthStr, yearStr] = match;

    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    /*
     * Create UTC date to avoid timezone shifting.
     */
    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

    /*
     * Validate that JavaScript did not normalize
     * an invalid date.
     *
     * Example:
     *
     * 31/02/2027
     *
     * must fail.
     */
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(
        `${fieldName} is not a valid date`
      );
    }

    return date;
  }

  throw new Error(
    `${fieldName} must be in DD/MM/YYYY format. Example: 01/08/2026`
  );
};

/*
 * =========================================================
 * DUMMY / TEMPLATE ROW
 * =========================================================
 *
 * The generated template contains an example row.
 *
 * This prevents the example from being imported as a real
 * policy.
 */
const DUMMY_CUSTOMER_NAMES = [
  "rahul example",
  "test",
  "dummy",
];

const isDummyRow = (row: any): boolean => {
  const customerName = String(
    row?.customerName ?? ""
  )
    .trim()
    .toLowerCase();

  return DUMMY_CUSTOMER_NAMES.includes(
    customerName
  );
};

/*
 * =========================================================
 * VALIDATE ROW
 * =========================================================
 */

const validateRow = (
  row: any,
  rowNumber: number
) => {
  /*
   * -------------------------------------------------------
   * Required fields
   * -------------------------------------------------------
   */
  for (const field of requiredFields) {
    if (isEmpty(row[field])) {
      throw new Error(
        `${field} is required`
      );
    }
  }

  /*
   * -------------------------------------------------------
   * Numbers
   * -------------------------------------------------------
   */
  const slNo = parseNumber(
    row.slNo,
    "slNo"
  );

  const idv = parseNumber(
    row.idv,
    "idv"
  );

  const ncb = parseNumber(
    row.ncb,
    "ncb"
  );

  const premium = parseNumber(
    row.premium,
    "premium"
  );

  const netPremium = parseNumber(
    row.netPremium,
    "netPremium"
  );

  const cashBack = isEmpty(row.cashBack)
    ? 0
    : parseNumber(
        row.cashBack,
        "cashBack"
      );

  const balancePayment = isEmpty(
    row.balancePayment
  )
    ? 0
    : parseNumber(
        row.balancePayment,
        "balancePayment"
      );

  /*
   * -------------------------------------------------------
   * Number validation
   * -------------------------------------------------------
   */

  if (slNo < 0) {
    throw new Error(
      "slNo cannot be negative"
    );
  }

  if (idv < 0) {
    throw new Error(
      "idv cannot be negative"
    );
  }

  if (ncb < 0) {
    throw new Error(
      "ncb cannot be negative"
    );
  }

  if (premium < 0) {
    throw new Error(
      "premium cannot be negative"
    );
  }

  if (netPremium < 0) {
    throw new Error(
      "netPremium cannot be negative"
    );
  }

  if (cashBack < 0) {
    throw new Error(
      "cashBack cannot be negative"
    );
  }

  if (balancePayment < 0) {
    throw new Error(
      "balancePayment cannot be negative"
    );
  }

  /*
   * -------------------------------------------------------
   * Payment mode
   * -------------------------------------------------------
   */

  const policyPaymentMode = String(
    row.policyPaymentMode
  )
    .trim()
    .toUpperCase();

  if (
    !PAYMENT_MODES.includes(
      policyPaymentMode
    )
  ) {
    throw new Error(
      `Invalid policyPaymentMode. Allowed values: ${PAYMENT_MODES.join(
        ", "
      )}`
    );
  }

  /*
   * -------------------------------------------------------
   * Dates
   * -------------------------------------------------------
   */

  const policyStartDate = parseDate(
    row.policyStartDate,
    "policyStartDate"
  );

  const endDate = parseDate(
    row.endDate,
    "endDate"
  );

  if (endDate < policyStartDate) {
    throw new Error(
      "endDate cannot be before policyStartDate"
    );
  }

  /*
   * -------------------------------------------------------
   * Return cleaned policy data
   * -------------------------------------------------------
   */

  return {
    month: String(
      row.month
    ).trim(),

    slNo,

    customerName: String(
      row.customerName
    ).trim(),

    email: isEmpty(row.email)
      ? undefined
      : String(
          row.email
        )
          .trim()
          .toLowerCase(),

    contact: String(
      row.contact
    ).trim(),

    reference: isEmpty(
      row.reference
    )
      ? undefined
      : String(
          row.reference
        ).trim(),

    vehicleNo: String(
      row.vehicleNo
    )
      .trim()
      .toUpperCase(),

    variant: String(
      row.variant
    ).trim(),

    insurerCompany: String(
      row.insurerCompany
    ).trim(),

    policyNumber: String(
      row.policyNumber
    ).trim(),

    brokingCode: isEmpty(
      row.brokingCode
    )
      ? undefined
      : String(
          row.brokingCode
        ).trim(),

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

/*
 * =========================================================
 * IMPORT EXCEL
 * =========================================================
 */

export const importPoliciesFromExcel =
  async (
    filePath: string
  ): Promise<ImportResult> => {
    try {
      /*
       * -----------------------------------------------------
       * Read workbook
       * -----------------------------------------------------
       *
       * cellDates: false is important.
       *
       * We want to receive date cells as their original
       * values rather than JavaScript Date objects.
       */
      const workbook =
        XLSX.readFile(filePath, {
          cellDates: false,
        });

      const sheetName =
        workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error(
          "Excel file does not contain any sheet"
        );
      }

      const worksheet =
        workbook.Sheets[sheetName];

      /*
       * -----------------------------------------------------
       * Read rows
       * -----------------------------------------------------
       */
      const rawRows =
        XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: "",
            raw: true,
          }
        );

      /*
       * -----------------------------------------------------
       * IMPORTANT:
       *
       * Attach the REAL Excel row number BEFORE filtering.
       *
       * This means:
       *
       * Excel row 2 -> excelRow 2
       * Excel row 3 -> excelRow 3
       * Excel row 10 -> excelRow 10
       *
       * Even if rows 3-9 are empty, row 10 will still
       * correctly report as Excel row 10.
       * -----------------------------------------------------
       */
      const rowsWithNumbers =
        rawRows.map(
          (row: any, index: number) => ({
            row,
            excelRow: index + 2,
          })
        );

      /*
       * -----------------------------------------------------
       * REMOVE COMPLETELY EMPTY ROWS
       * -----------------------------------------------------
       *
       * This is the FIX for:
       *
       * Total: 999
       * Failed: 997
       *
       * Empty rows are removed BEFORE validation.
       *
       * A partially filled row is NOT removed.
       *
       * Example:
       *
       * Row 5:
       * month = ""
       * customerName = "Rahul"
       *
       * This row remains and will correctly produce:
       *
       * month is required
       * -----------------------------------------------------
       */
      const nonEmptyRows =
        rowsWithNumbers.filter(
          ({ row }) =>
            !isCompletelyEmptyRow(row)
        );

      /*
       * -----------------------------------------------------
       * Remove dummy/template example rows
       * -----------------------------------------------------
       */
      const rows =
        nonEmptyRows.filter(
          ({ row, excelRow }) => {
            if (isDummyRow(row)) {
              console.log(
                `Skipping dummy/template row ${excelRow}: ${String(
                  row.customerName
                ).trim()}`
              );

              return false;
            }

            return true;
          }
        );

      /*
       * -----------------------------------------------------
       * No actual data rows
       * -----------------------------------------------------
       */
      if (rows.length === 0) {
        throw new Error(
          "Excel file does not contain any policy data"
        );
      }

      const importedPolicies: any[] =
        [];

      const failedRows: {
        row: number;
        data: any;
        error: string;
      }[] = [];

      /*
       * -----------------------------------------------------
       * Process rows
       * -----------------------------------------------------
       */
      for (const {
        row,
        excelRow,
      } of rows) {
        try {
          /*
           * Debug date values
           */
          console.log(
            `Excel Row ${excelRow}`
          );

          console.log(
            "policyStartDate RAW:",
            row.policyStartDate
          );

          console.log(
            "policyStartDate TYPE:",
            typeof row.policyStartDate
          );

          console.log(
            "endDate RAW:",
            row.endDate
          );

          console.log(
            "endDate TYPE:",
            typeof row.endDate
          );

          /*
           * Validate and clean row
           */
          const policyData =
            validateRow(
              row,
              excelRow
            );

          /*
           * -------------------------------------------------
           * Check duplicate policy number in database
           * -------------------------------------------------
           */
          const existingPolicy =
            await Policy.findOne({
              policyNumber:
                policyData.policyNumber,
            });

          if (existingPolicy) {
            throw new Error(
              `Policy number already exists: ${policyData.policyNumber}`
            );
          }

          /*
           * -------------------------------------------------
           * Check duplicate policy number
           * inside current Excel file
           * -------------------------------------------------
           */
          const duplicateInCurrentFile =
            importedPolicies.find(
              (policy) =>
                policy.policyNumber ===
                policyData.policyNumber
            );

          if (
            duplicateInCurrentFile
          ) {
            throw new Error(
              `Duplicate policy number in Excel file: ${policyData.policyNumber}`
            );
          }

          /*
           * -------------------------------------------------
           * Create policy
           * -------------------------------------------------
           */
          const createdPolicy =
            await Policy.create(
              policyData
            );

          importedPolicies.push(
            createdPolicy
          );
        } catch (error) {
          /*
           * -------------------------------------------------
           * Store failed row
           * -------------------------------------------------
           */
          failedRows.push({
            row: excelRow,
            data: row,
            error:
              error instanceof Error
                ? error.message
                : "Unknown error",
          });
        }
      }

      /*
       * -----------------------------------------------------
       * Return result
       * -----------------------------------------------------
       */
      return {
        successCount:
          importedPolicies.length,

        failedCount:
          failedRows.length,

        totalRows:
          rows.length,

        importedPolicies,

        failedRows,
      };
    } finally {
      /*
       * -----------------------------------------------------
       * Delete uploaded Excel file
       * -----------------------------------------------------
       */
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(
          "Failed to delete uploaded Excel file:",
          error
        );
      }
    }
  };

