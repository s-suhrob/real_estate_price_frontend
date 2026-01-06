"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { predictionSchema, PredictionSchema } from "../prediction-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PredictionResponse } from "@/types/api";
import { DisclaimerShort } from "@/components/disclaimer";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building2, Ruler, Wrench } from "lucide-react";

interface PredictionFormProps {
    onSuccess: (data: PredictionResponse, area: number) => void;
}

const BUILDING_TYPES = [
    { value: "new", label: "Новостройка" },
    { value: "secondhand", label: "Вторичное жильё" },
];

const REPAIR_TYPES = [
    { value: "new_repair", label: "Современный ремонт" },
    { value: "with_repair", label: "Средний ремонт" },
    { value: "no_repair", label: "Без ремонта" },
];

const BUILDING_STAGES = [
    { value: "built", label: "Сдан в эксплуатацию" },
    { value: "under_construction", label: "На стадии строительства" },
];

export function PredictionForm({ onSuccess }: PredictionFormProps) {
    const form = useForm<PredictionSchema>({
        resolver: zodResolver(predictionSchema),
        defaultValues: {
            city: "dushanbe",
            area: 54,
            building_type: "new",
            floor: 1,
            repair_type: "with_repair",
            building_stage: "built",
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
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/95 shadow-xl border-t-4 border-t-primary">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Оценка стоимости недвижимости</CardTitle>
                <CardDescription>Укажите параметры квартиры для расчёта</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Section: Локация */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Локация</span>
                            </div>
                            <div className="pl-6">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Город</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value="Душанбе"
                                                    disabled
                                                    className="bg-muted cursor-not-allowed"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                В текущей версии доступна только оценка для Душанбе
                                            </FormDescription>
                                            <input type="hidden" {...field} />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Section: Объект */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Building2 className="w-4 h-4" />
                                <span>Объект</span>
                            </div>
                            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="building_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Тип здания</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите тип" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {BUILDING_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
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
                                            <FormLabel>Стадия строительства</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите стадию" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {BUILDING_STAGES.map((stage) => (
                                                        <SelectItem key={stage.value} value={stage.value}>
                                                            {stage.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Section: Параметры */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Ruler className="w-4 h-4" />
                                <span>Параметры</span>
                            </div>
                            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Площадь (м²)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="например, 54"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>от 8 до 500 м²</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="floor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Этаж</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="например, 5"
                                                    {...field}
                                                    min={1}
                                                    max={30}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>от 1 до 30</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Section: Состояние */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Wrench className="w-4 h-4" />
                                <span>Состояние</span>
                            </div>
                            <div className="pl-6">
                                <FormField
                                    control={form.control}
                                    name="repair_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Тип ремонта</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите тип ремонта" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {REPAIR_TYPES.map((repair) => (
                                                        <SelectItem key={repair.value} value={repair.value}>
                                                            {repair.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                                {isPending ? "Рассчитываем..." : "Рассчитать стоимость"}
                            </Button>
                            <DisclaimerShort />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
