// import XLSX from "xlsx";

// export const generatePolicyExcelTemplate = (): Buffer => {
//   const headers = [
//     "month",
//     "slNo",
//     "customerName",
//     "email",
//     "contact",
//     "reference",
//     "vehicleNo",
//     "variant",
//     "insurerCompany",
//     "policyNumber",
//     "brokingCode",
//     "policyStartDate",
//     "endDate",
//     "idv",
//     "ncb",
//     "premium",
//     "netPremium",
//     "cashBack",
//     "balancePayment",
//     "policyPaymentMode",
//   ];

//   /*
//    * Example row to show the user
//    * how the Excel file should be filled.
//    */
//   const exampleRow = [
//     "August",
//     1,
//     "Rahul example",
//     "rahul@gmail.com",
//     "9876543210",
//     "ABC Reference",
//     "KA01AB1234",
//     "Swift VXI",
//     "ICICI Lombard",
//     "POL123456",
//     "BR001",
//   new Date(2026, 7, 1),
//   new Date(2027, 6, 31),
//     500000,
//     20,
//     15000,
//     14000,
//     500,
//     0,
//     "UPI",
//   ];

//   const worksheet = XLSX.utils.aoa_to_sheet([
//     headers,
//     exampleRow,
//   ]);

//   /*
//    * Set column widths.
//    */
//   worksheet["!cols"] = [
//     { wch: 15 },
//     { wch: 8 },
//     { wch: 25 },
//     { wch: 30 },
//     { wch: 15 },
//     { wch: 20 },
//     { wch: 18 },
//     { wch: 25 },
//     { wch: 25 },
//     { wch: 25 },
//     { wch: 18 },
//     { wch: 18 },
//     { wch: 18 },
//     { wch: 15 },
//     { wch: 10 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 18 },
//     { wch: 22 },
//   ];

//   /*
//    * Create workbook.
//    */
//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(
//     workbook,
//     worksheet,
//     "Policies"
//   );

//   /*
//    * Add instructions sheet.
//    */
//   const instructions = [
//     ["Policy Excel Import Instructions"],
//     [""],
//     ["Required fields:"],
//     ["month"],
//     ["slNo"],
//     ["customerName"],
//     ["contact"],
//     ["vehicleNo"],
//     ["variant"],
//     ["insurerCompany"],
//     ["policyNumber"],
//     ["policyStartDate"],
//     ["endDate"],
//     ["idv"],
//     ["ncb"],
//     ["premium"],
//     ["netPremium"],
//     ["policyPaymentMode"],
//     [""],
//     ["Allowed payment modes:"],
//     ["CASH"],
//     ["UPI"],
//     ["BANK_TRANSFER"],
//     ["CARD"],
//     ["CHEQUE"],
//     ["ONLINE"],
//     ["OTHER"],
//     [""],
//     ["Date format recommendation:"],
//     ["YYYY-MM-DD"],
//   ];

//   const instructionSheet =
//     XLSX.utils.aoa_to_sheet(instructions);

//   instructionSheet["!cols"] = [{ wch: 40 }];

//   XLSX.utils.book_append_sheet(
//     workbook,
//     instructionSheet,
//     "Instructions"
//   );

//   /*
//    * Generate XLSX buffer.
//    */
//   const buffer = XLSX.write(workbook, {
//     type: "buffer",
//     bookType: "xlsx",
//   });

//   return buffer;
// };



import XLSX from "xlsx";

export const generatePolicyExcelTemplate = (): Buffer => {
  const headers = [
    "month",
    "slNo",
    "customerName",
    "email",
    "contact",
    "reference",
    "vehicleNo",
    "variant",
    "insurerCompany",
    "policyNumber",
    "brokingCode",
    "policyStartDate",
    "endDate",
    "idv",
    "ncb",
    "premium",
    "netPremium",
    "cashBack",
    "balancePayment",
    "policyPaymentMode",
  ];

  /*
   * =========================================================
   * EXAMPLE ROW
   * =========================================================
   *
   * IMPORTANT:
   * Dates are STRING values, NOT JavaScript Date objects.
   *
   * DD/MM/YYYY
   *
   * 01/08/2026 = 1 August 2026
   * 31/07/2027 = 31 July 2027
   */
  const exampleRow = [
    "August",
    1,
    "Rahul example",
    "rahul@gmail.com",
    "9876543210",
    "ABC Reference",
    "KA01AB1234",
    "Swift VXI",
    "ICICI Lombard",
    "POL123456",
    "BR001",
    "01/08/2026",
    "31/07/2027",
    500000,
    20,
    15000,
    14000,
    500,
    0,
    "UPI",
  ];

  /*
   * =========================================================
   * CREATE WORKSHEET
   * =========================================================
   */
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    exampleRow,
  ]);

  /*
   * =========================================================
   * FORCE EXAMPLE DATE CELLS TO TEXT
   * =========================================================
   *
   * L = policyStartDate
   * M = endDate
   *
   * Do NOT create rows 3-1000 here.
   * Otherwise the importer will treat those rows as data.
   */
  worksheet["L2"] = {
    t: "s",
    v: "01/08/2026",
    z: "@",
  };

  worksheet["M2"] = {
    t: "s",
    v: "31/07/2027",
    z: "@",
  };

  /*
   * =========================================================
   * COLUMN WIDTHS
   * =========================================================
   */
  worksheet["!cols"] = [
    { wch: 15 }, // month
    { wch: 8 }, // slNo
    { wch: 25 }, // customerName
    { wch: 30 }, // email
    { wch: 15 }, // contact
    { wch: 20 }, // reference
    { wch: 18 }, // vehicleNo
    { wch: 25 }, // variant
    { wch: 25 }, // insurerCompany
    { wch: 25 }, // policyNumber
    { wch: 18 }, // brokingCode
    { wch: 18 }, // policyStartDate
    { wch: 18 }, // endDate
    { wch: 15 }, // idv
    { wch: 10 }, // ncb
    { wch: 15 }, // premium
    { wch: 15 }, // netPremium
    { wch: 15 }, // cashBack
    { wch: 18 }, // balancePayment
    { wch: 22 }, // policyPaymentMode
  ];

  /*
   * =========================================================
   * CREATE WORKBOOK
   * =========================================================
   */
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Policies"
  );

  /*
   * =========================================================
   * INSTRUCTIONS SHEET
   * =========================================================
   */
  const instructions = [
    ["Policy Excel Import Instructions"],
    [""],

    ["IMPORTANT DATE RULE"],
    ["Enter all dates strictly as DD/MM/YYYY"],
    [""],

    ["Examples:"],
    ["01/08/2026 = 1 August 2026"],
    ["31/07/2027 = 31 July 2027"],
    ["21/07/2027 = 21 July 2027"],
    [""],

    ["Date columns:"],
    ["policyStartDate"],
    ["endDate"],
    ["Both must use DD/MM/YYYY"],
    [""],

    ["Do NOT enter dates as:"],
    ["08/01/2026"],
    ["2026-08-01"],
    ["August 1, 2026"],
    [""],

    ["Required fields:"],
    ["month"],
    ["slNo"],
    ["customerName"],
    ["contact"],
    ["vehicleNo"],
    ["variant"],
    ["insurerCompany"],
    ["policyNumber"],
    ["policyStartDate"],
    ["endDate"],
    ["idv"],
    ["ncb"],
    ["premium"],
    ["netPremium"],
    ["policyPaymentMode"],
    [""],

    ["Allowed payment modes:"],
    ["CASH"],
    ["UPI"],
    ["BANK_TRANSFER"],
    ["CARD"],
    ["CHEQUE"],
    ["ONLINE"],
    ["OTHER"],
  ];

  const instructionSheet =
    XLSX.utils.aoa_to_sheet(instructions);

  instructionSheet["!cols"] = [
    { wch: 50 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    instructionSheet,
    "Instructions"
  );

  /*
   * =========================================================
   * GENERATE XLSX BUFFER
   * =========================================================
   */
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer;
};