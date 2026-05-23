export default interface IBillPayload {
  name: string;
  value: number;
  group_id?: number;
  term?: string;
  ref?: string;
  paid: boolean;
}
