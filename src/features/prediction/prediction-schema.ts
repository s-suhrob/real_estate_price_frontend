import { z } from "zod";

export const cityEnum = z.enum([
    "dushanbe",
    "vakhdat",
    "bokhtar",
    "hisor",
    "khujand",
    "buston",
    "rudaki",
    "tursunzade",
    "yavan",
    "kulob",
    "guliston",
    "other",
]);

export const buildingTypeEnum = z.enum(["new", "secondhand"]);

export const repairEnum = z.enum(["new_repair", "with_repair", "no_repair"]);

export const buildingStageEnum = z.enum(["built", "under_construction"]);

// Type for translation function
type TranslateFunction = (key: string) => string;

// Factory function to create schema with translations
export function createPredictionSchema(t: TranslateFunction) {
    return z.object({
        city: cityEnum,
        area: z
            .number()
            .min(8, t("form.validation.areaMin"))
            .max(500, t("form.validation.areaMax")),
        building_type: buildingTypeEnum,
        floor: z
            .number()
            .min(1, t("form.validation.floorMin"))
            .max(30, t("form.validation.floorMax")),
        repair_type: repairEnum,
        building_stage: buildingStageEnum,
        rooms: z
            .number()
            .min(1, t("form.validation.roomsMin"))
            .max(10, t("form.validation.roomsMax")),
        total_floors: z
            .number()
            .min(1, t("form.validation.floorsMin"))
            .max(50, t("form.validation.floorsMax")),
        year_built: z
            .number()
            .min(1950, t("form.validation.yearMin"))
            .max(2030, t("form.validation.yearMax")),
        has_balcony: z.boolean(),
        has_parking: z.boolean(),
    }).refine(
        (data) => data.floor <= data.total_floors,
        {
            message: t("form.validation.floorExceedsTotal"),
            path: ["floor"],
        }
    );
}

// Default schema for types (uses Russian as fallback)
export const predictionSchema = z.object({
    city: cityEnum,
    area: z
        .number()
        .min(8, "Минимальная площадь — 8 м²")
        .max(500, "Максимальная площадь — 500 м²"),
    building_type: buildingTypeEnum,
    floor: z
        .number()
        .min(1, "Минимальный этаж — 1")
        .max(30, "Максимальный этаж — 30"),
    repair_type: repairEnum,
    building_stage: buildingStageEnum,
    rooms: z
        .number()
        .min(1, "Минимум — 1 комната")
        .max(10, "Максимум — 10 комнат"),
    total_floors: z
        .number()
        .min(1, "Минимум — 1 этаж")
        .max(50, "Максимум — 50 этажей"),
    year_built: z
        .number()
        .min(1950, "Минимум — 1950 год")
        .max(2030, "Максимум — 2030 год"),
    has_balcony: z.boolean(),
    has_parking: z.boolean(),
}).refine(
    (data) => data.floor <= data.total_floors,
    {
        message: "Этаж не может быть выше этажности дома",
        path: ["floor"],
    }
);

export type PredictionSchema = z.infer<typeof predictionSchema>;
