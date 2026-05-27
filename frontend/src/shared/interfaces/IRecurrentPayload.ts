import { TFrequency } from "../types/TFrequency";

export default interface IRecurrentPayload {
  is_variable: boolean;
  estimated_value: number | null;
  frequency: TFrequency;
  recurrent_day: number;
}
