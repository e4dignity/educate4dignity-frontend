// Simplified mercator-projected SVG paths for a subset of countries (demo). 
// NOTE: For a full world map you would normally generate via topojson -> svg. This subset is illustrative.
export interface CountryPath { id: string; name: string; d: string; }

export const WORLD_PATHS: CountryPath[] = [
  { id:'USA', name:'United States', d:'M108.5 90l2.4 3.2 5.1 1.6 4.7-1.2 3.2 2.3 6.8-.4 1.2 2.7 5.5 1 2.2 2.1-1.4 3.8-4.9 1.7-6.1-.3-4.2 1.9-5.7-.6-3.5.9-3.3-2.2-4.8.5-5.1-1.9-1.8-3.7 2.2-3.4 4.9-3.6z' },
  { id:'CAN', name:'Canada', d:'M108 68l5.5 1.2 4.1-1.8 5.6.7 2.7 3.1 6.2 1.4-2.1 4.9-4.4 2.2-6.1-.5-5.3 2.2-5.8-1.1-3.8-3.9 1.9-4.2z' },
  { id:'MEX', name:'Mexico', d:'M119.5 105l3.2 2.1 2.4 4.9-2.9 3.8-4.6-.6-3.1-3.5 1.8-4.8z' },
  { id:'BDI', name:'Burundi', d:'M309 210l4.5-1.6 2.6 3.4-2.9 4.9-4.5-.9-1-2.5z' },
  { id:'RWA', name:'Rwanda', d:'M306 202l5.2-1.9 3.4 2.5-1.8 6.7-5.6.8-2.5-3.7z' },
  { id:'UGA', name:'Uganda', d:'M305 188l8.8-3.2 6.3 3.3-1.7 10.3-9.1 2-4.1-3.0z' },
  { id:'TZA', name:'Tanzania', d:'M315 214l11.8-3 3.4 6.7-5.4 9.4-10.8 1.1-3-7.9z' },
  { id:'COD', name:'DR Congo', d:'M280 195l13.5-6 10.4 3.7-1.8 13.4-14.1 6-9.6-4.3z' },
  { id:'KEN', name:'Kenya', d:'M320 208l7.2-2 4 3.3-2.9 6-6.6.7-2.4-3.8z' },
  { id:'ETH', name:'Ethiopia', d:'M332 204l10-2.2 5.2 4.9-3.8 8.8-9.6 1-4-5.5z' },
  { id:'ZMB', name:'Zambia', d:'M300 222l9.2-2.1 3.8 5.5-4.9 7.8-9.5 1-2.6-6.7z' },
  { id:'ZWE', name:'Zimbabwe', d:'M308 229l6.2-1.5 2.2 3.8-3.1 5.1-6 .6-1.6-4.2z' },
  { id:'MWI', name:'Malawi', d:'M317 225l2.3-.6 1.2 1.9-1.7 2.8-2 .2-.7-1.6z' },
  { id:'ZAF', name:'South Africa', d:'M300 240l12.5-2.7 6.3 6.5-4.8 12.1-13 1.4-3.6-8.8z' },
  { id:'FRA', name:'France', d:'M196 158l6.2-2.2 4.7 3.1-2.7 8.1-6.7.9-3.1-4.5z' },
  { id:'DEU', name:'Germany', d:'M207 153l5-1.8 4.1 2.7-1.8 6-5.4.7-2.2-3.3z' },
  { id:'ESP', name:'Spain', d:'M188 162l4.8-1.7 3.2 2.2-1.9 6.2-5 .6-2.4-3.5z' },
  { id:'ITA', name:'Italy', d:'M205 163l3.5-1 2.2 1.8-1.2 3.9-3.9.5-1.5-2.4z' },
  { id:'NGA', name:'Nigeria', d:'M258 198l7.4-2.6 5.3 3.6-2.8 8.4-7.9 1-3.4-4.9z' },
  { id:'GHA', name:'Ghana', d:'M246 203l4.1-1.4 3 2.2-1.6 4.7-4.4.6-1.9-2.7z' },
  { id:'SEN', name:'Senegal', d:'M232 197l3.2-1.1 2 .9-.8 3.2-3.4.4-1.2-1.6z' },
  { id:'BGD', name:'Bangladesh', d:'M390 190l4.4-1.6 2.6 2-1.4 5.5-4.7.7-2.2-3.2z' },
  { id:'IND', name:'India', d:'M380 180l10.2-3.6 7.3 4 -2 14.2-10.6 2.3-5.2-5z' }
];

export const WORLD_VIEWBOX = '0 0 500 300';
