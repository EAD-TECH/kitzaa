export interface Institution {
  _id?: string;
  ownerId: string;        
  applicationId: string;  
  name: string;
  slug: string;                 
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  logoUrl?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMyInstitutionResponse {
  error: false;
  institution: Institution;
}

export interface UpdateInstitutionPayload {
  name: string;
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
}

export interface UpdateInstitutionResponse {
  error: false;
  message: string;
  institution: Institution;
}
