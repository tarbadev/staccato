export type ResourceType = 'image' | 'video' | 'audio'
export type AudioType = 'song' | 'playback'
export default interface Resource {
  id: number;
  title?: string;
  url: string;
  type: ResourceType;
  source?: string;
  authors?: string[];
  album?: string;
  audioType?: AudioType;
}