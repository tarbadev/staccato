export type ResourceType = 'image' | 'video' | 'audio' | 'song-partition' | 'orchestral-partition'
export type AudioType = 'song' | 'playback'
export default interface Resource {
  id: number;
  title?: string;
  url: string;
  type: ResourceType;
  source?: string;
  authors?: string[];
  composers?: string[];
  arrangers?: string[];
  instruments?: string[];
  album?: string;
  audioType?: AudioType;
}