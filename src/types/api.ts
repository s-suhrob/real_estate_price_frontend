export type CityEnum =
    | "dushanbe"
    | "vakhdat"
    | "bokhtar"
    | "hisor"
    | "khujand"
    | "buston"
    | "rudaki"
    | "tursunzade"
    | "yavan"
    | "kulob"
    | "guliston"
    | "other";

export type BuildingTypeEnum = "new" | "secondhand";

export type RepairEnum = "new_repair" | "with_repair" | "no_repair";

export type BuildingStageEnum = "built" | "under_construction";

export interface ApartmentInput {
    // Core fields (required)
    city: CityEnum;
    area: number;
    building_type: BuildingTypeEnum;
    floor: number;
    repair_type: RepairEnum;
    building_stage: BuildingStageEnum;
    // Extended fields (optional)
    rooms?: number | null;
    total_floors?: number | null;
    year_built?: number | null;
    has_balcony?: boolean | null;
    has_parking?: boolean | null;
}

export interface PredictionResponse {
    price: number;
    range_low: number;
    range_high: number;
    currency: string;
    prediction_id: string | null;
    features: Record<string, any> | null;
}

export interface FeedbackInput {
    prediction_id: string;
    rating: number; // 1-5
    comment?: string | null;
    nonce: string; // Required: one-time challenge token from /challenge endpoint
}

export interface ChallengeResponse {
    nonce: string;
    expires_at: string;
}

export interface ApiError {
    detail: {
        loc: (string | number)[];
        msg: string;
        type: string;
    }[];
}
