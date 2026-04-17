"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetTour } from "@/lib/tour/store";
import { getTourForRole } from "@/lib/tour/registry";

interface WelcomeTourButtonProps {
  role?: string;
}

export function WelcomeTourButton({ role }: WelcomeTourButtonProps) {
  const router = useRouter();
  const tour = getTourForRole(role ?? "pflegekraft");

  const onClick = () => {
    if (tour) resetTour(tour.id);
    router.push("/app");
  };

  return (
    <Button type="button" variant="accent" size="sm" onClick={onClick}>
      <Sparkles className="mr-2 h-4 w-4" />
      Tour starten
    </Button>
  );
}
