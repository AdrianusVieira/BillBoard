export default interface IBill {
  id: number;
  name: string;
  value: number;
  group_id?: number;
  term?: string;
  ref?: string;
  paid: boolean;
}
