import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import RecipeBuilder from "./pages/RecipeBuilder";
import StarterTracker from "./pages/StarterTracker";
import BakesLog from "./pages/BakesLog";
import NewBake from "./pages/NewBake";
import ActiveBake from "./pages/ActiveBake";
import Calculator from "./pages/Calculator";
import FlourGuide from "./pages/FlourGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/recipes" element={<AppLayout><Recipes /></AppLayout>} />
          <Route path="/recipes/new" element={<AppLayout><RecipeBuilder /></AppLayout>} />
          <Route path="/starter" element={<AppLayout><StarterTracker /></AppLayout>} />
          <Route path="/log" element={<AppLayout><BakesLog /></AppLayout>} />
          <Route path="/bake/new" element={<AppLayout><NewBake /></AppLayout>} />
          <Route path="/bake/:id" element={<AppLayout><ActiveBake /></AppLayout>} />
          <Route path="/calculator/:type" element={<AppLayout><Calculator /></AppLayout>} />
          <Route path="/flours" element={<AppLayout><FlourGuide /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
