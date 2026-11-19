import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const Devis = lazy(() => import("./pages/Devis"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const StudioLayout = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.StudioLayout })),
);
const Login = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.Login })),
);
const Overview = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.Overview })),
);
const Records = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.Records })),
);
const RequestDetail = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.RequestDetail })),
);
const ClientDetail = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.ClientDetail })),
);
const QuoteEditor = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.QuoteEditor })),
);
const SettingsPage = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.SettingsPage })),
);
const Catalog = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.Catalog })),
);
const CatalogEditor = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.CatalogEditor })),
);
const ProjectDetail = lazy(() =>
  import("./pages/admin/Studio").then((m) => ({ default: m.ProjectDetail })),
);
const queryClient = new QueryClient();

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith("/admin")
      ? "MekWeb Studio — Espace privé"
      : pathname === "/devis"
        ? "Votre projet | MekWeb"
        : pathname === "/confidentialite"
          ? "Confidentialité | MekWeb"
          : "Création site web Maroc | MekWeb Agency";
  }, [pathname]);
  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteTitle />
            <Suspense
              fallback={
                <div className="studio-loading" role="status">
                  Chargement de votre espace…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                <Route path="/devis" element={<Devis />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<StudioLayout />}>
                  <Route index element={<Overview />} />
                  <Route
                    path="demandes"
                    element={<Records kind="requests" />}
                  />
                  <Route path="demandes/:id" element={<RequestDetail />} />
                  <Route path="clients" element={<Records kind="clients" />} />
                  <Route path="clients/nouveau" element={<ClientDetail />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="devis" element={<Records kind="quotes" />} />
                  <Route path="devis/nouveau" element={<QuoteEditor />} />
                  <Route path="devis/:id" element={<QuoteEditor />} />
                  <Route path="projets" element={<Records kind="projects" />} />
                  <Route path="projets/:id" element={<ProjectDetail />} />
                  <Route path="catalogue" element={<Catalog />} />
                  <Route path="catalogue/nouveau" element={<CatalogEditor />} />
                  <Route path="catalogue/:id" element={<CatalogEditor />} />
                  <Route path="parametres" element={<SettingsPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
