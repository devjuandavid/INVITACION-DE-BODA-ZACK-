import { describe, it, expect } from "vitest";
import { getRemaining } from "@/lib/countdown";
import { wedding, whatsappLink } from "@/config/wedding";

describe("countdown", () => {
  it("targets 31 Oct 2026 10:30 La Paz (14:30 UTC)", () => {
    expect(new Date(wedding.eventStartIso).toISOString()).toBe("2026-10-31T14:30:00.000Z");
  });
  it("computes remaining one day before", () => {
    const r = getRemaining(wedding.eventStartIso, Date.parse("2026-10-30T14:30:00Z"));
    expect(r).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0, done: false });
  });
  it("never goes negative after the event", () => {
    const r = getRemaining(wedding.eventStartIso, Date.parse("2026-11-05T00:00:00Z"));
    expect(r.days).toBe(0);
    expect(r.done).toBe(true);
  });
});

describe("whatsapp", () => {
  it("is disabled without a number", () => {
    expect(whatsappLink("", "x")).toBeNull();
  });
});
