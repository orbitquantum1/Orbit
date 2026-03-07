import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";

import WhitePaper from "@/pages/whitepaper";
import Token from "@/pages/token";
import Research from "@/pages/research";
import Merch from "@/pages/merch";
import News from "@/pages/news";
import Marketplace from "@/pages/marketplace";
import RegistryShowcase from "@/pages/registry-showcase";
import X402 from "@/pages/x402";
import Developers from "@/pages/developers";
import Team from "@/pages/team";
import Roadmap from "@/pages/roadmap";
import Wallet from "@/pages/wallet";
import Tracker from "@/pages/tracker";
import PlatformOverview from "@/pages/platform-overview";
import Education from "@/pages/education";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/whitepaper" component={WhitePaper} />
      <Route path="/token" component={Token} />
      <Route path="/research" component={Research} />
      <Route path="/merch" component={Merch} />
      <Route path="/news" component={News} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/registry" component={RegistryShowcase} />
      <Route path="/x402" component={X402} />
      <Route path="/developers" component={Developers} />
      <Route path="/team" component={Team} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/tracker" component={Tracker} />
      <Route path="/platform" component={PlatformOverview} />
      <Route path="/education" component={Education} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <ScrollToTop />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
