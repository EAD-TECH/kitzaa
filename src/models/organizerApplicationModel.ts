import { mongoose } from "../configs/dbConnection.js";
import { APPLICATION_STATUSES, REVIEWER_TYPES } from "../types/organizerApplication.types.js";
import type {
  IOrganizerApplication,
  OrganizerApplicationModel,
  IStatusHistory,
  IInstitutionData,
} from "../types/organizerApplication.types.js";

// Basvuru aninda kullanicinin doldurdugu kurum bilgisi (gomulu alt-sema, ayri _id yok)
const institutionDataSchema = new mongoose.Schema<IInstitutionData>(
  {
    name: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      maxlength: [120, "Institution name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false },
);

// Her durum degisiminde bir kayit tutan audit gecmisi (gomulu alt-sema)
const statusHistorySchema = new mongoose.Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: [...APPLICATION_STATUSES],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const organizerApplicationSchema = new mongoose.Schema<IOrganizerApplication, OrganizerApplicationModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    institutionData: {
      type: institutionDataSchema,
      required: [true, "Institution data is required"],
    },
    message: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: [...APPLICATION_STATUSES],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewerType: {
      type: String,
      enum: [...REVIEWER_TYPES],
      default: null,
    },
    rejectedReason: {
      type: String,
      trim: true,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  { collection: "organizerApplications", timestamps: true },
);

export default mongoose.model<IOrganizerApplication, OrganizerApplicationModel>(
  "OrganizerApplication",
  organizerApplicationSchema,
);
