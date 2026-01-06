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
});

export type PredictionSchema = z.infer<typeof predictionSchema>;
