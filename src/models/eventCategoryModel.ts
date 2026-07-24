
import { mongoose } from '../configs/dbConnection.js';
import { slugify } from '../helpers/slugify.js';
import type { EventCategoryDocument, EventCategoryModel, IEventCategory } from '../types/eventCategory.types.js';




const eventCategorySchema = new mongoose.Schema<IEventCategory, EventCategoryModel>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      // required değil — pre-save hook otomatik dolduracak
    },
    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { collection: 'event_categories', timestamps: true }
);

eventCategorySchema.pre('save', function (this: EventCategoryDocument) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

export default mongoose.model<IEventCategory, EventCategoryModel>(
  'EventCategory',
  eventCategorySchema
);