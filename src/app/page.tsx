"use client";

import { useState, useRef } from "react";
import { PredictionForm } from "@/features/prediction/components/PredictionForm";
import { PriceResult } from "@/features/prediction/components/PriceResult";
import { PredictionResponse } from "@/types/api";
import { TrendingUp, MapPin, Target, Database, ArrowDown } from "lucide-react";
import { DisclaimerExpanded } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { TypeWriter } from "@/components/TypeWriter";
import { useI18n } from "@/i18n";

export default function Home() {
  const { t, locale } = useI18n();
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [area, setArea] = useState<number>(0);
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
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar onScrollToForm={scrollToForm} />

      {/* Hero Section - With TypeWriter Animation */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading with TypeWriter */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            <span className="block mb-2">{t("hero.titleLine1")}</span>
            <TypeWriter
              key={locale}
              words={[t("hero.city1"), t("hero.city2"), t("hero.city3"), t("hero.city4"), t("hero.city5")]}
              className="text-primary"
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
            />
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={scrollToForm}
            className="h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("hero.cta")}
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} id="about" className="py-16 px-6 scroll-mt-20">
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
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-slate-700" />}
              title={t("features.trends.title")}
              description={t("features.trends.description")}
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-slate-700" />}
              title={t("features.districts.title")}
              description={t("features.districts.description")}
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-slate-700" />}
              title={t("features.range.title")}
              description={t("features.range.description")}
            />
            <FeatureCard
              icon={<Database className="w-8 h-8 text-slate-700" />}
              title={t("features.data.title")}
              description={t("features.data.description")}
            />
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-16 bg-white border-t border-slate-100 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold mb-4 text-center">{t("methodology.title")}</h2>
          <DisclaimerExpanded />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <a
            href="#methodology"
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            {t("footer.methodology")}
          </a>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-300">
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
