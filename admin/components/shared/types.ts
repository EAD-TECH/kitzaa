import { ReactNode } from "react";

export interface KanbanCardProps {
  id: string;
  title: string;
  category?: string;
  time: string;
  description?: string;
  status: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReview?: (id: string) => void;
}

export interface KanbanColumnProps {
  title: string;
  count: number;
  dotColor?: string;
  children?: ReactNode;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: ReactNode; /* sagda belkı buton koyarım event ıcın emın degılm children mantıgıyla bıraktm bunu da yıne */
}

export interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export interface FilterCategoriesProps {
  options: string[]; /* tümü */
  activeOption: string; /* secili olan kategori */
  onChange: (
    selected: string,
  ) => void; /* bu categori filter kısmının fonksıyonu ıcın */
}

/* filter için */

export interface FilterOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface FilterDropDownProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
}

export interface FilterAndSearchProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  filterOptions: FilterOption[];
  selectedValues: string[];
  onFilterSelect: (val: string) => void;
}

export interface KanbanErrorStateProps {
  onRetry: () => void;
}
