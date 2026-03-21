export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  accentRgb: [number, number, number];
  secondaryRgb: [number, number, number];
}

export interface BackdropDef {
  id: string;
  name: string;
  description: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green & blue hacker aesthetic',
    accentRgb: [74, 222, 128], // green-400
    secondaryRgb: [96, 165, 250], // blue-400
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Dark professional minimal',
    accentRgb: [203, 213, 225], // slate-300
    secondaryRgb: [148, 163, 184], // slate-400
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    description: 'Electric blue & indigo',
    accentRgb: [56, 189, 248], // sky-400
    secondaryRgb: [129, 140, 248], // indigo-400
  },
];

export const BACKDROPS: BackdropDef[] = [
  { id: 'matrix-rain', name: 'Matrix Rain', description: 'Falling katakana characters' },
  { id: 'node-graph', name: 'Node Graph', description: 'Interactive network of nodes' },
  { id: 'starfield', name: 'Starfield', description: 'Slow drift through deep space' },
  { id: 'none', name: 'None', description: 'Clean background only' },
];

export const DEFAULT_COLOR_SCHEME_ID = 'cobalt';
export const DEFAULT_BACKDROP_ID = 'node-graph';

export function getColorScheme(id: string): ColorScheme {
  return COLOR_SCHEMES.find(s => s.id === id) ?? COLOR_SCHEMES[0];
}
