import { mongoose } from "../configs/dbConnection.js";
import { INSTITUTION_STATUSES } from "../types/institution.types.js";
import type { IInstitution, InstitutionModel } from "../types/institution.types.js";

const institutionSchema = new mongoose.Schema<IInstitution, InstitutionModel>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
      unique: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizerApplication",
      required: [true, "Application reference is required"],
    },
    name: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      maxlength: [120, "Institution name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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
    logoUrl: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: [...INSTITUTION_STATUSES],
      default: "active",
      index: true,
    },
  },
  { collection: "institutions", timestamps: true },
);

export default mongoose.model<IInstitution, InstitutionModel>("Institution", institutionSchema);
