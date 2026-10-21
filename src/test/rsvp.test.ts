import { describe, it, expect } from "vitest";
import { buildRsvpMessage, isValidRsvp, MAX_COMPANIONS } from "@/lib/rsvp";
import { whatsappLink, wedding } from "@/config/wedding";

describe("mensaje de confirmación", () => {
  it("incluye los datos que escribe el invitado", () => {
    const msg = buildRsvpMessage({ name: "Ana Pérez", attending: "si", companions: 2, note: "Llegaremos un poco tarde" });
    expect(msg).toContain("Ana Pérez");
    expect(msg).toContain("Sí, contaré con mi presencia");
    expect(msg).toContain("2 acompañantes");
    expect(msg).toContain("Llegaremos un poco tarde");
  });

  it("indica cuando el invitado no asiste", () => {
    const msg = buildRsvpMessage({ name: "Luis", attending: "no", companions: 0, note: "" });
    expect(msg).toContain("No podré asistir");
    expect(msg).not.toContain("Sí, contaré con mi presencia");
  });

  it("sin acompañantes dice Solo yo", () => {
    const msg = buildRsvpMessage({ name: "Marta", attending: "si", companions: 0, note: "" });
    expect(msg).toContain("Acompañantes: Solo yo");
  });
});

describe("reglas del formulario", () => {
  it("exige el nombre del invitado", () => {
    expect(isValidRsvp({ name: "" })).toBe(false);
    expect(isValidRsvp({ name: "   " })).toBe(false);
    expect(isValidRsvp({ name: "Ana" })).toBe(true);
  });

  it("limita los acompañantes permitidos", () => {
    expect(MAX_COMPANIONS).toBe(12);
  });

  it("el enlace de WhatsApp queda desactivado sin número configurado (no se inventan teléfonos)", () => {
    expect(wedding.whatsappNumber).toBe("");
    expect(whatsappLink(wedding.whatsappNumber, "hola")).toBeNull();
  });
});
