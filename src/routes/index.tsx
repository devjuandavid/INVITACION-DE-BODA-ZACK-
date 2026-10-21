import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Heart, Calendar, MapPin, Clock, Music, Pause, Sparkles, Church, GlassWater, X, ImageIcon, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import { wedding, mapsLink, whatsappLink } from "@/config/wedding";
import { buildRsvpMessage, MAX_NAME_LENGTH, MAX_NOTE_LENGTH, MAX_COMPANIONS, type Attending } from "@/lib/rsvp";
import { getRemaining, type Remaining } from "@/lib/countdown";
import floral from "@/assets/floral-corner.webp";

const TITLE = "Boda de Zacarías y Jhazmin · 31 de octubre de 2026";
const DESC = "Con la bendición de Dios y de nuestros padres, te invitamos a celebrar nuestra unión matrimonial.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Pill({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
      {icon}{children}
    </span>
  );
}

function SectionTitle({ eyebrow, icon, title }: { eyebrow: string; icon: ReactNode; title: string }) {
  return (
    <div className="mb-10 text-center">
      <Pill icon={icon}>{eyebrow}</Pill>
      <h2 className="mt-4 font-script text-5xl text-gold sm:text-6xl">{title}</h2>
      <Divider />
    </div>
  );
}

function Photo({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (src) return <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-card text-muted-foreground ${className}`}>
      <ImageIcon className="h-8 w-8 text-gold/70" />
      <span className="text-xs">Foto de los novios (pendiente)</span>
    </div>
  );
}

function Floral({ className = "" }: { className?: string }) {
  return <img src={floral} alt="" aria-hidden width={640} height={640} className={`pointer-events-none select-none ${className}`} />;
}

function Divider() {
  return (
    <div className="mx-auto my-8 flex max-w-xs items-center gap-3 text-gold" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
      <Heart className="h-3 w-3 fill-current" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

function Invitation() {
  const [stage, setStage] = useState<"cover" | "opening" | "open">("cover");
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = async () => {
    if (!wedding.musicUrl) { setMusicError("Música aún no configurada"); setTimeout(() => setMusicError(null), 3000); return; }
    if (!audio.current) {
      audio.current = new Audio(wedding.musicUrl);
      audio.current.loop = true;
      audio.current.onerror = () => { setPlaying(false); setMusicError("No se pudo cargar la música"); };
    }
    if (playing) { audio.current.pause(); setPlaying(false); return; }
    try { await audio.current.play(); setPlaying(true); setMusicError(null); }
    catch { setPlaying(false); setMusicError("El navegador bloqueó el audio"); }
  };

  const open = () => {
    if (stage !== "cover") return;
    if (wedding.musicUrl) void toggleMusic();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo(0, 0);
    setStage("opening");
    setTimeout(() => setStage("open"), reduce ? 0 : 1700);
  };

  useEffect(() => { document.body.style.overflow = stage === "cover" ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [stage]);
  useEffect(() => () => audio.current?.pause(), []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {stage !== "open" && <Cover onOpen={open} opening={stage === "opening"} />}

      {stage !== "cover" && (
        <>
          <button
            onClick={toggleMusic}
            aria-label={playing ? "Pausar música" : "Reproducir música"}
            aria-pressed={playing}
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-card/90 text-gold shadow-[0_8px_30px_-8px_var(--gold)] backdrop-blur transition hover:scale-105"
          >
            {playing && <span className="absolute inset-0 animate-ping rounded-full border border-gold/40 motion-reduce:hidden" />}
            {playing ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
          </button>
          {musicError && (
            <div role="status" className="fixed bottom-24 right-5 z-40 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow">{musicError}</div>
          )}
          <Hero />
          <Countdown />
          <Venues />
          <Schedule />
          <Gallery />
          <Rsvp />
          <Closing />
        </>
      )}
    </main>
  );
}

function CoverFace({ onOpen }: { onOpen?: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      {wedding.heroPhoto ? (
        <img
  src={wedding.heroPhoto}
  alt=""
  aria-hidden
  className="absolute inset-0 h-full w-full object-contain"
/>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--card),var(--secondary))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background/85" />
      <Floral className="floaty absolute -left-10 -top-10 w-56 opacity-90 sm:w-80" />
      <Floral className="floaty absolute -bottom-10 -right-10 w-56 rotate-180 opacity-90 sm:w-80" />
      <div className="pointer-events-none absolute inset-5 rounded-[2rem] border border-gold/40" />
      <div className="pointer-events-none absolute inset-8 rounded-[1.6rem] border border-gold/20" />
      <div className="relative max-w-md text-center">
        <p className="fade-up text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Estás invitado a nuestra boda</p>
        <h1 className="fade-up mt-6 font-script text-6xl leading-tight text-gold drop-shadow-sm sm:text-8xl" style={{ animationDelay: ".2s" }}>
          {wedding.groom.short}<span className="block text-4xl">&amp;</span>{wedding.bride.short}
        </h1>
        <p className="fade-up mt-4 font-serif text-sm text-foreground/80" style={{ animationDelay: ".4s" }}>{wedding.groom.full}<br />&amp;<br />{wedding.bride.full}</p>
        <Divider />
        <p className="fade-up font-serif text-lg italic tracking-wide" style={{ animationDelay: ".6s" }}>31 · Octubre · 2026</p>
        {onOpen && (
          <button onClick={onOpen} className="shine fade-up relative mt-10 overflow-hidden rounded-full bg-gold px-9 py-4 text-sm font-bold tracking-[0.25em] text-gold-foreground shadow-[0_10px_30px_-10px_var(--gold)] transition hover:scale-105" style={{ animationDelay: ".8s" }}>
            ABRIR INVITACIÓN
          </button>
        )}
      </div>
    </div>
  );
}

function Cover({ onOpen, opening }: { onOpen: () => void; opening: boolean }) {
  if (!opening) {
    return <div className="fixed inset-0 z-50 overflow-hidden bg-background"><CoverFace onOpen={onOpen} /></div>;
  }
  // Apertura tipo invitación física: dos hojas que se abren como puertas.
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" style={{ perspective: "1600px" }} aria-hidden>
      <div className="door door-left absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-background">
        <div className="absolute inset-y-0 left-0 w-[200%]"><CoverFace /></div>
      </div>
      <div className="door door-right absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-background">
        <div className="absolute inset-y-0 right-0 w-[200%]"><CoverFace /></div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section>
      <div className="relative h-[105vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-2 py-5">
          <img
            src={wedding.heroPhoto}
            alt="Zacarías y Jhazmin"
            className="h-auto w-full max-w-5xl object-contain"
            loading="lazy"
          />
        </div>


        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        <Floral className="absolute -left-12 bottom-0 w-44 -rotate-90 opacity-90 sm:w-64" />
        <Floral className="absolute -right-12 bottom-0 w-44 rotate-180 opacity-90 sm:w-64" />
        <div className="absolute inset-x-0 top-10 text-center">
          <Sparkles className="mx-auto h-5 w-5 text-gold" />
          <p className="mt-1 font-script text-2xl text-foreground">"Un amor para toda la vida"</p>
        </div>
      </div>
      <Reveal className="mx-auto max-w-3xl px-5 pb-20 pt-8 text-center">
        <Pill icon={<Heart className="h-3 w-3 fill-current" />}>Nuestra celebración de boda</Pill>
        <h1 className="mt-6 font-script text-5xl text-gold sm:text-7xl">Boda de {wedding.groom.short} y {wedding.bride.short}</h1>
        <p className="mt-6 flex items-center justify-center gap-2 text-lg text-foreground/85"><Calendar className="h-5 w-5" />{wedding.dateLabel}</p>
        <Divider />
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Con la bendición de nuestros padres:</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[["Padres del novio", wedding.groomParents], ["Padres de la novia", wedding.brideParents]].map(([label, names]) => (
            <div key={label as string} className="relative rounded-2xl border border-gold/30 bg-card px-5 py-6 shadow-[0_10px_40px_-20px_var(--gold)] before:pointer-events-none before:absolute before:inset-1.5 before:rounded-xl before:border before:border-gold/15">
              <p className="font-serif text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label as string}</p>
              {(names as string[]).map((n) => <p key={n} className="mt-1 font-serif font-semibold">{n}</p>)}
            </div>
          ))}
        </div>
        <Divider />
        <p className="mx-auto max-w-xl font-serif italic leading-relaxed text-foreground/80">
          "Con la bendición de Dios y de nuestros padres, tenemos el honor de invitarte a celebrar nuestra unión matrimonial. Tu presencia hará aún más especial este día."
        </p>
        <p className="mt-3 font-serif text-sm text-muted-foreground">"El amor es paciente, es bondadoso… todo lo soporta." — 1 Corintios 13</p>
      </Reveal>
    </section>
  );
}

function Countdown() {
  const [r, setR] = useState<Remaining | null>(null);
  useEffect(() => {
    const tick = () => setR(getRemaining(wedding.eventStartIso));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const units: [string, number | undefined][] = [["Días", r?.days], ["Horas", r?.hours], ["Minutos", r?.minutes], ["Segundos", r?.seconds]];
  return (
    <section className="px-5 py-20">
      <Reveal className="mx-auto max-w-3xl">
        <SectionTitle eyebrow="Cuenta regresiva" icon={<Clock className="h-3 w-3" />} title="Falta muy poco" />
        {r?.done ? (
          <p className="text-center font-script text-4xl text-gold">¡Hoy es el gran día!</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-live="off">
            {units.map(([l, v]) => (
              <div key={l} className="relative rounded-t-full rounded-b-2xl border border-gold/40 bg-card px-1 pb-5 pt-8 text-center shadow-[0_12px_30px_-18px_var(--gold)]">
                <div className="font-serif text-3xl font-semibold tabular-nums text-gold sm:text-5xl">{v === undefined ? "--" : String(v).padStart(2, "0")}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{l}</div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function VenueCard({ tag, icon, place, address, time, mapUrl, query }: { tag: string; icon: ReactNode; place: string; address: string; time: string; mapUrl: string; query: string }) {
  return (
    <Reveal className="relative flex flex-col overflow-hidden rounded-2xl border border-gold/30 bg-card p-6 shadow-[0_14px_40px_-22px_var(--gold)]">
      <Floral className="absolute -right-10 -top-10 w-32 rotate-90 opacity-40" />
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-gold-foreground">{icon}{tag}</span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-sm font-bold"><Clock className="h-3.5 w-3.5" />{time} h</span>
      </div>
      <h3 className="mt-5 text-xl font-bold">{place}</h3>
      <p className="mt-3 flex gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{address}</p>
      <div className="my-5 h-px bg-border" />
      <a href={mapsLink(mapUrl, query)} target="_blank" rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">
        <Navigation className="h-4 w-4" />Ver ubicación
      </a>
      {!mapUrl && <p className="mt-2 text-[11px] text-muted-foreground">Búsqueda aproximada en Google Maps.</p>}
    </Reveal>
  );
}

function Venues() {
  const { ceremony: c, reception: r } = wedding;
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <SectionTitle eyebrow="Ubicaciones" icon={<MapPin className="h-3 w-3" />} title="¿Dónde y cuándo?" />
        <div className="grid gap-5 md:grid-cols-2">
          <VenueCard tag={c.title} icon={<Church className="h-3.5 w-3.5" />} place={c.place} address={c.address} time={c.time} mapUrl={c.mapUrl} query={`${c.place}, ${c.address}, La Paz, Bolivia`} />
          <VenueCard tag={r.title} icon={<GlassWater className="h-3.5 w-3.5" />} place={`${r.place} — CINEBOL`} address={r.address} time={r.time} mapUrl={r.mapUrl} query={`Salón LUXO CINEBOL`} />
        </div>
      </div>
    </section>
  );
}


function Schedule() {
  const items = [
    ["10:30", "Ceremonia religiosa", "Con delegación religiosa"],
    ["12:30", "Paseo de los novios", ""],
    ["15:30", "Recepción del evento", "Salón LUXO — CINEBOL"],
    ["16:30", "Tiempo de alabanza y especiales", ""],
    ["19:00", "Cena", ""],
    ["19:45", "Dinámicas con los novios", ""],
    ["21:00", "Torta", ""],
    ["22:30", "Final de la fiesta", ""],
  ];

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-xl">
        <SectionTitle
          eyebrow="Línea de tiempo"
          icon={<Clock className="h-3 w-3" />}
          title="Programa de la boda"
        />

        <ol className="relative ml-3 border-l border-border">
          {items.map(([time, title, description]) => (
            <li key={time} className="relative mb-6 ml-6">
              <span className="absolute -left-[33px] top-5 h-4 w-4 rounded-full border-2 border-background bg-gold" />

              <Reveal className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded border border-foreground/70 px-2 py-0.5 text-xs font-bold">
                    {time} h
                  </span>

                  <span className="font-bold">{title}</span>
                </div>

                {description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


function Gallery() {
  const real = wedding.gallery;
  const photos = real.length ? real : Array<string>(5).fill("");
  const [idx, setIdx] = useState<number | null>(null);
  const go = (d: number) => setIdx((i) => (i === null ? i : (i + d + real.length) % real.length));
  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setIdx(null); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx]);
  const touchX = useRef(0);
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <SectionTitle eyebrow="Galería" icon={<Heart className="h-3 w-3 fill-current" />} title="Nuestros momentos" />
        <Reveal className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-3">
          {photos.map((src, i) => (
            <button key={i} disabled={!src} onClick={() => setIdx(i)} aria-label={`Ver foto ${i + 1}`}
              className={`group overflow-hidden border border-gold/30 shadow-[0_10px_30px_-20px_var(--gold)] ${i === 0 ? "row-span-2 rounded-t-full rounded-b-2xl" : "rounded-2xl"} ${i === 3 ? "sm:col-span-2" : ""}`}>
              <Photo src={src} alt={`Zacarías y Jhazmin, foto ${i + 1}`} className="transition duration-700 group-hover:scale-105" />
            </button>
          ))}
        </Reveal>
      </div>
      {idx !== null && real[idx] && (
        <div role="dialog" aria-modal="true" aria-label="Galería ampliada" onClick={() => setIdx(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? 0)}
          onTouchEnd={(e) => { const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur">
          <button aria-label="Cerrar" className="absolute right-4 top-4 text-foreground"><X className="h-7 w-7" /></button>
          {real.length > 1 && <>
            <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 rounded-full border border-gold/40 bg-card/80 p-2 text-gold"><ChevronLeft className="h-6 w-6" /></button>
            <button aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 rounded-full border border-gold/40 bg-card/80 p-2 text-gold"><ChevronRight className="h-6 w-6" /></button>
          </>}
          <img key={idx} src={real[idx]} alt={`Foto ${idx + 1}`} onClick={(e) => e.stopPropagation()} className="lb-in max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
          <p className="absolute bottom-5 text-sm text-muted-foreground">{idx + 1} / {real.length}</p>
        </div>
      )}
    </section>
  );
}

function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending | "">("");
  const [companions, setCompanions] = useState(0);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const fields = { name, attending: (attending || "si") as Attending, companions, note };
  const errors = { name: name.trim() ? "" : "Escribe tu nombre completo", attending: attending ? "" : "Elige una opción" };
  const valid = !errors.name && !errors.attending;
  const message = buildRsvpMessage(fields);
  const link = valid ? whatsappLink(wedding.whatsappNumber, message) : null;
  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
  const errorText = (err: string) => (touched && err ? <span role="alert" className="text-xs text-destructive">{err}</span> : null);
  const attendOptions: { value: Attending; label: string; emoji: string }[] = [
    { value: "si", label: "Sí asistiré", emoji: "🥂" },
    { value: "no", label: "No podré asistir", emoji: "💐" },
  ];
  return (
    <section className="px-5 py-20">
      <Reveal className="mx-auto max-w-xl rounded-3xl border border-gold/40 bg-card p-6 shadow-[0_14px_40px_-22px_var(--gold)] sm:p-8">
        <h2 className="text-center font-script text-5xl text-gold">Confirma tu asistencia</h2>
        <p className="mt-4 text-center text-muted-foreground">Nos encantaría contar contigo. Completa el formulario y envíalo por WhatsApp.</p>
        <form className="mt-8 grid gap-5" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor="rsvp-name" className={labelClass}>Nombre completo *</label>
            <input id="rsvp-name" value={name} maxLength={MAX_NAME_LENGTH} autoComplete="name"
              onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)}
              placeholder="Tu nombre y apellido" className={inputClass} />
            {errorText(errors.name)}
          </div>
          <div className="grid gap-1.5">
            <span className={labelClass} id="rsvp-attending-label">¿Contamos contigo? *</span>
            <div role="radiogroup" aria-labelledby="rsvp-attending-label" className="grid grid-cols-2 gap-2">
              {attendOptions.map((o) => (
                <button key={o.value} type="button" role="radio" aria-checked={attending === o.value}
                  onClick={() => { setAttending(o.value); setTouched(true); }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${attending === o.value ? "border-gold bg-gold text-gold-foreground shadow-[0_8px_20px_-12px_var(--gold)]" : "border-border bg-background hover:border-gold/50"}`}>
                  <span aria-hidden className="mr-1.5">{o.emoji}</span>{o.label}
                </button>
              ))}
            </div>
            {errorText(errors.attending)}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="rsvp-companions" className={labelClass}>N.º de acompañantes</label>
            <select id="rsvp-companions" value={companions} onChange={(e) => setCompanions(Number(e.target.value))}
              className={inputClass}>
              {Array.from({ length: MAX_COMPANIONS + 1 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? "Vengo sin acompañantes" : `${i} ${i === 1 ? "acompañante" : "acompañantes"}`}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="rsvp-note" className={labelClass}>Mensaje para los novios (opcional)</label>
            <textarea id="rsvp-note" value={note} maxLength={MAX_NOTE_LENGTH} rows={3}
              onChange={(e) => setNote(e.target.value)} placeholder="Escribe algo bonito…"
              className={`${inputClass} resize-none`} />
            <span className="text-right text-[11px] text-muted-foreground">{note.length}/{MAX_NOTE_LENGTH}</span>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-background px-4 py-3">
            <p className={labelClass}>Mensaje que se enviará:</p>
            <p className="mt-2 whitespace-pre-line font-serif text-sm text-foreground/85">{message}</p>
          </div>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (!valid) e.preventDefault(); }}
              aria-disabled={!valid}
              className={`inline-flex justify-center rounded-full bg-gold px-8 py-3.5 font-bold text-gold-foreground transition ${valid ? "hover:scale-105" : "pointer-events-none opacity-40"}`}>
              Enviar por WhatsApp
            </a>
          ) : (
            <div className="grid gap-2 text-center">
              <button type="button" disabled className="rounded-full bg-gold/40 px-8 py-3.5 font-bold text-gold-foreground">
                {valid ? "Confirmación disponible pronto" : "Completa los campos para continuar"}
              </button>
              {valid && <p className="text-xs text-muted-foreground">El envío por WhatsApp se activará cuando se configure el número de los novios. No se ha añadido ningún dato de contacto inventado.</p>}
            </div>
          )}
        </form>
      </Reveal>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden px-5 pb-32 pt-24 text-center">
      <Floral className="absolute -left-10 -top-6 w-48 opacity-80 sm:w-72" />
      <Floral className="absolute -bottom-6 -right-10 w-48 rotate-180 opacity-80 sm:w-72" />
      <Reveal className="relative">
        <Sparkles className="floaty mx-auto h-6 w-6 text-gold" />
        <h2 className="mt-4 font-script text-6xl text-gold sm:text-8xl">{wedding.groom.short} &amp; {wedding.bride.short}</h2>
        <Divider />
        <p className="mt-3 font-serif italic">31 de octubre de 2026</p>
        <p className="mx-auto mt-6 max-w-md font-serif text-foreground/80">
          Gracias por ser parte de nuestra historia. Con amor y gratitud, te esperamos para celebrar juntos este día bendecido por Dios.
        </p>
      </Reveal>
    </section>
  );
}
