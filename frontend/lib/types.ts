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

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stars?: number | null;
    stock_status: boolean;
    image_url?: string | null;
    warranty: number;
    delivery_days: number;
    return_days: number;
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
    make?: string;
    model?: string;
    year_start?: number;
    year_end?: number;
    trim?: string | null;
    drive_type?: string | null;
    body_class?: string | null;

    // product info
    productId: number;
    name: string;
    image_url?: string | null;
    price: number;
    stars?: number | null;
    category: string;
    stock_status: boolean;
    warranty: number;
    delivery_days: number;
    return_days: number;
}


export interface PaginatedParts {
    count: number;
    next: string | null;
    previous: string | null;
    results: Part[];
}

// The final fitment results keyed by category
export type FitmentResults = Record<string, PaginatedParts>;
