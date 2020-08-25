export default class Resource {
  id: number
  title?: string
  googleDriveId: string
  googleDriveLink: string

  constructor(id: number, title: string | undefined, googleDriveId: string, googleDriveLink: string) {
    this.id = id
    this.title = title
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
  }
}