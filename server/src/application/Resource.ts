export default class Resource {
  id: number
  title?: string
  googleDriveId: string

  constructor(id: number, title: string | undefined, googleDriveId: string) {
    this.id = id
    this.title = title
    this.googleDriveId = googleDriveId
  }
}