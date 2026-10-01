export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string | undefined;
  description: string | null;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCategoriesResponse {
  error: false;
  details: unknown;
  categories: CategoryDTO[];
}

export interface CreateCategoryDTO {
  name: string;
  description?: string | null;
  icon?: string;
  isActive?: boolean;
}

export interface CreateCategoryResponse {
  error: false;
  category: CategoryDTO;
}

export interface CategoryCreateFormProps {
  onSuccess: () => void;
}

export interface DeleteUser {
  _id: string;
}

export interface UpdateCategoryDTO {
  _id: string;
  name?: string;
  description?: string | null;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateCategoryResponse {
  error: false;
  category: CategoryDTO;
}
