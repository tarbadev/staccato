export default interface Resource {
  id: number;
  title: string | undefined;
  url: string;
  type: 'image' | 'video';
  source?: string;
  authors?: string[];
}