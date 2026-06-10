import { mongoose } from "../configs/dbConnection";
import bcrypt from "bcrypt";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{0,4}$/;

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      trim: true,
      default: null, // State: Bavaria, NRW, etc.
    },
    city: {
      type: String,
      trim: true,
      required: [true, "City is required"],
    },
    district: {
      type: String,
      trim: true,
      default: null, // District
    },
    zipCode: {
      type: String,
      trim: true,
      match: [/^\d{5}$/, "Please enter a valid German postal code (5 digits)"],
      default: null,
    },
    country: {
      type: String,
      default: "DE",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      validate: {
        validator: (value) => PASSWORD_REGEX.test(value),
        message:
          "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
      },
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: (value) => !value || PHONE_REGEX.test(value),
        message:
          "Please enter a valid phone number (international format supported)",
      },
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    // ── Rol & Durum ───────────────────────────────────────────────
    role: {
      type: String,
      enum: ["parent", "organizer", "admin"],
      default: "parent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    language: {
      type: String,
      enum: ["de", "en"],
      default: "de",
    },

    location: {
      type: locationSchema,
      required: [true, "Location information is required"],
    },
    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    savedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    notifications: {
      email: {
        newEvents: { type: Boolean, default: true },
        eventReminders: { type: Boolean, default: true },
        forumReplies: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false },
      },
      push: {
        enabled: { type: Boolean, default: false },
        token: { type: String, default: null, select: false },
      },
    },
  },
  { collection: "users", timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
