import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Delete,
  LockKeyhole,
  Users,
  BarChart3,
  Zap,
  Search,
} from "lucide-react";

const SHEET_HREF =
  "https://docs.google.com/spreadsheets/d/1ReqI4-Cqhwgxw-srFFnUHmFtEn--UFePgFNMowArEis";

type Tutor = { name: string; classes: number };
type TL = {
  id: string;
  fullName: string;
  shortName: string;
  total: number;
  tutors: Tutor[];
  limit: number;
};

const tutorNamePool = [
  "Garcia Camila",
  "Lopez Santiago",
  "Martinez Valentina",
  "Rodriguez Mateo",
  "Hernandez Isabella",
  "Gonzalez Daniel",
  "Perez Sofia",
  "Sanchez Alejandro",
  "Ramirez Lucia",
  "Torres Nicolas",
  "Flores Mariana",
  "Rivera Sebastian",
  "Gomez Paula",
  "Diaz Tomas",
  "Reyes Gabriela",
  "Morales Juan",
  "Cruz Valeria",
  "Ortiz Diego",
  "Gutierrez Ana",
  "Mendoza Carlos",
  "Vargas Laura",
  "Castillo Jorge",
  "Silva Juliana",
  "Rojas Andres",
  "Suarez Daniela",
  "Medina Felipe",
  "Jimenez Natalia",
  "Alvarez Kevin",
  "Navarro Sara",
  "Ruiz Oscar",
  "Aguilar Melissa",
  "Cardenas Luis",
  "Guerrero Paola",
  "Campos Esteban",
  "Duarte Andrea",
  "Santos Ricardo",
  "Pena Carolina",
  "Luna David",
  "Acosta Juan Pablo",
  "Vega Maria",
  "Soto Cristian",
  "Herrera Tatiana",
  "Castro Samuel",
  "Molina Nicole",
  "Ortega Javier",
  "Delgado Carla",
  "Ramos Ivan",
  "Chavez Lesly",
  "Vasquez Miguel",
  "Soto Dahiana",
  "Quintero Juan",
  "Pineda Kenneth",
  "Salazar Fernando",
  "Montoya Edwin",
  "Benitez Nahuel",
  "Arias Carlos",
  "Quiroga Silvia",
  "Estrada Andrea",
  "Franco Felipe",
  "Cortes Angela",
  "Bravo Camilo",
  "Roldan Ivan",
  "Zuniga Miguel",
];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateTutors(totalTarget: number, count: number, seedOffset: number): Tutor[] {
  const tutors: Tutor[] = [];
  let remaining = totalTarget;
  const usedNames = new Set<string>();
  for (let i = 0; i < count; i++) {
    const poolIdx = Math.floor(seededRandom(seedOffset * 100 + i * 7) * tutorNamePool.length);
    let name = tutorNamePool[poolIdx];
    if (usedNames.has(name)) {
      name = `${name} ${i + 1}`;
    }
    usedNames.add(name);
    let classes: number;
    if (i < 3) {
      classes = Math.floor(12 + seededRandom(seedOffset + i) * 8);
    } else if (i < 10) {
      classes = Math.floor(6 + seededRandom(seedOffset + i * 2) * 6);
    } else if (i < 25) {
      classes = Math.floor(2 + seededRandom(seedOffset + i * 3) * 4);
    } else {
      classes = Math.floor(1 + seededRandom(seedOffset + i * 5) * 2);
    }
    if (remaining - classes < 0) classes = Math.max(1, remaining);
    if (i === count - 1) classes = remaining;
    remaining -= classes;
    if (remaining < 0) remaining = 0;
    tutors.push({ name, classes });
  }
  let sum = tutors.reduce((a, b) => a + b.classes, 0);
  let diff = totalTarget - sum;
  let idx = 0;
  while (diff !== 0) {
    if (diff > 0) {
      tutors[idx % tutors.length].classes += 1;
      diff--;
    } else {
      if (tutors[idx % tutors.length].classes > 1) {
        tutors[idx % tutors.length].classes -= 1;
        diff++;
      }
    }
    idx++;
    if (idx > 1000) break;
  }
  return tutors.sort((a, b) => b.classes - a.classes);
}

const carolinaTutors: Tutor[] = [
  { name: "Sanchez Lesly Vanessa", classes: 16 },
  { name: "Garces Felipe", classes: 13 },
  { name: "Jaramillo Angela", classes: 13 },
  { name: "Rozo Camilo", classes: 12 },
  { name: "Mallama Ivan", classes: 11 },
  { name: "Avendano Miguel", classes: 10 },
  { name: "Collazos Dahiana", classes: 10 },
  { name: "Barrios Juan", classes: 9 },
  { name: "Garcia Kenneth", classes: 9 },
  { name: "Rincon Fernando", classes: 9 },
  { name: "Sanabria Edwin", classes: 9 },
  { name: "Chuquiruna Nahuel", classes: 8 },
  { name: "Arrieta Carlos", classes: 8 },
  { name: "Munoz Silvia", classes: 8 },
  { name: "Salcedo Andrea", classes: 8 },
  { name: "Lopez Valentina", classes: 8 },
  { name: "Torres Andres", classes: 7 },
  { name: "Ramirez Sofia", classes: 6 },
  { name: "Diaz Mateo", classes: 6 },
  { name: "Herrera Camila", classes: 5 },
  { name: "Gomez Santiago", classes: 5 },
  { name: "Vargas Isabella", classes: 5 },
  { name: "Castro Nicolas", classes: 5 },
  { name: "Ortiz Lucia", classes: 4 },
  { name: "Morales Daniel", classes: 4 },
  { name: "Reyes Gabriela", classes: 4 },
  { name: "Silva Tomas", classes: 4 },
  { name: "Rojas Mariana", classes: 4 },
  { name: "Mendoza Sebastian", classes: 3 },
  { name: "Suarez Ana", classes: 3 },
  { name: "Guzman Jorge", classes: 3 },
  { name: "Alvarez Paula", classes: 3 },
  { name: "Figueroa Diego", classes: 3 },
  { name: "Pineda Laura", classes: 3 },
  { name: "Delgado Kevin", classes: 3 },
  { name: "Vargas Esteban", classes: 2 },
  { name: "Medina Juliana", classes: 2 },
  { name: "Ruiz Alejandro", classes: 2 },
  { name: "Jimenez Carla", classes: 2 },
  { name: "Contreras Felipe", classes: 2 },
  { name: "Navarro Natalia", classes: 2 },
  { name: "Pena Luis", classes: 2 },
  { name: "Guerrero Valeria", classes: 2 },
  { name: "Campos Javier", classes: 2 },
  { name: "Duarte Sara", classes: 2 },
  { name: "Aguirre Cristian", classes: 2 },
  { name: "Cardenas Paola", classes: 2 },
  { name: "Quintero Oscar", classes: 2 },
  { name: "Santana Maria", classes: 2 },
  { name: "Vega Juan Pablo", classes: 1 },
  { name: "Luna Daniela", classes: 1 },
  { name: "Cortes Ricardo", classes: 1 },
  { name: "Moreno Tatiana", classes: 1 },
  { name: "Espinoza Carlos", classes: 1 },
  { name: "Mejia Alejandra", classes: 1 },
  { name: "Rivera Samuel", classes: 1 },
  { name: "Fernandez Nicole", classes: 1 },
  { name: "Acosta David", classes: 1 },
  { name: "Blanco Melissa", classes: 1 },
];

const tlsData: TL[] = [
  {
    id: "carolina",
    fullName: "Carolina Acosta Delgado",
    shortName: "Carolina A.",
    total: 279,
    limit: 250,
    tutors: carolinaTutors,
  },
  {
    id: "munoz",
    fullName: "Munoz Bermudez Camilo",
    shortName: "Camilo M.",
    total: 242,
    limit: 250,
    tutors: generateTutors(242, 52, 2),
  },
  {
    id: "urfane",
    fullName: "Urfaneta Cordoba Edda Myle",
    shortName: "Edda Myle U.",
    total: 187,
    limit: 250,
    tutors: generateTutors(187, 48, 3),
  },
  {
    id: "casas",
    fullName: "Casas Saltaren Sarah Navith",
    shortName: "Sarah C.",
    total: 268,
    limit: 250,
    tutors: generateTutors(268, 55, 4),
  },
  {
    id: "carrillo",
    fullName: "Jose Alejandro Carrillo Tellez",
    shortName: "Jose A. C.",
    total: 198,
    limit: 250,
    tutors: generateTutors(198, 50, 5),
  },
  {
    id: "cabarcas",
    fullName: "José Francisco Cabarcas Torrenegra",
    shortName: "José F. C.",
    total: 225,
    limit: 250,
    tutors: generateTutors(225, 53, 6),
  },
];

// PIN map per requirement - Guarda PINs en código (objeto pinToTL)
const pinToTL: Record<string, string> = {
  "4821": "carolina",
  "7394": "munoz",
  "1562": "urfane",
  "9047": "casas",
  "3285": "carrillo",
  "6710": "cabarcas",
};

function getProgressColor(value: number, limit: number) {
  if (value > limit) return { bg: "#991b1b", light: "#7f1d1d", label: "EXCEDIDO", text: "text-white", range: ">250" };
  if (value >= 225) return { bg: "#ef4444", light: "#fca5a5", label: "CRÍTICO 225-250", text: "text-white", range: "225-250" };
  if (value >= 200) return { bg: "#f97316", light: "#fdba74", label: "ALTO 200-225", text: "text-white", range: "200-225" };
  if (value >= 150) return { bg: "#eab308", light: "#fde68a", label: "MEDIO 150-200", text: "text-black", range: "150-200" };
  return { bg: "#22c55e", light: "#86efac", label: "OK 0-150", text: "text-white", range: "0-150" };
}

export default function App() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loggedId, setLoggedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [shake, setShake] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const selectedTL = useMemo(() => {
    if (!loggedId) return null;
    return tlsData.find((t) => t.id === loggedId) || null;
  }, [loggedId]);

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) {
      // auto attempt after short delay
      setTimeout(() => attemptLogin(next), 150);
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError("");
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const attemptLogin = (pinToTry = pin) => {
    const id = pinToTL[pinToTry];
    if (id) {
      setLoggedId(id);
      setError("");
      setPin("");
    } else {
      setError("PIN incorrecto. Verifica con coordinación.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setTimeout(() => setPin(""), 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (/[0-9]/.test(e.key) && pin.length < 4) {
      handleDigit(e.key);
    } else if (e.key === "Backspace") {
      handleDelete();
    } else if (e.key === "Enter") {
      attemptLogin();
    }
  };

  const filteredTutors = useMemo(() => {
    if (!selectedTL) return [];
    if (!search) return selectedTL.tutors;
    return selectedTL.tutors.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [selectedTL, search]);

  const top15 = useMemo(() => filteredTutors.slice(0, 15), [filteredTutors]);

  if (!selectedTL) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-violet-500/30"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-[15%] h-[700px] w-[700px] rounded-full bg-violet-600/25 blur-[130px]" />
          <div className="absolute -bottom-[20%] right-[5%] h-[800px] w-[800px] rounded-full bg-blue-600/15 blur-[140px]" />
          <div className="absolute top-[40%] left-[50%] h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[400px]">
          <div
            className={`rounded-[32px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] p-7 md:p-8 shadow-[0_0_80px_rgba(124,58,237,0.15)] ${shake ? "animate-[shake_0.35s_ease]" : ""}`}
          >
            <div className="flex flex-col items-center text-center mb-7">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25 mb-4">
                <LockKeyhole className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-[20px] font-semibold tracking-tight leading-tight">
                Control LatAm - Ingresa tu PIN
              </h1>
              <p className="text-[12px] text-white/50 mt-2 max-w-[260px]">
                Acceso exclusivo TL • 4 dígitos • Datos protegidos
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/40">
                <ShieldCheck className="h-3 w-3" />
                Sesión privada • Sin lista de TLs visible
              </div>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-[56px] w-[56px] rounded-[16px] border flex items-center justify-center text-[22px] font-bold tracking-widest transition-all ${
                    pin[i]
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "bg-black/30 border-white/[0.10] text-white/20"
                  }`}
                >
                  {pin[i] ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Hidden numeric input for accessibility + physical keyboard */}
            <input
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(v);
                setError("");
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              className="sr-only"
              aria-label="PIN"
            />

            {error && (
              <div className="mb-5 rounded-[14px] bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-2.5 text-[12px] text-red-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Virtual numeric keypad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="h-[56px] rounded-[16px] bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-[20px] font-semibold transition active:scale-[0.96]"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="h-[56px] rounded-[16px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[11px] font-medium text-white/60 transition"
              >
                Limpiar
              </button>
              <button
                onClick={() => handleDigit("0")}
                className="h-[56px] rounded-[16px] bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-[20px] font-semibold transition active:scale-[0.96]"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-[56px] rounded-[16px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-center transition active:scale-[0.96]"
              >
                <Delete className="h-5 w-5 text-white/70" />
              </button>
            </div>

            <button
              onClick={() => attemptLogin()}
              disabled={pin.length !== 4}
              className="w-full h-[48px] rounded-full bg-white text-black font-semibold text-[14px] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Ingresar
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30">
              <span>{now.toLocaleString()}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Límite 250 por TL</span>
            </div>

            {/* Product link - must keep exact href */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-center">
              <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] px-3 py-2 flex items-center gap-2">
                <a href="https://bo.kodland.org/extraLessonRequests?tab=2" target="_blank" rel="noopener">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='16' fill='%238b5cf6'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-size='14' font-weight='700'%3EK%3C/text%3E%3C/svg%3E"
                    alt="Kodland Backoffice"
                    className="h-7 w-7 rounded-full"
                  />
                </a>
                <a
                  href="https://bo.kodland.org/extraLessonRequests?tab=2"
                  target="_blank"
                  rel="noopener"
                  className="text-[11px] font-medium text-white/60 hover:text-white flex items-center gap-1"
                >
                  Kodland Backoffice
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-white/20 mt-4">
            6 PINs • Solo números • Cada TL ve solo su equipo
          </p>
        </div>

        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`}</style>
      </div>
    );
  }

  // DASHBOARD FILTRADO POR TL
  const progress = getProgressColor(selectedTL.total, selectedTL.limit);
  const pct = Math.min(100, (selectedTL.total / selectedTL.limit) * 100);
  const isExceeded = selectedTL.total > selectedTL.limit;
  const remaining = selectedTL.limit - selectedTL.total;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden selection:bg-violet-500/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[30%] left-[20%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] right-[10%] h-[700px] w-[700px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="absolute top-[40%] left-[50%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header solo TL logueado */}
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#0a0a0f]/70 border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-[15px] md:text-[17px] font-semibold tracking-tight leading-tight">
                  Control TL: {selectedTL.fullName} | Septiembre 2026 | Límite 250
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sesión segura • {selectedTL.tutors.length} tutores
                  </span>
                  <span className="text-[11px] text-white/40">{now.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Kodland Backoffice product card with exact href - two anchors per spec */}
              <div className="rounded-[16px] bg-white/[0.06] border border-white/[0.08] px-3 py-2 flex items-center gap-2 shrink-0">
                <a href="https://bo.kodland.org/extraLessonRequests?tab=2" target="_blank" rel="noopener">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='16' fill='%238b5cf6'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-size='14' font-weight='700'%3EK%3C/text%3E%3C/svg%3E"
                    alt="Kodland Backoffice"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </a>
                <a
                  href="https://bo.kodland.org/extraLessonRequests?tab=2"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-[12px] font-medium hover:text-white/80"
                >
                  <Zap className="h-3.5 w-3.5 text-violet-300" />
                  Kodland Backoffice
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>

              <button
                onClick={() => {
                  setLoggedId(null);
                  setSearch("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-white/90 px-4 py-2 text-[12px] font-semibold transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Big progress card with semáforo */}
          <div className="rounded-[24px] bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] p-6 md:p-7 relative overflow-hidden mb-6">
            {isExceeded && (
              <div className="absolute top-0 right-0">
                <div className="bg-[#991b1b] text-white text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-bl-[16px] flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" />
                  EXCEDIDO
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-1">
                  Resumen total equipo vs 250
                </h2>
                <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight leading-tight">
                  {selectedTL.fullName}
                </h3>
                <p className="text-[12px] text-white/50 mt-1">
                  {selectedTL.id === "carolina" ? "Datos reales BO • 59 tutores" : `Simulado • ${selectedTL.tutors.length} tutores • Proyección realista`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[42px] md:text-[52px] font-bold leading-none tracking-tight">
                  {selectedTL.total}
                  <span className="text-[18px] font-medium text-white/30 ml-2">/ {selectedTL.limit}</span>
                </div>
                <div className={`text-[11px] mt-1 font-medium ${remaining < 0 ? "text-red-300" : "text-white/40"}`}>
                  {remaining < 0 ? `+${Math.abs(remaining)} sobre límite` : `${remaining} restantes`}
                </div>
              </div>
            </div>

            {/* Barra progreso grande semáforo */}
            <div className="relative">
              <div className="h-[34px] rounded-full bg-black/50 border border-white/[0.06] p-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-4"
                  style={{
                    width: `${Math.min(100, (selectedTL.total / selectedTL.limit) * 100)}%`,
                    background: `linear-gradient(90deg, ${progress.bg} 0%, ${progress.light} 100%)`,
                    boxShadow: `0 0 24px ${progress.bg}88`,
                  }}
                >
                  <span className={`text-[12px] font-bold tracking-wide ${progress.text}`}>{Math.round(pct)}%</span>
                </div>
              </div>
              {/* Semáforo labels */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  { label: "0-150", color: "#22c55e", active: selectedTL.total < 150 },
                  { label: "150-200", color: "#eab308", active: selectedTL.total >= 150 && selectedTL.total < 200 },
                  { label: "200-225", color: "#f97316", active: selectedTL.total >= 200 && selectedTL.total < 225 },
                  { label: "225-250", color: "#ef4444", active: selectedTL.total >= 225 && selectedTL.total <= 250 },
                  { label: "250+ EXCEDIDO", color: "#991b1b", active: selectedTL.total > 250 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-full px-2 py-1.5 text-[10px] font-bold text-center border transition ${
                      s.active
                        ? "bg-white text-black border-white shadow"
                        : "bg-white/[0.04] border-white/[0.06] text-white/40"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.05] p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Promedio / tutor</div>
                <div className="text-[18px] font-semibold">
                  {(selectedTL.total / selectedTL.tutors.length).toFixed(1)}
                </div>
              </div>
              <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.05] p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Top tutor</div>
                <div className="text-[13px] font-medium truncate">{selectedTL.tutors[0]?.name}</div>
                <div className="text-[11px] text-white/50">{selectedTL.tutors[0]?.classes} clases</div>
              </div>
              <div className="rounded-[14px] bg-black/20 border border-white/[0.05] p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Estado actual</div>
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ background: progress.bg, color: progress.text === "text-black" ? "black" : "white" }}
                >
                  {progress.label}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico top 15 + resumen lateral */}
          <div className="grid lg:grid-cols-[1.6fr_0.8fr] gap-4 mb-6">
            <div className="rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="text-[12px] font-semibold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Top 15 tutores • {selectedTL.shortName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      placeholder="Filtrar tutor..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 w-[160px] rounded-full bg-black/30 border border-white/[0.08] pl-8 pr-3 text-[11px] placeholder:text-white/30 focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>

              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top15} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
                      angle={-32}
                      textAnchor="end"
                      interval={0}
                      height={70}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      contentStyle={{
                        background: "#111117",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "white",
                      }}
                      labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                      itemStyle={{ color: "white" }}
                    />
                    <Bar dataKey="classes" radius={[8, 8, 0, 0]} fill={progress.bg} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-6 flex flex-col">
              <h3 className="text-[12px] font-semibold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> Resumen equipo
              </h3>
              <div className="space-y-4">
                <div className="rounded-[16px] bg-black/30 border border-white/[0.06] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Total vs límite</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[28px] font-bold">{selectedTL.total}</span>
                    <span className="text-[14px] text-white/40">/ 250</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: progress.bg }} />
                  </div>
                  <div className="mt-2 text-[11px] text-white/50">
                    {remaining >= 0 ? `Quedan ${remaining} clases disponibles` : `Excedido por ${Math.abs(remaining)} clases`}
                  </div>
                </div>

                <div className="rounded-[16px] bg-white/[0.03] border border-white/[0.06] p-4">
                  <div className="text-[11px] font-medium text-white/70 mb-2">Detalle rápido</div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white/40">Tutores</span>
                      <span className="font-semibold">{selectedTL.tutors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Promedio</span>
                      <span className="font-semibold">{(selectedTL.total / selectedTL.tutors.length).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Top</span>
                      <span className="font-semibold truncate max-w-[120px]">{selectedTL.tutors[0]?.name} ({selectedTL.tutors[0]?.classes})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Mes</span>
                      <span className="font-semibold">Septiembre 2026</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[16px] border border-violet-500/20 bg-violet-500/10 p-4">
                  <div className="text-[11px] font-semibold text-violet-200">Nota privacidad</div>
                  <div className="text-[11px] text-violet-200/70 mt-1 leading-relaxed">
                    Solo ves tu equipo. Otros TLs no son visibles. Datos de Carolina son reales BO, resto simulado hasta conectar IMPORTRANGE.
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <a
                  href={SHEET_HREF}
                  target="_blank"
                  rel="noopener"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-white/[0.08] border border-white/[0.10] px-3 py-2.5 text-[11px] font-medium text-white/70 hover:bg-white/[0.12] transition"
                >
                  Fuente: TEAM 1 - WORKSPACE
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Tabla por tutor con mini barra */}
          <div className="rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h3 className="text-[12px] font-semibold uppercase tracking-widest text-white/60">
                Tabla por tutor • {selectedTL.fullName} • {filteredTutors.length} tutores
              </h3>
              <div className="text-[10px] text-white/30">Ordenado por clases • Barra relativa al top del TL</div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-white/[0.06]">
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-[#121218]/90 backdrop-blur-xl border-b border-white/[0.06]">
                    <tr className="text-[10px] uppercase tracking-widest text-white/40">
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Tutor</th>
                      <th className="px-4 py-3 font-semibold text-right">Clases</th>
                      <th className="px-4 py-3 font-semibold w-[160px]">Distribución</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredTutors.map((tutor, idx) => {
                      const max = selectedTL.tutors[0].classes || 1;
                      const pctTutor = (tutor.classes / max) * 100;
                      return (
                        <tr key={tutor.name} className="hover:bg-white/[0.03] transition">
                          <td className="px-4 py-3 text-[11px] text-white/30">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <div className="text-[12px] font-medium">{tutor.name}</div>
                            <div className="text-[10px] text-white/30">Tutor LatAm</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex rounded-full bg-white text-black text-[11px] font-bold px-2.5 py-1">
                              {tutor.classes}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pctTutor}%`, background: progress.bg }}
                                />
                              </div>
                              <span className="text-[10px] text-white/40 w-[32px] text-right">{pctTutor.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredTutors.length === 0 && (
              <div className="py-12 text-center text-[13px] text-white/40">No se encontraron tutores con "{search}"</div>
            )}
          </div>

          <footer className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/30 border-t border-white/[0.06] pt-6">
            <div className="flex items-center gap-2">
              <span>© Control TL: {selectedTL.shortName}</span>
              <span>•</span>
              <span>Septiembre 2026 • Límite 250</span>
              <span className="hidden md:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-300 text-[10px]">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                Privado
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>PinToTL seguro en código</span>
              <span className="text-white/20">•</span>
              <span>{selectedTL.total} clases registradas</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
