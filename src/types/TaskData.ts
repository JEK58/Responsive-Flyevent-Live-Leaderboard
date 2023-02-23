export interface Times {
  wo: string;
  wc: string;
  so: string;
  tc: string;
}

export interface Sector {
  type: string;
  ctr: number[];
  rad?: number;
}

export interface Wpt {
  id: string;
  tag: string;
  opt: number[];
  sector: Sector;
}

export interface TaskData {
  event: string;
  tzone: number;
  date: string;
  name: string;
  type: string;
  times: Times;
  dist: number;
  ssdist: number;
  wpts: Wpt[];
}
