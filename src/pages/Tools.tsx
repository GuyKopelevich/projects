import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BakingTimer } from "@/components/BakingTimer";
import { HydrationVisualizer } from "@/components/HydrationVisualizer";
import { FermentationCalculator } from "@/components/FermentationCalculator";
import { BakingAchievements } from "@/components/BakingAchievements";
import { IngredientSubstitutions } from "@/components/IngredientSubstitutions";
import { BreadWeightCalculator } from "@/components/BreadWeightCalculator";
import { ScoringPatterns } from "@/components/ScoringPatterns";
import { BakingChecklist } from "@/components/BakingChecklist";
import { WeatherBakingTips } from "@/components/WeatherBakingTips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tools() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">כלים ומחשבונים</h1>
      </div>

      <Tabs defaultValue="timers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="timers" className="text-xs py-2">טיימרים</TabsTrigger>
          <TabsTrigger value="calculators" className="text-xs py-2">מחשבונים</TabsTrigger>
          <TabsTrigger value="guides" className="text-xs py-2">מדריכים</TabsTrigger>
        </TabsList>

        <TabsContent value="timers" className="space-y-4 mt-4">
          <BakingTimer />
          <BakingChecklist />
        </TabsContent>

        <TabsContent value="calculators" className="space-y-4 mt-4">
          <FermentationCalculator />
          <BreadWeightCalculator />
          <HydrationVisualizer />
          <WeatherBakingTips />
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-4">
          <BakingAchievements />
          <ScoringPatterns />
          <IngredientSubstitutions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
