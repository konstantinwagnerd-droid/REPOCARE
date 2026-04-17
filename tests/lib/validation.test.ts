import { describe, it, expect } from "vitest";
import { z } from "zod";

// Central validation schemas used across API routes.
// Mirrors shapes expected by demo-request, care-reports, vital signs.
const DemoRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  phone: z.string().optional(),
  residents: z.coerce.number().int().min(1).max(10000),
  message: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(),
});

const VitalSignsSchema = z.object({
  residentId: z.string().uuid(),
  systolic: z.number().int().min(50).max(260),
  diastolic: z.number().int().min(30).max(160),
  pulse: z.number().int().min(20).max(250),
  temperature: z.number().min(32).max(43),
  measuredAt: z.string().datetime(),
});

describe("DemoRequestSchema", () => {
  it("accepts valid input", () => {
    const ok = DemoRequestSchema.safeParse({
      name: "Anna Muster",
      email: "anna@heim.at",
      company: "Pflegeheim Sonnenblick",
      residents: 80,
    });
    expect(ok.success).toBe(true);
  });
  it("rejects bad email", () => {
    const r = DemoRequestSchema.safeParse({ name: "A B", email: "nope", company: "X Y", residents: 10 });
    expect(r.success).toBe(false);
  });
  it("rejects honeypot fill (bot)", () => {
    const r = DemoRequestSchema.safeParse({
      name: "A B",
      email: "a@b.co",
      company: "X Y",
      residents: 10,
      honeypot: "http://spam",
    });
    expect(r.success).toBe(false);
  });
  it("coerces residents string to int", () => {
    const r = DemoRequestSchema.safeParse({
      name: "A B",
      email: "a@b.co",
      company: "X Y",
      residents: "50" as unknown as number,
    });
    expect(r.success).toBe(true);
  });
});

describe("VitalSignsSchema", () => {
  it("accepts plausible vitals", () => {
    const r = VitalSignsSchema.safeParse({
      residentId: "11111111-1111-1111-1111-111111111111",
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      temperature: 36.6,
      measuredAt: new Date().toISOString(),
    });
    expect(r.success).toBe(true);
  });
  it("rejects impossible temperature", () => {
    const r = VitalSignsSchema.safeParse({
      residentId: "11111111-1111-1111-1111-111111111111",
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      temperature: 99,
      measuredAt: new Date().toISOString(),
    });
    expect(r.success).toBe(false);
  });
  it("rejects non-uuid residentId", () => {
    const r = VitalSignsSchema.safeParse({
      residentId: "not-a-uuid",
      systolic: 120,
      diastolic: 80,
      pulse: 72,
      temperature: 36.6,
      measuredAt: new Date().toISOString(),
    });
    expect(r.success).toBe(false);
  });
});
