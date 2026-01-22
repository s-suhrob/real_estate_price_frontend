"use client";

import { useState, useRef } from "react";
import { PredictionForm } from "@/features/prediction/components/PredictionForm";
import { PriceResult } from "@/features/prediction/components/PriceResult";
import { PredictionResponse } from "@/types/api";
import { TrendingUp, MapPin, Target, Database, ArrowDown, Building, Users, CheckCircle } from "lucide-react";
import { DisclaimerExpanded } from "@/components/disclaimer";
import { TypeWriter } from "@/components/TypeWriter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [area, setArea] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section with Animation */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Main Heading with TypeWriter */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            <span className="block mb-2">Оценка недвижимости</span>
            <TypeWriter
              words={["Таджикистана", "Душанбе", "Худжанда", "Куляба", "Бохтара"]}
              className="text-primary"
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
            />
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 animate-fade-in">
            Узнайте рыночную стоимость квартиры за секунды с помощью искусственного интеллекта
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-12">
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-center mb-2">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">5000+</div>
              <div className="text-sm text-slate-500">объявлений</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">90%</div>
              <div className="text-sm text-slate-500">точность</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900">6</div>
              <div className="text-sm text-slate-500">городов</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={scrollToForm}
            className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-subtle"
          >
            Получить оценку
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className={`py-16 px-6 transition-opacity duration-500 ${showForm ? 'opacity-100' : 'opacity-100'}`}>
        <div className="max-w-6xl mx-auto">
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
            © {new Date().getFullYear()} Оценка недвижимости
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
