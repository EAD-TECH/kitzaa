export type UserRole = "user" | "organizer" | "admin";

export interface UserLocation {
  state: string;
  city: string;
  district?: string | null;
  zipCode: string;
  country: string;
}

export interface AdminUserDTO {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  language: string;
  location?: UserLocation;
  isEmailVerified: boolean;
  savedEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminUsersResponse {
  error: false;
  details: unknown;
  user: AdminUserDTO[];
}
export interface CreateUserDTO {
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  email: string;
  avatar?: string | null;
  role?: UserRole;
  language?: string;
  location?: UserLocation;
}
export interface UpdateUserDTO {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  role?: UserRole;
  language?: string;
  location?: Partial<UserLocation>;
}
export interface DeleteUser {
  _id: string;
}

export interface CreateUsersResponse {
  error: false;
  details: unknown;
  user: AdminUserDTO;
}

export interface UpdateUserResponse {
  error: false;
  details: unknown;
  user: AdminUserDTO;
}

export interface UserCreateFormProps {
  onSuccess: () => void;
}
