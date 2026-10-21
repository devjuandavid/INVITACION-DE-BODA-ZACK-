
 // Edita aquí todos los datos de la invitación.
export const wedding = {
  groom: {
    short: "Zacarías",
    full: "Zacarías Mamani Mamani",
  },

  bride: {
    short: "Jhazmin",
    full: "Jhazmin Paola Condori Velarde",
  },

  dateLabel: "Sábado, 31 de octubre de 2026",

  // Hora de Bolivia: America/La_Paz (UTC-4).
  eventStartIso: "2026-10-31T10:30:00-04:00",
  timeZone: "America/La_Paz",

  groomParents: [
    "Benjamín Félix Mamani Limachi",
    "Patricia Mamani de Mamani",
  ],

  brideParents: [
    "Mario Condori Paz",
    "Jimena Velarde Copa",
  ],

  ceremony: {
    title: "Ceremonia religiosa",
    place: "Congregación Cristiana Bondad",
    address: "Zona Villa Tejada Rectangular, Calle 6 N.º 865",
    time: "10:30",
    mapUrl: "",
  },

  reception: {
    title: "Recepción",
    place: "Salón LUXO",
    address: "Referencia: CINEBOL",
    time: "15:30",
    mapUrl: "",
  },

  // Programa de la boda.
  program: [
    {
      time: "10:30",
      title: "Ceremonia religiosa",
      description: "Con delegación religiosa",
    },
    {
      time: "12:30",
      title: "Paseo de los novios",
      description: "",
    },
    {
      time: "15:30",
      title: "Recepción del evento",
      description: "",
    },
    {
      time: "16:30",
      title: "Tiempo de alabanza y especiales",
      description: "",
    },
    {
      time: "19:00",
      title: "Cena",
      description: "",
    },
    {
      time: "19:45",
      title: "Dinámicas con los novios",
      description: "",
    },
    {
      time: "21:00",
      title: "Torta",
      description: "",
    },
    {
      time: "22:30",
      title: "Final de la fiesta",
      description: "",
    },
  ],

  // Número con código de país, solo dígitos.
  // Ejemplo: 5917XXXXXXXX. Vacío = botón desactivado.
 whatsappNumber: "59161153441",

  rsvpMessage:
    "Hola, Zacarías y Jhazmin. Gracias por la invitación. Confirmo mi asistencia a su boda del 31 de octubre de 2026.",

  // URL o ruta de un archivo de audio autorizado.
  // Vacío = sin música.
  musicUrl: "/music/cancion.mp3",
  heroPhoto: "/images/portada.jpeg",

  gallery: [
    "/images/foto-1.jpeg",
    "/images/foto-2.jpeg",
    "/images/foto-3.jpeg",
    "/images/foto-12.jpeg",
    "/images/foto-5.jpeg",
    "/images/foto-6.jpeg",
    "/images/foto-8.jpeg",
    "/images/foto-9.jpeg",
    "/images/foto-10.jpeg",
    "/images/foto-4.jpeg",
    
  ],
};

export function mapsLink(url: string, fallbackQuery: string) {
  return (
    url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`
  );
}

export function whatsappLink(number: string, message: string) {
  const digits = number.replace(/\D/g, "");

  if (digits.length < 8) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
