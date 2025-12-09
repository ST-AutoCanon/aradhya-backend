import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  messages: string[];
}

const BannerSchema: Schema = new Schema(
  {
    messages: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBanner>("Banner", BannerSchema);
