import { Product } from './product.model';

export interface ProductFilters {
    name: string;
    minPrice: number | null;
    maxPrice: number | null;
}

export interface ProductPage {
    items: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
