"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPredictionSchema, PredictionSchema } from "../prediction-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePredictPrice } from "../hooks/use-predict";
import { PredictionResponse } from "@/types/api";
import { DisclaimerShort } from "@/components/disclaimer";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/i18n";

interface PredictionFormProps {
    onSuccess: (data: PredictionResponse, area: number) => void;
}

const CITY_VALUES = ["dushanbe", "khujand", "bokhtar", "kulob", "hisor", "vakhdat"] as const;
const BUILDING_TYPE_VALUES = ["new", "secondhand"] as const;
const REPAIR_TYPE_VALUES = ["new_repair", "with_repair", "no_repair"] as const;
const BUILDING_STAGE_VALUES = ["built", "under_construction"] as const;

export function PredictionForm({ onSuccess }: PredictionFormProps) {
    const { t, locale } = useI18n();

    // Create schema with current locale translations
    const schema = useMemo(() => createPredictionSchema(t), [t, locale]);

    const form = useForm<PredictionSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            city: "dushanbe",
            area: 54,
            building_type: "new",
            floor: 5,
            repair_type: "with_repair",
            building_stage: "built",
            rooms: 2,
            total_floors: 9,
            year_built: 2020,
            has_balcony: false,
            has_parking: false,
        },
    });

    const { mutate, isPending } = usePredictPrice();

    function onSubmit(values: PredictionSchema) {
        mutate(values, {
            onSuccess: (data) => {
                onSuccess(data, values.area);
            },
        });
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {t("form.title")}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {t("form.subtitle")}
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* Row 1: Город */}
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-slate-700">
                                        {t("form.city")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder={t("form.selectCity")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CITY_VALUES.map((city) => (
                                                <SelectItem key={city} value={city}>
                                                    {t(`form.cities.${city}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Row 2: Тип и стадия */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="building_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.type")}
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BUILDING_TYPE_VALUES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {t(`form.buildingTypes.${type}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="building_stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.stage")}
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BUILDING_STAGE_VALUES.map((stage) => (
                                                    <SelectItem key={stage} value={stage}>
                                                        {t(`form.buildingStages.${stage}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Row 3: Площадь и комнаты */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.area")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="h-12 text-base"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.rooms")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="h-12 text-base"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Row 4: Этаж и этажность */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="floor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.floor")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="h-12 text-base"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="total_floors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">
                                            {t("form.totalFloors")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="h-12 text-base"
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Row 5: Ремонт */}
                        <FormField
                            control={form.control}
                            name="repair_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-slate-700">
                                        {t("form.repair")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {REPAIR_TYPE_VALUES.map((repair) => (
                                                <SelectItem key={repair} value={repair}>
                                                    {t(`form.repairTypes.${repair}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Row 6: Чекбоксы */}
                        <div className="flex gap-8">
                            <FormField
                                control={form.control}
                                name="has_balcony"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value ?? false}
                                                onCheckedChange={field.onChange}
                                                className="h-5 w-5"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-base font-normal text-slate-700 cursor-pointer">
                                            {t("form.balcony")}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="has_parking"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value ?? false}
                                                onCheckedChange={field.onChange}
                                                className="h-5 w-5"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-base font-normal text-slate-700 cursor-pointer">
                                            {t("form.parking")}
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isPending}
                        >
                            {isPending ? t("form.loading") : t("form.submit")}
                        </Button>

                        <DisclaimerShort />
                    </form>
                </Form>
            </div>
        </div>
    );
}
