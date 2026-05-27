import { TFrequency } from "../types/TFrequency";

export default interface IRecurrent {
  id: string;
  is_variable: boolean;
  estimated_value: number | null;
  frequency: TFrequency;
  recurrent_day: number;
}
