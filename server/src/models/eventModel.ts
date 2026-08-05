
import { mongoose } from '../configs/dbConnection.js';
import { generateUniqueSlug } from '../helpers/slugify.js';
import type { IEvent, EventDocument, EventModel } from '../types/event.types.js';
import Event from './eventModel.js';

const ageRangeSchema = new mongoose.Schema(
    {
        min: { type: Number, required: true, min: 0 },
        max: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const priceSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: 'EUR' },
    },
    { _id: false }
);

const scheduleSchema = new mongoose.Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isRecurring: { type: Boolean, default: false },
        recurrenceRule: { type: String, default: null },
    },
    { _id: false }
);

const locationSchema = new mongoose.Schema(
    {
        venueName: { type: String, trim: true, default: null },
        addressLine: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, trim: true, default: null },
        zipCode: {
            type: String,
            trim: true,
            match: [/^\d{5}$/, 'Please enter a valid German postal code (5 digits)'],
            default: null,
        },
        country: { type: String, default: 'DE' },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { _id: false }
);

const capacitySchema = new mongoose.Schema(
    {
        max: { type: Number, required: true, min: 1 },
        current: { type: Number, default: 0, min: 0 },
    },
    { _id: false }
);

const participantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled'],
            default: 'confirmed',
        },
        joinedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);


const eventSchema = new mongoose.Schema<IEvent, EventModel>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        coverImage: { type: String, default: null },
        images: [{ type: String }],
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EventCategory',
            required: [true, 'Category is required'],
            index: true,
        },
        ageRange: { type: ageRangeSchema, required: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
            default: 'pending',
            index: true,
        },
        rejectedReason: { type: String, default: null },
        cancelledReason: { type: String, default: null },
        approvedAt: { type: Date, default: null },
        isFree: { type: Boolean, default: true },
        price: { type: priceSchema, default: null },
        schedule: { type: scheduleSchema, required: true },
        location: { type: locationSchema, required: true },
        capacity: { type: capacitySchema, required: true },
        participants: [participantSchema],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        viewCount: { type: Number, default: 0 },
    },
    { collection: 'events', timestamps: true }
);


//

eventSchema.index({
    "location.coordinates": "2dsphere",  //2dsphere MongoDB'ye "bu alan dünya üzerindeki koordinatları içeriyor" diyen özel bir geospatial index türü.
});


// ── Slug otomatik üretimi ──────────────────────────────
eventSchema.pre('save', async function (this: EventDocument) {
    if (this.isModified('title')) {
        this.slug = await generateUniqueSlug(this.title, async (slug) => {
            const existing = await Event.findOne({ slug, _id: { $ne: this._id } });
            return !!existing;
        });
    }
});

// ── isFree/price tutarlılığı ───────────────────────────
eventSchema.pre('save', function (this: EventDocument) {
    if (this.isFree) {
        this.price = null;
    } else if (!this.price) {
        throw new Error('Price is required for paid events');
    }
});

// ── ageRange.min <= ageRange.max kontrolü ──────────────
eventSchema.pre('save', function (this: EventDocument) {
    if (this.ageRange.min > this.ageRange.max) {
        throw new Error('ageRange.min cannot be greater than ageRange.max');
    }
});

// ── schedule.startDate <= schedule.endDate kontrolü ────
eventSchema.pre('save', function (this: EventDocument) {
    if (this.schedule.endDate && this.schedule.startDate > this.schedule.endDate) {
        throw new Error('schedule.startDate cannot be after schedule.endDate');
    }
});

// ── status "approved" olunca approvedAt otomatik doldurulsun ──
eventSchema.pre('save', function (this: EventDocument) {
    if (this.isModified('status')) {
        if (this.status === 'approved' && !this.approvedAt) {
            this.approvedAt = new Date();
        }
        if (this.status === 'rejected' && !this.rejectedReason) {
            throw new Error('rejectedReason is required when status is "rejected"');
        }
    }
});



export default mongoose.model<IEvent, EventModel>('Event', eventSchema);