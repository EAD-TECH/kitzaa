export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
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
