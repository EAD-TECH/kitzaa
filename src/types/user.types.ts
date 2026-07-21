import type { Types, Model, HydratedDocument } from "mongoose";

export interface ILocation {
    state?: string | null;
    city: string;
    district?: string | null;
    zipCode?: string | null;
    country: string;
}

export interface INotificationEmail {
    newEvents: boolean;
    eventReminders: boolean;
    forumReplies: boolean;
    newsletter: boolean;
}

export interface INotificationPush {
    enabled: boolean;
    token?: string | null;
}

export interface INotifications {
    email: INotificationEmail;
    push: INotificationPush;
}

export interface IUser {
    _id?: Types.ObjectId;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    institutionId?: Types.ObjectId | null;
    emailVerifyToken?: string | null;
    passwordResetToken?: string | null;
    passwordResetExp?: Date | null;
    phone?: string | null;
    avatarUrl?: string | null;
    role: 'user' | 'organizer' | 'admin';
    isActive: boolean;
    isEmailVerified: boolean;
    language: 'de' | 'en';
    location?: ILocation;
    refreshToken?: string | null;
    savedEvents?: Types.ObjectId[];
    savedActivities?: Types.ObjectId[];
    notifications?: INotifications;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserMethods {
    matchPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
