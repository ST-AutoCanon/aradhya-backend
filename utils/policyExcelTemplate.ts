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
   * Example row to show the user
   * how the Excel file should be filled.
   */
  const exampleRow = [
    "August",
    1,
    "Rahul Kumar",
    "rahul@gmail.com",
    "9876543210",
    "ABC Reference",
    "KA01AB1234",
    "Swift VXI",
    "ICICI Lombard",
    "POL123456",
    "BR001",
  new Date(2026, 7, 1),
  new Date(2027, 6, 31),
    500000,
    20,
    15000,
    14000,
    500,
    0,
    "UPI",
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    exampleRow,
  ]);

  /*
   * Set column widths.
   */
  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 8 },
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 22 },
  ];

  /*
   * Create workbook.
   */
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Policies"
  );

  /*
   * Add instructions sheet.
   */
  const instructions = [
    ["Policy Excel Import Instructions"],
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
    [""],
    ["Date format recommendation:"],
    ["YYYY-MM-DD"],
  ];

  const instructionSheet =
    XLSX.utils.aoa_to_sheet(instructions);

  instructionSheet["!cols"] = [{ wch: 40 }];

  XLSX.utils.book_append_sheet(
    workbook,
    instructionSheet,
    "Instructions"
  );

  /*
   * Generate XLSX buffer.
   */
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer;
};