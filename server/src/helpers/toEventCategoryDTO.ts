
import type { EventCategoryDocument, EventCategoryDTO } from "../types/eventCategory.types.js";

// Function overloads
export function toEventCategoryDTO(category: EventCategoryDocument): EventCategoryDTO;
export function toEventCategoryDTO(category: EventCategoryDocument[]): EventCategoryDTO[];
export function toEventCategoryDTO(category: EventCategoryDocument | EventCategoryDocument[] | null): EventCategoryDTO | EventCategoryDTO[] | null;

// Implementation
export function toEventCategoryDTO(category: EventCategoryDocument | EventCategoryDocument[] | null): EventCategoryDTO | EventCategoryDTO[] | null {
  if (!category) return null;

  if (Array.isArray(category)) {
    return category.map(item => toEventCategoryDTO(item));
  }

  return {
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    icon: category.icon,
    isActive: category.isActive,
    createdAt: category.createdAt!,
    updatedAt: category.updatedAt!,
  };
}
