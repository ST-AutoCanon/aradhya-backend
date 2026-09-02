// import { Router } from "express";
// import ExcelJS from "exceljs";

// const router = Router();

// // Dummy templates
// const templates: Record<string, any[]> = {
//   auditing: [
//     {
//       "Full Name": "Customer Name",
//       Email: "john@example.com",
//       Phone: "1234567890",
//       "Company Name": "ABC Ltd",
//       Turnover: "1000000",
//       "Year Established": "2010",
//       "Main Service": "Auditing",
//       "Sub Service": "Bookkeeping & Day-to-Day Accounting",
//       "Book Appointment": "Yes",
//       "Uploaded File": "file1.pdf",
//     },
//   ],
//   "books-stationary": [
//     {
//       "Full Name": "Customer Name",
//       Email: "john@example.com",
//       Phone: "1234567890",
//       "School Name": "ABC High School",
//       Address: "123 Main Street",
//       "Main Service": "Books & Stationary",
//       "Sub Service": "Customized Notebook",
//       "Book Appointment": "Yes",
//       "Uploaded File": "sample.pdf",
//     },
//   ],
//   health: [
//     {
//       "Full Name": "Customer Name",
//       Email: "john@example.com",
//       Phone: "1234567890",
//       DOB: "01-01-1990",
//       "Location/Pincode": "586128",
//       Occupation: "Engineer",
//       "Annual Income": 50000,
//       "Family Members": 4,
//       "Main Service": "Health",
//       "Sub Service": "Health Insurance",
//       "Book Appointment": "Yes",
//       "Uploaded File": "sample.pdf",
//     },
//   ],
//   vehicle: [
//     {
//       "Full Name": "Customer Name",
//       Email: "john@example.com",
//       Phone: "1234567890",
//       "Vehicle Number": "ABC1234",
//       "Location/Pincode": "586128",
//       "Main Service": "Vehicle",
//       "Sub Service": "Vehicle",
//       "Book Appointment": "Yes",
//       "Uploaded File": "vehicle_doc.pdf",
//     },
//   ],
// };

// // Dropdown options
// const subServiceOptions: Record<string, string[]> = {
//   auditing: [
//     "Bookkeeping & Day-to-Day Accounting",
//     "Financial Reporting & Statements",
//     "Tax Compliance & Planning",
//     "Auditing & Assurance Services",
//     "Payroll & Employee Compliance",
//     "Budgeting, Forecasting & Insights",
//     "Specialised Accounting Solutions",
//     "Business Advisory & Consulting",
//   ],
//   "books-stationary": [
//     "Customized Notebook",
//     "All Publications & Textbooks",
//     "Sports Materials",
//     "Study Materials",
//     "Preschool Setup & Play Equipment",
//   ],
//   health: ["Health Insurance", "Term Life Insurance"],
//   vehicle: ["Two Wheeler", "Four Wheeler"],
// };

// router.get("/download/:service", async (req, res) => {
//   const { service } = req.params;
//   const lowerService = service.toLowerCase();
//   const data = templates[lowerService];

//   if (!data) {
//     return res.status(404).send("Service template not found");
//   }

//   try {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet(service);

//     // Define columns with adjusted widths
//     const narrowCols = [
//       "Phone",
//       "Turnover",
//       "Year Established",
//       "Vehicle Number",
//       "Location",
//       "DOB",
//       "Occupation",
//       "Annual Income",
//       "Family Members",
//       "Main Service",
//       "Book Appointment",
//       "Uploaded File",
//     ];

//     const columns = Object.keys(data[0]).map((key) => ({
//       header: key,
//       key,
//       width: narrowCols.includes(key) ? 18 : 30, // reduced width
//     }));

//     worksheet.columns = columns;

//     // Add data rows
//     worksheet.addRows(data);

//     // 🎨 Style header row
//     const headerRow = worksheet.getRow(1);
//     headerRow.eachCell((cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "1F4E78" }, // Dark blue
//       };
//       cell.font = {
//         color: { argb: "FFFFFF" },
//         bold: true,
//         size: 12,
//       };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//       cell.border = {
//         top: { style: "thin", color: { argb: "FFFFFF" } },
//         left: { style: "thin", color: { argb: "FFFFFF" } },
//         bottom: { style: "thin", color: { argb: "FFFFFF" } },
//         right: { style: "thin", color: { argb: "FFFFFF" } },
//       };
//     });
//     headerRow.height = 25;

//     // Add dropdown (data validation) for "Sub Service"
//     const subOptions = subServiceOptions[lowerService];
//     if (subOptions) {
//       const subServiceCol = columns.findIndex((c) => c.header === "Sub Service") + 1;
//       if (subServiceCol > 0) {
//         for (let i = 2; i <= 100; i++) {
//           worksheet.getCell(i, subServiceCol).dataValidation = {
//             type: "list",
//             allowBlank: true,
//             formulae: [`"${subOptions.join(",")}"`],
//             showErrorMessage: true,
//             errorTitle: "Invalid Selection",
//             error: "Please select a valid option from the dropdown.",
//           };
//         }
//       }
//     }

//     // Send Excel file
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${service}_template.xlsx`
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     console.error("Failed to generate Excel template:", err);
//     res.status(500).send("Failed to generate Excel template");
//   }
// });

// export default router;



import { Router } from "express";
import ExcelJS from "exceljs";

const router = Router();

// Dummy templates
const templates: Record<string, any[]> = {
  auditing: [
    {
      "Full Name": "Customer Name",
      Email: "john@example.com",
      Phone: "1234567890",
      "Company Name": "ABC Ltd",
      Turnover: "1000000",
      "Year Established": "2010",
      "Main Service": "Auditing",
      "Sub Service": "Bookkeeping & Day-to-Day Accounting",
      "Book Appointment": "Yes",
      "Uploaded File": "file1.pdf",
    },
  ],

  "books-stationary": [
    {
      "Full Name": "Customer Name",
      Email: "john@example.com",
      Phone: "1234567890",
      "School Name": "ABC High School",
      Address: "123 Main Street",
      "Main Service": "Books & Stationary",
      "Sub Service": "Customized Notebook",
      "Book Appointment": "Yes",
      "Uploaded File": "sample.pdf",
    },
  ],

  health: [
    {
      "Full Name": "Customer Name",
      Email: "john@example.com",
      Phone: "1234567890",
      DOB: new Date(1990, 0, 1),
      "Location/Pincode": "586128",
      Occupation: "Engineer",
      "Annual Income": 50000,
      "Family Members": 4,
      "Main Service": "Health",
      "Sub Service": "Health Insurance",
      "Book Appointment": "Yes",
      "Uploaded File": "sample.pdf",
    },
  ],

  vehicle: [
    {
      "Full Name": "Customer Name",
      Email: "john@example.com",
      Phone: "1234567890",
      "Vehicle Number": "ABC1234",
      "Location/Pincode": "586128",
      "Main Service": "Vehicle",
      "Sub Service": "Vehicle",
      "Book Appointment": "Yes",
      "Uploaded File": "vehicle_doc.pdf",
    },
  ],
};

// Dropdown options
const subServiceOptions: Record<string, string[]> = {
  auditing: [
    "Bookkeeping & Day-to-Day Accounting",
    "Financial Reporting & Statements",
    "Tax Compliance & Planning",
    "Auditing & Assurance Services",
    "Payroll & Employee Compliance",
    "Budgeting, Forecasting & Insights",
    "Specialised Accounting Solutions",
    "Business Advisory & Consulting",
  ],

  "books-stationary": [
    "Customized Notebook",
    "All Publications & Textbooks",
    "Sports Materials",
    "Study Materials",
    "Preschool Setup & Play Equipment",
  ],

  health: [
    "Health Insurance",
    "Term Life Insurance",
  ],

  vehicle: [
    "Two Wheeler",
    "Four Wheeler",
  ],
};

router.get("/download/:service", async (req, res) => {
  const { service } = req.params;
  const lowerService = service.toLowerCase();

  const data = templates[lowerService];

  if (!data) {
    return res.status(404).send("Service template not found");
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(service);

    // Columns with smaller width
    const narrowCols = [
      "Phone",
      "Turnover",
      "Year Established",
      "Vehicle Number",
      "Location",
      "Location/Pincode",
      "DOB",
      "Occupation",
      "Annual Income",
      "Family Members",
      "Main Service",
      "Book Appointment",
      "Uploaded File",
    ];

    // Create columns
    const columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
      width: narrowCols.includes(key) ? 18 : 30,
    }));

    worksheet.columns = columns;

    // Add data rows
    worksheet.addRows(data);

    // --------------------------------------------------
    // DATE FORMAT
    // --------------------------------------------------

    // Find all date columns and force Excel format to DD/MM/YYYY
    const dateColumns = [
      "DOB",
      "Policy Start Date",
      "End Date",
      "policyStartDate",
      "endDate",
    ];

    dateColumns.forEach((dateColumn) => {
      const columnIndex = columns.findIndex(
        (column) => column.header === dateColumn
      );

      if (columnIndex !== -1) {
        const excelColumnNumber = columnIndex + 1;

        // Format existing rows
        for (let rowNumber = 2; rowNumber <= 100; rowNumber++) {
          worksheet.getCell(
            rowNumber,
            excelColumnNumber
          ).numFmt = "dd/mm/yyyy";
        }
      }
    });

    // --------------------------------------------------
    // HEADER STYLE
    // --------------------------------------------------

    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F4E78" },
      };

      cell.font = {
        color: { argb: "FFFFFF" },
        bold: true,
        size: 12,
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      cell.border = {
        top: {
          style: "thin",
          color: { argb: "FFFFFF" },
        },
        left: {
          style: "thin",
          color: { argb: "FFFFFF" },
        },
        bottom: {
          style: "thin",
          color: { argb: "FFFFFF" },
        },
        right: {
          style: "thin",
          color: { argb: "FFFFFF" },
        },
      };
    });

    headerRow.height = 25;

    // --------------------------------------------------
    // SUB SERVICE DROPDOWN
    // --------------------------------------------------

    const subOptions = subServiceOptions[lowerService];

    if (subOptions) {
      const subServiceCol =
        columns.findIndex(
          (column) => column.header === "Sub Service"
        ) + 1;

      if (subServiceCol > 0) {
        for (let i = 2; i <= 100; i++) {
          worksheet.getCell(i, subServiceCol).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`"${subOptions.join(",")}"`],
            showErrorMessage: true,
            errorTitle: "Invalid Selection",
            error:
              "Please select a valid option from the dropdown.",
          };
        }
      }
    }

    // --------------------------------------------------
    // SEND EXCEL FILE
    // --------------------------------------------------

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${service}_template.xlsx`
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Failed to generate Excel template:", err);

    res.status(500).send(
      "Failed to generate Excel template"
    );
  }
});

export default router;

