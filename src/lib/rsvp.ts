// Mensaje de confirmación de asistencia. Se compone a partir de los datos
// que escribe el invitado; nunca se inventan teléfonos ni datos de contacto.
export type Attending = "si" | "no";

export interface RsvpFields {
  name: string;
  attending: Attending;
  companions: number;
  note: string;
}

export const MAX_NAME_LENGTH = 80;
export const MAX_NOTE_LENGTH = 500;
export const MAX_COMPANIONS = 12;

const labelFor = (n: number) => {
  if (n <= 0) return "Solo yo";
  return `${n} ${n === 1 ? "acompañante" : "acompañantes"}`;
};


export function buildRsvpMessage(f: RsvpFields): string {
  const name = f.name.trim() || "Invitado sin nombre";

  const lines = [
    "CONFIRMACIÓN DE ASISTENCIA A LA BODA",
    "Zacarías Mamani Mamani y Jhazmin Paola Condori Velarde",
    "Fecha: sábado, 31 de octubre de 2026",
    "",
    "DATOS DEL INVITADO",
    `Nombre completo: ${name}`,
    `Confirmación: ${
      f.attending === "si"
        ? "Sí, asistiré a la boda"
        : "No podré asistir a la boda"
    }`,
    `Acompañantes: ${labelFor(f.companions)}`,
  ];

  const note = f.note.trim();

  if (note) {
    lines.push("", "MENSAJE DEL INVITADO", note);
  }

  lines.push("", "Mensaje enviado desde la invitación digital.");

  return lines.join("\n");
}

export function isValidRsvp(f: Pick<RsvpFields, "name">): boolean {
  return f.name.trim().length > 0;
}
