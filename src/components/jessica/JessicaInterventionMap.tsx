import React, { useState } from 'react';
import { FaMapMarkerAlt, FaHeart, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// URL for world topology
const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Jessica's actual intervention zones based on her report
const JESSICA_ZONES = {
  BDI: { 
    name: 'Burundi', 
    girls: 500, 
    workshops: 15, 
    schools: 10, 
    status: 'active',
    description: 'Mugerere & surrounding areas - Primary intervention zone',
    color: '#7f1d1d' // Dark color for intervention zone
  },
  COD: { 
    name: 'Democratic Republic of Congo', 
    girls: 0, 
    workshops: 0, 
    schools: 0, 
    status: 'target',
    description: 'Eastern region - Target intervention zone',
    color: '#7f1d1d' // Dark color for target zone
  },
  RWA: { 
    name: 'Rwanda', 
    girls: 0, 
    workshops: 0, 
    schools: 0, 
    status: 'target',
    description: 'Kigali region - Target intervention zone',
    color: '#7f1d1d' // Dark color for target zone
  }
};

// Composant carte interactive avec zoom - Jessica's intervention zone
const JessicaInterventionMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const center: [number, number] = [29, -3]; // Central Africa focus
  const [hover, setHover] = useState<{ code: string; name: string; data?: any } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.5, 8));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.5, 0.5));
  };

  const handleCountryClick = (countryCode: string) => {
    if (JESSICA_ZONES[countryCode as keyof typeof JESSICA_ZONES]) {
      setSelected(selected === countryCode ? null : countryCode);
    }
  };

  // Mappage des codes ISO3 pour s'assurer qu'on a les bons codes
  const getCountryCode = (geo: any) => {
    const props = geo.properties || {};
    let iso3 = props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || "";
    
    // Mappage spécifique pour certains pays
    if (iso3 === "COD") return "COD"; // RDC
    if (iso3 === "BDI") return "BDI"; // Burundi  
    if (iso3 === "RWA") return "RWA"; // Rwanda
    
    return iso3;
  };

  const isJessicaCountry = (iso3: string) => {
    return Object.keys(JESSICA_ZONES).includes(iso3);
  };

  const getCountryColor = (iso3: string, isHovered: boolean) => {
    // Vérifier si c'est un pays cible de Jessica
    const isTarget = ['COD', 'BDI', 'RWA'].includes(iso3);
    
    if (!isTarget) {
      return '#f1f5f9'; // Couleur claire pour les autres pays
    }
    
    if (isHovered) {
      return '#991b1b'; // Plus sombre au survol
    }
    
    return '#7f1d1d'; // Couleur sombre pour les pays cibles
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#fef7f0] to-[#f9f1f1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#5a4a47] mb-4">
            My Intervention Zone
          </h2>
          <p className="text-lg text-[#7a6a67] max-w-2xl mx-auto">
            Focused on Central Africa, where cultural taboos around menstruation 
            are strongest and the need for change is most urgent.
          </p>
          <div className="w-24 h-1 bg-[#f4a6a9] mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Interactive World Map with Zoom */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/90 backdrop-blur-sm border border-[#f4a6a9]/30 rounded-lg shadow-sm hover:bg-[#f4a6a9] hover:text-white transition-colors duration-200"
                >
                  <FaSearchPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/90 backdrop-blur-sm border border-[#f4a6a9]/30 rounded-lg shadow-sm hover:bg-[#f4a6a9] hover:text-white transition-colors duration-200"
                >
                  <FaSearchMinus className="w-4 h-4" />
                </button>
              </div>

              {/* Real Geographic Map */}
              <div className="h-96 lg:h-[480px] relative">
                <ComposableMap
                  projectionConfig={{ 
                    scale: 200 * zoom, 
                    center: center as any 
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Geographies geography={TOPO_URL}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => {
                        const props: any = geo.properties || {};
                        const countryCode = getCountryCode(geo);
                        const name = props.NAME || props.ADMIN || props.BRK_NAME || countryCode;
                        const isJessica = isJessicaCountry(countryCode);
                        const isSelected = selected === countryCode;                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                              if (isJessica) {
                                setHover({ 
                                  code: countryCode, 
                                  name, 
                                  data: JESSICA_ZONES[countryCode as keyof typeof JESSICA_ZONES] 
                                });
                              }
                            }}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => handleCountryClick(countryCode)}
                            style={{
                              default: {
                                fill: getCountryColor(countryCode, false),
                                stroke: isJessica ? 
                                  (isSelected ? "#be123c" : "#7f1d1d") : 
                                  "#e2e8f0",
                                strokeWidth: isJessica ? 
                                  (isSelected ? 1.5 : 0.8) : 
                                  0.3,
                                outline: "none",
                                cursor: isJessica ? "pointer" : "default",
                                transition: "all 0.2s ease-in-out",
                                filter: isSelected ? 
                                  "drop-shadow(0 0 8px rgba(127, 29, 29, 0.6))" : 
                                  "none"
                              },
                              hover: {
                                fill: getCountryColor(countryCode, true),
                                stroke: isJessica ? "#be123c" : "#e2e8f0",
                                strokeWidth: isJessica ? 1.2 : 0.3,
                                outline: "none",
                                filter: isJessica ? 
                                  "drop-shadow(0 0 6px rgba(244, 166, 169, 0.5))" : 
                                  "none"
                              },
                              pressed: {
                                fill: isJessica ? "#be123c" : "#e2e8f0",
                                stroke: "#7f1d1d",
                                strokeWidth: isJessica ? 1.8 : 0.3,
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>

              {/* Tooltip */}
              {hover && hover.data && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#f4a6a9]/30 rounded-lg shadow-lg p-4 max-w-64 z-10">
                  <div className="font-semibold text-[#5a4a47] text-sm mb-2">
                    {hover.name}
                  </div>
                  <div className="text-xs text-[#7a6a67] mb-3">
                    {hover.data.description}
                  </div>
                  {hover.data.status === 'active' && (
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Girls reached:</span>
                        <span className="font-medium text-[#f4a6a9]">{hover.data.girls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Workshops:</span>
                        <span className="font-medium text-[#f4a6a9]">{hover.data.workshops}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Schools:</span>
                        <span className="font-medium text-[#f4a6a9]">{hover.data.schools}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-[#f4a6a9]/30 rounded-lg shadow-sm p-3">
                <div className="text-xs font-medium text-[#5a4a47] mb-2">Intervention Zone</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#7f1d1d]" />
                    <span className="text-[#7a6a67]">Target countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f4a6a9]/20">
              <h3 className="font-bold text-[#5a4a47] text-lg mb-4 flex items-center">
                <FaMapMarkerAlt className="text-[#f4a6a9] mr-2" />
                Impact Zone
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#7a6a67]">Countries targeted</span>
                  <span className="font-bold text-[#5a4a47] text-xl">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7a6a67]">Primary focus</span>
                  <span className="font-bold text-[#f4a6a9] text-xl">Burundi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7a6a67]">Girls reached</span>
                  <span className="font-bold text-[#f4a6a9] text-xl">500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7a6a67]">Workshops delivered</span>
                  <span className="font-bold text-[#5a4a47] text-xl">15</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f4a6a9] to-[#e89396] rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <FaHeart className="mr-2" />
                Why Central Africa?
              </h3>
              <p className="text-sm leading-relaxed text-white/90">
                This region has the strongest cultural taboos around menstruation, 
                yet the highest potential for transformative change. Working locally 
                allows for sustainable, culturally-sensitive solutions.
              </p>
            </div>

            {selected && JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES] && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f4a6a9]/20">
                <h3 className="font-bold text-[#5a4a47] text-lg mb-3">
                  {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].name}
                </h3>
                <p className="text-sm text-[#7a6a67] mb-4">
                  {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7a6a67]">Status:</span>
                    <span className={`font-medium capitalize ${
                      JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].status === 'active' ? 'text-[#7f1d1d]' : 'text-[#7a6a67]'
                    }`}>
                      {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].status}
                    </span>
                  </div>
                  {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].status === 'active' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Girls reached:</span>
                        <span className="font-medium text-[#7f1d1d]">
                          {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].girls}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Workshops delivered:</span>
                        <span className="font-medium text-[#7f1d1d]">
                          {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].workshops}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a6a67]">Partner schools:</span>
                        <span className="font-medium text-[#7f1d1d]">
                          {JESSICA_ZONES[selected as keyof typeof JESSICA_ZONES].schools}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </section>
  );
};

export default JessicaInterventionMap;