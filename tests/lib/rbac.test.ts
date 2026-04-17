import { describe, it, expect } from "vitest";
import { canAccess, roleLabel, homeForRole, rolePermissions } from "@/lib/rbac";

describe("rbac.canAccess", () => {
  it("admin can access admin and app routes", () => {
    expect(canAccess("admin", "/admin/dashboard")).toBe(true);
    expect(canAccess("admin", "/app/residents")).toBe(true);
  });
  it("pdl can access admin", () => {
    expect(canAccess("pdl", "/admin/users")).toBe(true);
  });
  it("pflegekraft cannot access admin", () => {
    expect(canAccess("pflegekraft", "/admin")).toBe(false);
    expect(canAccess("pflegekraft", "/app/residents")).toBe(true);
  });
  it("angehoeriger only family", () => {
    expect(canAccess("angehoeriger", "/family/portal")).toBe(true);
    expect(canAccess("angehoeriger", "/app/residents")).toBe(false);
    expect(canAccess("angehoeriger", "/admin")).toBe(false);
  });
});

describe("rbac.roleLabel", () => {
  it("returns German labels", () => {
    expect(roleLabel("admin")).toBe("Administrator:in");
    expect(roleLabel("pdl")).toBe("Pflegedienstleitung");
    expect(roleLabel("pflegekraft")).toBe("Pflegekraft");
    expect(roleLabel("angehoeriger")).toBe("Angehörige:r");
  });
});

describe("rbac.homeForRole", () => {
  it("routes each role to its home", () => {
    expect(homeForRole("admin")).toBe("/admin");
    expect(homeForRole("pdl")).toBe("/admin");
    expect(homeForRole("pflegekraft")).toBe("/app");
    expect(homeForRole("angehoeriger")).toBe("/family");
  });
});

describe("rbac.rolePermissions", () => {
  it("admin has wildcard", () => {
    expect(rolePermissions.admin.can).toContain("*");
  });
  it("pflegekraft cannot manage staff", () => {
    expect(rolePermissions.pflegekraft.can).not.toContain("staff:manage");
  });
});
