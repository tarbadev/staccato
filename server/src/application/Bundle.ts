import Resource, { ResourceType } from './Resource'
import { AudioType } from '@shared/Resource'

export default class Bundle {
  id: number
  name: string
  googleDriveId: string
  resources: Resource[] = []

  constructor(id: number, name: string, googleDriveId: string, resources: Resource[] = []) {
    this.id = id
    this.name = name
    this.googleDriveId = googleDriveId
    this.resources = resources
  }

  addResource(params: NewResourceParams): Bundle {
    const resource = new Resource(
      0,
      params.title,
      params.type,
      params.driveId,
      params.driveLink,
      params.source,
      params.authors,
      params.album,
      params.audioType,
    )
    return new Bundle(this.id, this.name, this.googleDriveId, this.resources.concat(resource))
  }
}

type NewResourceParams = {
  title?: string;
  source?: string;
  authors?: string[];
  type: ResourceType;
  driveId: string;
  driveLink: string;
  album?: string;
  audioType?: AudioType;
}