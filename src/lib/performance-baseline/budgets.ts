import type { Budget, RouteType } from "./types";

export const BUDGETS: Record<RouteType, Budget> = {
  marketing: {
    routeType: "marketing",
    thresholds: [
      { metric: "LCP", good: 2000, needsImprovement: 2500 },
      { metric: "FCP", good: 1500, needsImprovement: 1800 },
      { metric: "CLS", good: 0.05, needsImprovement: 0.1 },
      { metric: "TBT", good: 150, needsImprovement: 300 },
      { metric: "TTI", good: 3000, needsImprovement: 5000 },
      { metric: "INP", good: 150, needsImprovement: 200 },
      { metric: "TTFB", good: 500, needsImprovement: 800 },
    ],
  },
  admin: {
    routeType: "admin",
    thresholds: [
      { metric: "LCP", good: 2500, needsImprovement: 3500 },
      { metric: "FCP", good: 1800, needsImprovement: 2500 },
      { metric: "CLS", good: 0.1, needsImprovement: 0.15 },
      { metric: "TBT", good: 250, needsImprovement: 500 },
      { metric: "TTI", good: 4000, needsImprovement: 6000 },
      { metric: "INP", good: 200, needsImprovement: 300 },
      { metric: "TTFB", good: 600, needsImprovement: 1000 },
    ],
  },
  app: {
    routeType: "app",
    thresholds: [
      { metric: "LCP", good: 2500, needsImprovement: 3500 },
      { metric: "FCP", good: 1800, needsImprovement: 2500 },
      { metric: "CLS", good: 0.1, needsImprovement: 0.15 },
      { metric: "TBT", good: 250, needsImprovement: 500 },
      { metric: "TTI", good: 4000, needsImprovement: 6000 },
      { metric: "INP", good: 200, needsImprovement: 300 },
      { metric: "TTFB", good: 600, needsImprovement: 1000 },
    ],
  },
  auth: {
    routeType: "auth",
    thresholds: [
      { metric: "LCP", good: 1800, needsImprovement: 2500 },
      { metric: "FCP", good: 1200, needsImprovement: 1800 },
      { metric: "CLS", good: 0.05, needsImprovement: 0.1 },
      { metric: "TBT", good: 150, needsImprovement: 300 },
      { metric: "TTI", good: 2500, needsImprovement: 4000 },
      { metric: "INP", good: 150, needsImprovement: 200 },
      { metric: "TTFB", good: 500, needsImprovement: 800 },
    ],
  },
};

export function classifyRoute(route: string): RouteType {
  if (route.startsWith("/admin")) return "admin";
  if (route.startsWith("/app") || route.startsWith("/family") || route.startsWith("/kiosk")) return "app";
  if (route.startsWith("/login") || route.startsWith("/signup") || route.startsWith("/verify")) return "auth";
  return "marketing";
}
