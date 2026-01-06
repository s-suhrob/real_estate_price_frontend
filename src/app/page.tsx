"use client";

import { useState } from "react";
import { PredictionForm } from "@/features/prediction/components/PredictionForm";
import { PriceResult } from "@/features/prediction/components/PriceResult";
import { PredictionResponse } from "@/types/api";
import { TrendingUp, MapPin, Target, Database } from "lucide-react";
import { DisclaimerExpanded } from "@/components/disclaimer";

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [area, setArea] = useState<number>(0);

  const handleSuccess = (data: PredictionResponse, areaValue: number) => {
    setPrediction(data);
    setArea(areaValue);
    setTimeout(() => {
      document.getElementById("prediction-result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setPrediction(null);
    setArea(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Оценка недвижимости <span className="text-primary">Душанбе</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Ориентировочная оценка рыночной стоимости квартир на основе данных объявлений и модели машинного обучения.
            </p>
          </div>

          <PredictionForm onSuccess={handleSuccess} />

          {prediction && (
            <div id="prediction-result" className="mt-12 scroll-mt-20">
              <PriceResult prediction={prediction} area={area} onReset={handleReset} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-primary" />}
              title="Тренды рынка"
              description="Следите за изменениями цен на рынке."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-primary" />}
              title="Анализ районов"
              description="Сравнивайте районы по цене и динамике."
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-primary" />}
              title="Диапазон оценки"
              description="Показываем диапазон цены для лучшего понимания."
            />
            <FeatureCard
              icon={<Database className="w-8 h-8 text-primary" />}
              title="Данные рынка"
              description="Используем данные объявлений и очищаем дубликаты."
            />
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold mb-4 text-center">Методология</h2>
          <DisclaimerExpanded />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Оценка недвижимости Душанбе
          </p>
          <a
            href="#methodology"
            className="text-sm text-primary hover:underline"
          >
            Методология
          </a>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-5 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-all duration-300">
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
