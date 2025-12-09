import User from "../models/User";
import bcrypt from "bcryptjs";

export const seedAdminUser = async () => {
  try {
    const adminEmail = "admin@yopmail.com";
    const adminPassword = "admin";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
      });

      console.log("✅ Admin user created:", adminEmail);
    } else {
      console.log("ℹ️ Admin user already exists:", adminEmail);
    }
  } catch (err) {
    console.error("❌ Error seeding admin user:", err);
  }
};
