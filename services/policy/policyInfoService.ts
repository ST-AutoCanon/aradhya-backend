// import Policy, { IPolicy } from "../../models/policyInfo";

// interface CreatePolicyData {
//   month: string;
//   customerName: string;
//   contact: string;
//   reference?: string;
//   vehicleNo: string;
//   variant: string;
//   insurerCompany: string;
//   policyNumber: string;
//   brokingCode?: string;
//   policyStartDate: Date;
//   endDate: Date;
//   idv: number;
//   ncb: number;
//   premium: number;
//   netPremium: number;
//   cashBack?: number;
//   balancePayment?: number;
//   policyPaymentMode:
//     | "CASH"
//     | "UPI"
//     | "BANK_TRANSFER"
//     | "CARD"
//     | "CHEQUE"
//     | "ONLINE"
//     | "OTHER";
//   isActive?: boolean;
// }

// interface UpdatePolicyData extends Partial<CreatePolicyData> {}

// export const createPolicy = async (
//   data: CreatePolicyData
// ): Promise<IPolicy> => {
//   const policy = await Policy.create(data);

//   return policy;
// };

// export const getAllPolicies = async (): Promise<IPolicy[]> => {
//   const policies = await Policy.find().sort({ createdAt: -1 });

//   return policies;
// };

// export const getPolicyById = async (
//   id: string
// ): Promise<IPolicy | null> => {
//   const policy = await Policy.findById(id);

//   return policy;
// };

// export const updatePolicy = async (
//   id: string,
//   data: UpdatePolicyData
// ): Promise<IPolicy | null> => {
//   const policy = await Policy.findByIdAndUpdate(
//     id,
//     { $set: data },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   return policy;
// };

// export const deletePolicy = async (
//   id: string
// ): Promise<IPolicy | null> => {
//   const policy = await Policy.findByIdAndDelete(id);

//   return policy;
// };

// export const activatePolicy = async (
//   id: string
// ): Promise<IPolicy | null> => {
//   const policy = await Policy.findByIdAndUpdate(
//     id,
//     { $set: { isActive: true } },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   return policy;
// };

// export const deactivatePolicy = async (
//   id: string
// ): Promise<IPolicy | null> => {
//   const policy = await Policy.findByIdAndUpdate(
//     id,
//     { $set: { isActive: false } },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   return policy;
// };


import { Types } from "mongoose";
import Policy, { IPolicy } from "../../models/policyInfo";

interface CreatePolicyData {
  customerName: string;
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
  cashBack?: number;
  balancePayment?: number;
  policyPaymentMode:
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CARD"
    | "CHEQUE"
    | "ONLINE"
    | "OTHER";
  isActive?: boolean;
}

interface UpdatePolicyData extends Partial<CreatePolicyData> {}

// export const createPolicy = async (
//   data: CreatePolicyData
// ): Promise<IPolicy> => {
//   const policy = await Policy.create({
//     ...data,
//     notificationCycleId: new Types.ObjectId(),
//   });

//   return policy;
// };


export const createPolicy = async (
  data: CreatePolicyData
): Promise<IPolicy> => {
  console.log("========== CREATE POLICY SERVICE ==========");
  console.log("Incoming policy data:", JSON.stringify(data, null, 2));
  console.log("Incoming policy keys:", Object.keys(data));
  console.log("Incoming month:", (data as any).month);

  console.log("Mongoose Policy schema paths:", Object.keys(Policy.schema.paths));
  console.log(
    "Mongoose month schema path:",
    Policy.schema.path("month")
  );

  const policyData = {
    ...data,
    notificationCycleId: new Types.ObjectId(),
  };

  console.log(
    "Data being sent to Policy.create:",
    JSON.stringify(policyData, null, 2)
  );

  try {
    const policy = await Policy.create(policyData);

    console.log("Policy created successfully:", policy._id);
    console.log("==========================================");

    return policy;
  } catch (error) {
    console.error("========== CREATE POLICY ERROR ==========");

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
    } else {
      console.error("Unknown error:", error);
    }

    console.error("========================================");

    throw error;
  }
};

export const getAllPolicies = async (): Promise<IPolicy[]> => {
  const policies = await Policy.find().sort({ createdAt: -1 });

  return policies;
};

export const getPolicyById = async (
  id: string
): Promise<IPolicy | null> => {
  const policy = await Policy.findById(id);

  return policy;
};

export const updatePolicy = async (
  id: string,
  data: UpdatePolicyData
): Promise<IPolicy | null> => {
  const existingPolicy = await Policy.findById(id);

  if (!existingPolicy) {
    return null;
  }

  /*
   * A new notification cycle is required when the policy
   * expiry/end date changes.
   *
   * This allows the new policy period to send reminders again
   * even if the previous cycle already has SENT notifications.
   */
  let notificationCycleId = existingPolicy.notificationCycleId;

  if (data.endDate) {
    const oldEndDate = new Date(existingPolicy.endDate);
    const newEndDate = new Date(data.endDate);

    const oldDate = oldEndDate.toISOString().split("T")[0];
    const newDate = newEndDate.toISOString().split("T")[0];

    if (oldDate !== newDate) {
      notificationCycleId = new Types.ObjectId();
    }
  }

  /*
   * For old policies created before notificationCycleId was added,
   * create a cycle ID if one doesn't exist.
   */
  if (!notificationCycleId) {
    notificationCycleId = new Types.ObjectId();
  }

  const policy = await Policy.findByIdAndUpdate(
    id,
    {
      $set: {
        ...data,
        notificationCycleId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return policy;
};

export const deletePolicy = async (
  id: string
): Promise<IPolicy | null> => {
  const policy = await Policy.findByIdAndDelete(id);

  return policy;
};

export const activatePolicy = async (
  id: string
): Promise<IPolicy | null> => {
  const policy = await Policy.findByIdAndUpdate(
    id,
    { $set: { isActive: true } },
    {
      new: true,
      runValidators: true,
    }
  );

  return policy;
};

export const deactivatePolicy = async (
  id: string
): Promise<IPolicy | null> => {
  const policy = await Policy.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    {
      new: true,
      runValidators: true,
    }
  );

  return policy;
};