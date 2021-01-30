import { AudioType } from './Resource'

type RequiredUploadRequest = {
  name: string;
  type: string;
  data: string;
}

export type ImageUploadRequest = RequiredUploadRequest & {
  title?: string;
}

export type VideoUploadRequest = RequiredUploadRequest & {
  title?: string;
  source?: string;
  authors?: string[];
}

export type AudioUploadRequest = RequiredUploadRequest & {
  title?: string;
  album?: string;
  authors?: string[];
  audioType?: AudioType;
}

export type OrchestralPartitionUploadRequest = RequiredUploadRequest & {
  title?: string;
  composers?: string[];
  arrangers?: string[];
  instruments?: string[];
}

export type UploadRequest = ImageUploadRequest | VideoUploadRequest | AudioUploadRequest | OrchestralPartitionUploadRequest