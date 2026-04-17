"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Euro } from "lucide-react";

export default function EnRoiCalculatorPage() {
  const [beds, setBeds] = useState(60);
  const [staff, setStaff] = useState(45);
  const [wage, setWage] = useState(28);
  const [docHoursPerShift, setDocHoursPerShift] = useState(2);

  const result = useMemo(() => {
    const shiftsPerMonth = staff * 22; // rough shifts/month
    const hoursSavedPerMonth = shiftsPerMonth * docHoursPerShift * 0.67;
    const monthlySavings = hoursSavedPerMonth * wage;
    const annualSavings = monthlySavings * 12;
    const licenseCost = beds <= 25 ? 299 : beds <= 80 ? 599 : 999;
    const roi = (annualSavings - licenseCost * 12) / (licenseCost * 12);
    return { hoursSavedPerMonth, monthlySavings, annualSavings, licenseCost, roi };
  }, [beds, staff, wage, docHoursPerShift]);

  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">ROI Calculator</Badge>
      <h1 className="font-serif text-5xl font-semibold">What would CareAI save you?</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Based on independent pilot data: caregivers save on average 67% of documentation time.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card><CardContent className="p-6 space-y-5">
          <div><Label htmlFor="beds">Beds / places</Label>
            <Input id="beds" type="number" value={beds} onChange={(e) => setBeds(+e.target.value || 0)} /></div>
          <div><Label htmlFor="staff">Care staff (FTE)</Label>
            <Input id="staff" type="number" value={staff} onChange={(e) => setStaff(+e.target.value || 0)} /></div>
          <div><Label htmlFor="wage">Loaded hourly wage (€)</Label>
            <Input id="wage" type="number" value={wage} onChange={(e) => setWage(+e.target.value || 0)} /></div>
          <div><Label htmlFor="doc">Documentation hours per shift</Label>
            <Input id="doc" type="number" step="0.25" value={docHoursPerShift} onChange={(e) => setDocHoursPerShift(+e.target.value || 0)} /></div>
        </CardContent></Card>

        <div className="space-y-4">
          <Card><CardContent className="p-6">
            <Clock className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Hours saved per month</p>
            <p className="text-3xl font-semibold">{result.hoursSavedPerMonth.toFixed(0)} h</p>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <Euro className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Annual savings</p>
            <p className="text-3xl font-semibold">€{result.annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">ROI (year 1)</p>
            <p className="text-3xl font-semibold">{(result.roi * 100).toFixed(0)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">License cost €{result.licenseCost}/mo · net benefit vs. license fee</p>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// Note: metadata not exportable from a Client Component file, add alternates via layout if needed.
