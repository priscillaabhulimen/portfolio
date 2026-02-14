import mapJson from './map.json';

export interface MapData {
  id: number;
  name: string;
  description: string;
  grid: number[][];
  missile_allowance: number;
}

export const mapData: MapData[] = mapJson as MapData[];
