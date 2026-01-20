import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Inject Tailwind rose palette as CSS variables for inline fills/strokes
const RoseVars = () => (
  <style>{`
    :root {
      --rose-300: #fda4af;
      --rose-500: #f43f5e;
      --rose-600: #e11d48;
      --rose-700: #be123c;
      --rose-800: #9f1239;
    }
  `}</style>
);

const TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// --- Country name normalization + synonym allow-list (for selection / highlighting) ---
const normalize = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Synonyms (we removed Tanzania entirely as requested)
const DRC_SYNONYMS = [
  "democratic republic of the congo",
  "democratic republic of congo",
  "congo (kinshasa)",
  "congo, the democratic republic of the",
  "congo, dem. rep.",
  "zaire",
  "dr congo",
  "rd congo",
  "republique democratique du congo",
];
const RWANDA_SYNONYMS = ["rwanda"];
const BURUNDI_SYNONYMS = ["burundi"];
const UGANDA_SYNONYMS = ["uganda", "ouganda"];

// Names allowed for click/select (synonym-based)
const ALLOWED_NORMALIZED = new Set(
  [...DRC_SYNONYMS, ...RWANDA_SYNONYMS, ...BURUNDI_SYNONYMS, ...UGANDA_SYNONYMS].map(normalize)
);

// Active (clickable) program countries (Tanzania removed)
const ACTIVE = new Set(["COD", "RWA", "BDI", "UGA"]);

// Highlighted in Rose Limbo (color only)
const HIGHLIGHT_ROSE = new Set(["COD", "RWA", "BDI", "UGA"]);

// For name-based highlighting
const ROSE_NAMES = new Set(
  [...DRC_SYNONYMS, ...RWANDA_SYNONYMS, ...BURUNDI_SYNONYMS, ...UGANDA_SYNONYMS].map(normalize)
);

const isDRCName = (name: string) => {
  const n = normalize(name)
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (
    n === "democratic republic of the congo" ||
    n === "democratic republic of congo" ||
    n === "republique democratique du congo" ||
    n === "congo dem rep" ||
    (n.includes("congo") && (n.includes("dem") || n.includes("kinshasa") || n.includes("zaire")))
  );
};

const isAllowedName = (name: string) => isDRCName(name) || ALLOWED_NORMALIZED.has(normalize(name));
const isRoseCountry = (iso3: string, name: string) =>
  HIGHLIGHT_ROSE.has(iso3) || ROSE_NAMES.has(normalize(name)) || isDRCName(name);

// Beneficiaries (sample data) per active country ISO3
const BENEFICIARIES: Record<string, number> = {
  COD: 18450,
  RWA: 9200,
  BDI: 5400,
  UGA: 13200,
  // TZA removed
};

interface MapProps {
  mode?: "focus" | "global";
  // Optional color variant for special pages
  colorVariant?: "default" | "landing"; // landing: black -> rose-red, pink -> rose-lombo
}

export const InteractiveWorldMap: React.FC<MapProps> = ({ mode = "focus", colorVariant = "default" }) => {
  const [hover, setHover] = React.useState<{ code: string; name: string } | undefined>();
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selected, setSelected] = React.useState<{ code: string; name: string } | undefined>();
  const toggle = (code: string, name: string) => {
    setSelected({ code, name });
    // eslint-disable-next-line no-console
    console.log("Selected country", { code, name });
  };

  // Force full-world visibility: use a smaller scale + neutral center when not focusing.
  const projectionConfig =
    mode === "focus" ? { scale: 360, center: [25, -2] } : { scale: 200, center: [0, 10] };

  return (
    <div className="w-full relative h-[420px] md:h-[520px] lg:h-[680px]" style={{ minHeight: 420 }}>
      <ComposableMap
        projectionConfig={projectionConfig as any}
        style={{ width: "100%", height: "100%" }}
        onMouseMove={(e: any) => setPos({ x: e.clientX, y: e.clientY })}
      >
        <Geographies geography={TOPO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const props: any = geo.properties || {};
              const iso3 = props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || "";
              const name = props.NAME || props.ADMIN || props.BRK_NAME || (props as any).name || iso3;
              // active by ISO code (program countries)
              const activeISO = ACTIVE.has(iso3);
              // allowed by synonym (for click) but we only color Rose countries
              const allowedByName = isAllowedName(name);
              const selectable = activeISO || allowedByName; // click-target
              const isSelected = selected && selected.code === iso3;
              const isDRC = iso3 === "COD" || isDRCName(name);
              const isRose = isRoseCountry(iso3, name);
              // Compute palette based on variant
              const baseFill = isRose ? (isSelected ? "var(--rose-600)" : "var(--rose-300)") : "#e5e7eb";
              let fillDefault = baseFill;
              let fillHover = isRose ? "var(--rose-500)" : selectable ? "#f3f4f6" : "#f1f5f9";
              let strokeDefault = isDRC ? "var(--rose-700)" : isRose ? "var(--rose-500)" : "#ffffff";
              let strokeHover = isDRC ? "var(--rose-700)" : isRose ? "var(--rose-600)" : "#d1d5db";
              let fillPressed = isRose ? "var(--rose-600)" : "#e2e8f0";
              let strokePressed = isDRC ? "var(--rose-800)" : isRose ? "var(--rose-700)" : "#cbd5e1";

              if (colorVariant === "landing") {
                // Align with reference image:
                // - Non-rose countries use a soft light grey (no black) with subtle grey strokes
                // - Rose countries stay in brand rose and slightly deeper on interactions
                if (!isRose) {
                  // Light map grey palette (approx. #ECEFF4 fills, #E5E9F0 strokes)
                  fillDefault = "#ECEFF4"; // very light grey like the screenshot
                  fillHover = "#E3E8F2";   // a touch darker on hover
                  fillPressed = "#DDE3EF"; // pressed state
                  strokeDefault = "#E5E9F0";
                  strokeHover = "#D9DEE8";
                  strokePressed = "#CED4DF";
                } else {
                  // Rose countries: deepen tones (rose-red family)
                  fillDefault = isSelected ? "var(--rose-700)" : "var(--rose-500)";
                  fillHover = "var(--rose-700)";
                  fillPressed = "var(--rose-800)";
                  strokeDefault = "var(--rose-700)";
                  strokeHover = "var(--rose-800)";
                  strokePressed = "#7f1d1d"; // deep
                }
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => {
                    setHover({ code: iso3, name });
                    setPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHover(undefined);
                  }}
                  onClick={() => selectable && toggle(iso3, name)}
                  style={{
                    default: {
                      fill: fillDefault,
                      stroke: strokeDefault,
                      strokeWidth: isDRC ? (isSelected ? 1.9 : 1.1) : isRose ? 0.7 : 0.4,
                      outline: "none",
                      cursor: selectable ? "pointer" : "default",
                      transition: "fill .25s, stroke .25s, stroke-width .25s",
                      filter: isSelected
                        ? "drop-shadow(0 0 6px rgba(190,18,60,0.55))"
                        : isRose
                        ? "drop-shadow(0 0 2px rgba(190,18,60,0.25))"
                        : "none",
                    },
                    hover: {
                      fill: fillHover,
                      stroke: strokeHover,
                      strokeWidth: isDRC ? (isSelected ? 2 : 1.4) : isRose ? 0.9 : 0.4,
                      outline: "none",
                      filter: isRose ? "drop-shadow(0 0 5px rgba(190,18,60,0.55))" : "none",
                    },
                    pressed: {
                      fill: fillPressed,
                      stroke: strokePressed,
                      strokeWidth: isDRC ? 2.1 : isRose ? 1.0 : 0.4,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hover && (
        <div className="map-tooltip" style={{ top: pos.y + 16, left: pos.x + 16, position: "fixed" }}>
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md px-3 py-2 shadow-sm max-w-[200px] pointer-events-none">
            <div className="text-[13px] font-semibold text-slate-800 leading-snug mb-1">
              {hover.name} {hover.code && (
                <span className="text-slate-400 text-[11px] font-normal">({hover.code})</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="uppercase tracking-wide text-[9px] text-slate-500">Femmes bénéficiaires</span>
              <span className="font-medium text-rose-600">
                {(BENEFICIARIES[hover.code] || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Footer removed per request */}
      {selected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm border border-rose-200 rounded px-3 py-1 text-[11px] text-rose-700 font-medium shadow-sm">
          Sélection: {selected.name} ({selected.code})
        </div>
      )}
      {hover && (
        <div className="absolute top-2 left-2 bg-white/75 backdrop-blur-sm border border-slate-200 rounded px-2.5 py-0.5 text-[11px] text-slate-700 font-medium shadow-sm pointer-events-none">
          Survol: {hover.name} {hover.code && <span className="opacity-60">({hover.code})</span>}
        </div>
      )}
    </div>
  );
};

// ---- Minimal self-tests to prevent regressions ----
interface TestCase { name: string; pass: boolean; details?: string }
const runSelfTests = (): TestCase[] => {
  const cases: TestCase[] = [];
  const push = (name: string, cond: boolean, details?: string) => cases.push({ name, pass: !!cond, details });

  // Rose highlighting
  push("COD is rose", isRoseCountry("COD", "Democratic Republic of the Congo"));
  push("RWA is rose", isRoseCountry("RWA", "Rwanda"));
  push("BDI is rose", isRoseCountry("BDI", "Burundi"));
  push("UGA is rose", isRoseCountry("UGA", "Uganda"));
  push("TZA not rose (removed)", !isRoseCountry("TZA", "Tanzania"));

  // Synonym allow-list
  push("DRC synonym 'Congo, Dem. Rep.' allowed", ALLOWED_NORMALIZED.has(normalize("Congo, Dem. Rep.")));
  push("DRC synonym 'Zaire' allowed", ALLOWED_NORMALIZED.has(normalize("Zaire")));

  return cases;
};

const TestBadge: React.FC<{ pass: boolean }> = ({ pass }) => (
  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {pass ? "✓" : "✗"}
  </span>
);

export default function Preview() {
  const tests = React.useMemo(runSelfTests, []);
  const passes = tests.filter((t) => t.pass).length;

  return (
    <div className="w-full h-full p-4">
      <RoseVars />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-3">InteractiveWorldMap — Program Countries</h1>
        <p className="text-sm text-slate-600 mb-4">
          Survolez les pays actifs (RDC, Rwanda, Burundi, Ouganda) et cliquez pour les sélectionner.
        </p>
        <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <InteractiveWorldMap mode="focus" />
        </div>

        {/* Self-test results */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Self-tests</h2>
          <ul className="space-y-1">
            {tests.map((t, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                <TestBadge pass={t.pass} />
                <span>{t.name}</span>
                {t.details && <span className="text-slate-400">— {t.details}</span>}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-1">{passes}/{tests.length} tests passed.</p>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Source des limites: <code>world-atlas@2 / countries-110m</code>. Les autres pays restent neutres.
        </p>
      </div>
    </div>
  );
}
