// import mongoose from "mongoose";

// const MONGO_URI = "mongodb+srv://vinayaksukalpatech07_db_user:8ODZjeFMjT0kdo28@cluster0.0tyhxoj.mongodb.net/?retryWrites=true&w=majority";

// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       dbName: "ARADHYA_PROJECT" // Replace with your actual DB name
//     });

//     console.log("✅ MongoDB Atlas connected successfully");
//   } catch (err: any) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1); // Exit the app if connection fails
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      "mongodb://insuranceadmin:admin@192.168.1.16:27017/insureance"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit the app if connection fails
  }
};

export default connectDB;
