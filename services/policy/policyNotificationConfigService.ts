
import PolicyNotificationConfig, {
  IPolicyNotificationConfig,
  PolicyNotificationScheduleType,
} from "../../models/PolicyNotificationConfig";

/**
 * ================================
 * CREATE CONFIG
 * ================================
 */
export interface CreateNotificationConfigInput {
  name: string;

  type: PolicyNotificationScheduleType;

  daysBeforeExpiry?: number;

  daysAfterExpiry?: number;

  lastNDays?: number;

  subject: string;

  enabled?: boolean;
}

/**
 * ================================
 * UPDATE CONFIG
 * ================================
 */
export interface UpdateNotificationConfigInput {
  name?: string;

  type?: PolicyNotificationScheduleType;

  daysBeforeExpiry?: number;

  daysAfterExpiry?: number;

  lastNDays?: number;

  subject?: string;

  enabled?: boolean;
}

/**
 * ================================
 * VALIDATE CONFIG
 * ================================
 *
 * Validates the configuration before
 * saving it to MongoDB.
 */
const validateConfigInput = (
  data:
    | CreateNotificationConfigInput
    | UpdateNotificationConfigInput,
  isCreate = false
): void => {
  /**
   * NAME
   */
  if (
    isCreate &&
    (!data.name ||
      !data.name.trim())
  ) {
    throw new Error(
      "Reminder name is required."
    );
  }

  if (
    data.name !== undefined &&
    !data.name.trim()
  ) {
    throw new Error(
      "Reminder name cannot be empty."
    );
  }

  /**
   * SUBJECT
   */
  if (
    isCreate &&
    (!data.subject ||
      !data.subject.trim())
  ) {
    throw new Error(
      "Email subject is required."
    );
  }

  if (
    data.subject !== undefined &&
    !data.subject.trim()
  ) {
    throw new Error(
      "Email subject cannot be empty."
    );
  }

  /**
   * TYPE
   */
  const validTypes: PolicyNotificationScheduleType[] =
    [
      "BEFORE_EXPIRY",
      "ON_EXPIRY",
      "AFTER_EXPIRY",
      "LAST_N_DAYS",
    ];

  if (
    data.type !== undefined &&
    !validTypes.includes(
      data.type
    )
  ) {
    throw new Error(
      `Invalid reminder type. Allowed types: ${validTypes.join(
        ", "
      )}`
    );
  }

  /**
   * ================================
   * BEFORE EXPIRY
   * ================================
   */
  if (
    data.type ===
    "BEFORE_EXPIRY"
  ) {
    if (
      data.daysBeforeExpiry ===
        undefined ||
      data.daysBeforeExpiry ===
        null ||
      data.daysBeforeExpiry < 1 ||
      !Number.isInteger(
        data.daysBeforeExpiry
      )
    ) {
      throw new Error(
        "daysBeforeExpiry must be a positive integer for BEFORE_EXPIRY."
      );
    }
  }

  /**
   * ================================
   * AFTER EXPIRY
   * ================================
   */
  if (
    data.type ===
    "AFTER_EXPIRY"
  ) {
    if (
      data.daysAfterExpiry ===
        undefined ||
      data.daysAfterExpiry ===
        null ||
      data.daysAfterExpiry < 1 ||
      !Number.isInteger(
        data.daysAfterExpiry
      )
    ) {
      throw new Error(
        "daysAfterExpiry must be a positive integer for AFTER_EXPIRY."
      );
    }
  }

  /**
   * ================================
   * LAST N DAYS
   * ================================
   */
  if (
    data.type ===
    "LAST_N_DAYS"
  ) {
    if (
      data.lastNDays ===
        undefined ||
      data.lastNDays ===
        null ||
      data.lastNDays < 1 ||
      !Number.isInteger(
        data.lastNDays
      )
    ) {
      throw new Error(
        "lastNDays must be a positive integer for LAST_N_DAYS."
      );
    }
  }
};

/**
 * ================================
 * CREATE
 * ================================
 */
export const createNotificationConfig =
  async (
    data: CreateNotificationConfigInput
  ): Promise<IPolicyNotificationConfig> => {
    validateConfigInput(
      data,
      true
    );

    const config =
      await PolicyNotificationConfig.create(
        {
          name: data.name.trim(),

          type: data.type,

          daysBeforeExpiry:
            data.type ===
            "BEFORE_EXPIRY"
              ? data.daysBeforeExpiry
              : undefined,

          daysAfterExpiry:
            data.type ===
            "AFTER_EXPIRY"
              ? data.daysAfterExpiry
              : undefined,

          lastNDays:
            data.type ===
            "LAST_N_DAYS"
              ? data.lastNDays
              : undefined,

          subject:
            data.subject.trim(),

          enabled:
            data.enabled !==
            undefined
              ? data.enabled
              : true,
        }
      );

    return config;
  };

/**
 * ================================
 * GET ALL
 * ================================
 */
export const getNotificationConfigs =
  async (): Promise<
    IPolicyNotificationConfig[]
  > => {
    return PolicyNotificationConfig.find()
      .sort({
        createdAt: -1,
      })
      .lean();
  };

/**
 * ================================
 * GET ACTIVE
 * ================================
 */
export const getActiveNotificationConfigs =
  async (): Promise<
    IPolicyNotificationConfig[]
  > => {
    return PolicyNotificationConfig.find(
      {
        enabled: true,
      }
    )
      .sort({
        createdAt: -1,
      })
      .lean();
  };

/**
 * ================================
 * GET BY ID
 * ================================
 */
export const getNotificationConfigById =
  async (
    id: string
  ): Promise<IPolicyNotificationConfig> => {
    const config =
      await PolicyNotificationConfig.findById(
        id
      );

    if (!config) {
      throw new Error(
        "Notification configuration not found."
      );
    }

    return config;
  };

/**
 * ================================
 * UPDATE
 * ================================
 */
export const updateNotificationConfig =
  async (
    id: string,
    data: UpdateNotificationConfigInput
  ): Promise<IPolicyNotificationConfig> => {
    /**
     * First get existing config.
     */
    const existing =
      await PolicyNotificationConfig.findById(
        id
      );

    if (!existing) {
      throw new Error(
        "Notification configuration not found."
      );
    }

    /**
     * Determine final values after
     * applying the update.
     */
    const finalType =
      data.type !== undefined
        ? data.type
        : existing.type;

    const finalName =
      data.name !== undefined
        ? data.name
        : existing.name;

    const finalSubject =
      data.subject !== undefined
        ? data.subject
        : existing.subject;

    const finalDaysBefore =
      data.daysBeforeExpiry !==
      undefined
        ? data.daysBeforeExpiry
        : existing.daysBeforeExpiry;

    const finalDaysAfter =
      data.daysAfterExpiry !==
      undefined
        ? data.daysAfterExpiry
        : existing.daysAfterExpiry;

    const finalLastNDays =
      data.lastNDays !==
      undefined
        ? data.lastNDays
        : existing.lastNDays;

    /**
     * Validate final configuration.
     */
    validateConfigInput(
      {
        name: finalName,
        type: finalType,
        daysBeforeExpiry:
          finalDaysBefore,
        daysAfterExpiry:
          finalDaysAfter,
        lastNDays:
          finalLastNDays,
        subject: finalSubject,
      },
      true
    );

    /**
     * Update.
     */
    existing.name =
      finalName.trim();

    existing.type =
      finalType;

    existing.subject =
      finalSubject.trim();

    existing.enabled =
      data.enabled !==
      undefined
        ? data.enabled
        : existing.enabled;

    /**
     * Clear irrelevant fields.
     */
    existing.daysBeforeExpiry =
      finalType ===
      "BEFORE_EXPIRY"
        ? finalDaysBefore
        : undefined;

    existing.daysAfterExpiry =
      finalType ===
      "AFTER_EXPIRY"
        ? finalDaysAfter
        : undefined;

    existing.lastNDays =
      finalType ===
      "LAST_N_DAYS"
        ? finalLastNDays
        : undefined;

    await existing.save();

    return existing;
  };

/**
 * ================================
 * DELETE
 * ================================
 */
export const deleteNotificationConfig =
  async (
    id: string
  ): Promise<void> => {
    const result =
      await PolicyNotificationConfig.findByIdAndDelete(
        id
      );

    if (!result) {
      throw new Error(
        "Notification configuration not found."
      );
    }
  };

/**
 * ================================
 * ENABLE / DISABLE
 * ================================
 */
export const toggleNotificationConfig =
  async (
    id: string,
    enabled: boolean
  ): Promise<IPolicyNotificationConfig> => {
    const config =
      await PolicyNotificationConfig.findByIdAndUpdate(
        id,
        {
          enabled,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!config) {
      throw new Error(
        "Notification configuration not found."
      );
    }

    return config;
  };

