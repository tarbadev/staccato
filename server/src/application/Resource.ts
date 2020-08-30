import { AudioType, ResourceType } from '@shared/Resource'

export default class Resource {
  id: number
  title?: string
  type: ResourceType
  googleDriveId: string
  googleDriveLink: string
  source?: string
  authors?: string[]
  album?: string
  audioType?: AudioType

  constructor(
    id: number,
    title: string | undefined,
    type: ResourceType,
    googleDriveId: string,
    googleDriveLink: string,
    source?: string,
    authors?: string[],
    album?: string,
    audioType?: AudioType,
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
    this.source = source
    this.authors = authors
    this.album = album
    this.audioType = audioType
  }
}