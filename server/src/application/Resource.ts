export type ResourceType = 'image' | 'video'
export default class Resource {
  id: number
  title?: string
  type: ResourceType
  googleDriveId: string
  googleDriveLink: string
  source?: string
  authors?: string[]

  constructor(
    id: number,
    title: string | undefined,
    type: ResourceType,
    googleDriveId: string,
    googleDriveLink: string,
    source: string | undefined,
    authors: string[] | undefined,
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
    this.source = source
    this.authors = authors
  }
}