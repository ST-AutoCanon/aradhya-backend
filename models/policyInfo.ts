import mongoose, { Document, Schema } from "mongoose";

export interface IPolicy extends Document {
  month: string;
  slNo: number;

  customerName: string;
  email?: string;
  contact: string;

  reference?: string;

  vehicleNo: string;
  variant: string;

  insurerCompany: string;
  policyNumber: string;
  brokingCode?: string;

  policyStartDate: Date;
  endDate: Date;

  idv: number;
  ncb: number;
  premium: number;
  netPremium: number;
  cashBack: number;
  balancePayment: number;

  policyPaymentMode:
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CARD"
    | "CHEQUE"
    | "ONLINE"
    | "OTHER";

  isActive: boolean;



  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<IPolicy>(
  {
    month: {
      type: String,
      required: true,
      trim: true,
    },

    slNo: {
      type: Number,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer email for automatic policy expiry emails
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    // Keep your existing contact field.
    // This can continue to store the customer's phone number.
    contact: {
      type: String,
      required: true,
      trim: true,
    },

    reference: {
      type: String,
      trim: true,
    },

    vehicleNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    variant: {
      type: String,
      required: true,
      trim: true,
    },

    insurerCompany: {
      type: String,
      required: true,
      trim: true,
    },

    policyNumber: {
      type: String,
      required: true,
      trim: true,
    },

    brokingCode: {
      type: String,
      trim: true,
    },

    policyStartDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    idv: {
      type: Number,
      required: true,
      min: 0,
    },

    ncb: {
      type: Number,
      required: true,
      min: 0,
    },

    premium: {
      type: Number,
      required: true,
      min: 0,
    },

    netPremium: {
      type: Number,
      required: true,
      min: 0,
    },

    cashBack: {
      type: Number,
      default: 0,
      min: 0,
    },

    balancePayment: {
      type: Number,
      default: 0,
      min: 0,
    },

    policyPaymentMode: {
      type: String,
      enum: [
        "CASH",
        "UPI",
        "BANK_TRANSFER",
        "CARD",
        "CHEQUE",
        "ONLINE",
        "OTHER",
      ],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },


  },
  {
    timestamps: true,
  }
);

const Policy = mongoose.model<IPolicy>("Policy", policySchema);

export default Policy;