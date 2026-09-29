// import XLSX from "xlsx";

// export const generatePolicyExcelTemplate = (): Buffer => {
//   const headers = [
//     // "month",
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
//    * =========================================================
//    * EXAMPLE ROW
//    * =========================================================
//    *
//    * IMPORTANT:
//    * Dates are strings and must be DD/MM/YYYY.
//    *
//    * 01/08/2026 = 1 August 2026
//    * 31/07/2027 = 31 July 2027
//    */
//   const exampleRow = [
//     // "August",
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
//     "01/08/2026",
//     "31/07/2027",
//     500000,
//     20,
//     15000,
//     14000,
//     500,
//     0,
//     "UPI",
//   ];

//   /*
//    * =========================================================
//    * CREATE WORKSHEET
//    * =========================================================
//    */
//   const worksheet = XLSX.utils.aoa_to_sheet([
//     headers,
//     exampleRow,
//   ]);

//   /*
//    * =========================================================
//    * FORCE DATE COLUMNS TO TEXT
//    * =========================================================
//    *
//    * K = policyStartDate
//    * L = endDate
//    *
//    * We prepare the date columns for rows 2-1000 as TEXT.
//    *
//    * This prevents Excel from interpreting:
//    *
//    * 01/08/2026
//    *
//    * as:
//    *
//    * 08/01/2026
//    *
//    * depending on Excel locale.
//    */
//   const MAX_ROWS = 1000;

//   for (let row = 2; row <= MAX_ROWS; row++) {
//     const startDateCell = `K${row}`;
//     const endDateCell = `L${row}`;

//     /*
//      * policyStartDate
//      */
//     worksheet[startDateCell] = {
//       t: "s",
//       v: row === 2 ? "01/08/2026" : "",
//       z: "@",
//     };

//     /*
//      * endDate
//      */
//     worksheet[endDateCell] = {
//       t: "s",
//       v: row === 2 ? "31/07/2027" : "",
//       z: "@",
//     };
//   }

//   /*
//    * =========================================================
//    * WORKSHEET RANGE
//    * =========================================================
//    *
//    * There are 19 columns:
//    *
//    * A -> S
//    *
//    * So the range should end at S, not T.
//    */
//   worksheet["!ref"] = `A1:S${MAX_ROWS}`;

//   /*
//    * =========================================================
//    * COLUMN WIDTHS
//    * =========================================================
//    */
//   worksheet["!cols"] = [
//     { wch: 8 }, // slNo
//     { wch: 25 }, // customerName
//     { wch: 30 }, // email
//     { wch: 15 }, // contact
//     { wch: 20 }, // reference
//     { wch: 18 }, // vehicleNo
//     { wch: 25 }, // variant
//     { wch: 25 }, // insurerCompany
//     { wch: 25 }, // policyNumber
//     { wch: 18 }, // brokingCode
//     { wch: 18 }, // policyStartDate
//     { wch: 18 }, // endDate
//     { wch: 15 }, // idv
//     { wch: 10 }, // ncb
//     { wch: 15 }, // premium
//     { wch: 15 }, // netPremium
//     { wch: 15 }, // cashBack
//     { wch: 18 }, // balancePayment
//     { wch: 22 }, // policyPaymentMode
//   ];

//   /*
//    * =========================================================
//    * CREATE WORKBOOK
//    * =========================================================
//    */
//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(
//     workbook,
//     worksheet,
//     "Policies"
//   );

//   /*
//    * =========================================================
//    * INSTRUCTIONS SHEET
//    * =========================================================
//    */
//   const instructions = [
//     ["Policy Excel Import Instructions"],
//     [""],

//     ["IMPORTANT DATE RULE"],
//     ["Enter all dates strictly as DD/MM/YYYY"],
//     [""],

//     ["Examples:"],
//     ["01/08/2026 = 1 August 2026"],
//     ["31/07/2027 = 31 July 2027"],
//     ["21/07/2027 = 21 July 2027"],
//     [""],

//     ["Date columns:"],
//     ["policyStartDate"],
//     ["endDate"],
//     ["Both must use DD/MM/YYYY"],
//     [""],

//     ["IMPORTANT:"],
//     ["Do not enter dates as MM/DD/YYYY"],
//     ["Do not enter dates as YYYY-MM-DD"],
//     ["Do not enter dates as August 1, 2026"],
//     [""],

//     ["Required fields:"],
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
//   ];

//   const instructionSheet =
//     XLSX.utils.aoa_to_sheet(instructions);

//   instructionSheet["!cols"] = [
//     { wch: 55 },
//   ];

//   XLSX.utils.book_append_sheet(
//     workbook,
//     instructionSheet,
//     "Instructions"
//   );

//   /*
//    * =========================================================
//    * GENERATE XLSX BUFFER
//    * =========================================================
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
    // "month",
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
    "renewalPremium",
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
   * Dates are strings and must be DD/MM/YYYY.
   *
   * 01/08/2026 = 1 August 2026
   * 31/07/2027 = 31 July 2027
   */
  const exampleRow = [
    // "August",
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
    16000, // renewalPremium
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
   * FORCE DATE COLUMNS TO TEXT
   * =========================================================
   *
   * K = policyStartDate
   * L = endDate
   *
   * We prepare the date columns for rows 2-1000 as TEXT.
   *
   * This prevents Excel from interpreting:
   *
   * 01/08/2026
   *
   * as:
   *
   * 08/01/2026
   *
   * depending on Excel locale.
   */
  const MAX_ROWS = 1000;

  for (let row = 2; row <= MAX_ROWS; row++) {
    const startDateCell = `K${row}`;
    const endDateCell = `L${row}`;

    /*
     * policyStartDate
     */
    worksheet[startDateCell] = {
      t: "s",
      v: row === 2 ? "01/08/2026" : "",
      z: "@",
    };

    /*
     * endDate
     */
    worksheet[endDateCell] = {
      t: "s",
      v: row === 2 ? "31/07/2027" : "",
      z: "@",
    };
  }

  /*
   * =========================================================
   * WORKSHEET RANGE
   * =========================================================
   *
   * There are now 20 columns:
   *
   * A -> T
   *
   * Renewal Premium is column Q.
   */
  worksheet["!ref"] = `A1:T${MAX_ROWS}`;

  /*
   * =========================================================
   * COLUMN WIDTHS
   * =========================================================
   */
  worksheet["!cols"] = [
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
    { wch: 18 }, // renewalPremium
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
    "Policies",
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

    ["IMPORTANT:"],
    ["Do not enter dates as MM/DD/YYYY"],
    ["Do not enter dates as YYYY-MM-DD"],
    ["Do not enter dates as August 1, 2026"],
    [""],

    ["Required fields:"],
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
    ["renewalPremium"],
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
    { wch: 55 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    instructionSheet,
    "Instructions",
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
