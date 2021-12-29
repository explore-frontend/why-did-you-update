export interface Result {
  id: number;
  filename: string;
  line: number;
  column: number;
  type: string;
  name?: string;
  flush?: string;
  maxDuration: number;
  averageDuration: number;
  sumDuration: number;
  count: number;
  isAsync: boolean;
}

export enum TabKeys {
  Aggregate = "Update Aggregate",
  Timeline = "Timeline",
}
