import { Request, Response } from "express";
import { createBooksStationary, getAllBooksStationary } from "../../services/fillDetails/booksStationaryService";

export const createBooksStationaryDetails = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, schoolName, address, mainService, subService } = req.body;

    if (!fullName || !email || !phone || !mainService || !subService) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uploadedFile = req.file ? req.file.filename : undefined;

    const newEntry = await createBooksStationary({
      fullName,
      email,
      phone,
      schoolName,
      address,
      mainService,
      subService,
      uploadedFile,
    });

    res.status(201).json({ message: "Books & Stationary details saved", data: newEntry });
  } catch (err) {
    console.error("Error saving BooksStationary:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getBooksStationaryDetails = async (req: Request, res: Response) => {
  try {
    const entries = await getAllBooksStationary();
    res.status(200).json({ data: entries });
  } catch (err) {
    console.error("Error fetching BooksStationary:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
