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
  composers?: string[]
  arrangers?: string[]
  instruments?: string[]

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
    composers?: string[],
    arrangers?: string[],
    instruments?: string[],
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
    this.composers = composers
    this.arrangers = arrangers
    this.instruments = instruments
  }
}