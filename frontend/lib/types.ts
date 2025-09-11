export interface VehicleInfo {
    vin: string;
    make: string;
    model: string;
    year: string;
    bodyClass: string;
    engine: string;
    driveType?: string;
    trim?: string;
}

export interface ProductImage {
    id: number;
    image_url: string;
}

export interface Product {
    id: number;
    slug?: string; // for detail route
    name: string;
    category: string;
    price: number;
    stars?: number | null;
    stock_status: boolean;
    image_url?: string | null; // keep this for listing
    images?: ProductImage[];   // full gallery for detail
    warranty: number;
    delivery_days: number;
    return_days: number;
    description?: string;
}

export interface Part {
    id: number;
    make?: string;
    model?: string;
    year_start?: number;
    year_end?: number;
    trim?: string | null;
    drive_type?: string | null;
    body_class?: string | null;
    product?: Product; // optional for nested
}

// Normalized object for frontend table rendering
export interface NormalizedPart {
    id: number;
    productId: number;
    slug: string;
    name: string;
    category: string;
    price: number;
    stars: number | null;
    stock_status: boolean;
    image_url: string;
    warranty: number;
    delivery_days: number;
    return_days: number;
    description: string;
    images: ProductImage[];

    // flat part info
    make: string;
    model: string;
    year_start: number;
    year_end: number;
    trim?: string;
    drive_type?: string;
    body_class?: string;
}


export interface PaginatedParts {
    count: number;
    next: string | null;
    previous: string | null;
    results: Part[];
}

// The final fitment results keyed by category
export type FitmentResults = Record<string, PaginatedParts>;
