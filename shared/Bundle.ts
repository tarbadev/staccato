import Resource from './Resource'

export default interface Bundle {
  id: number;
  name: string;
  driveUrl: string;
  resources: Resource[];
}