import Resource from './Resource'

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

  addResource(title: string | undefined, driveId: string, driveLink: string): Bundle {
    const resource = new Resource(0, title, driveId, driveLink)
    return new Bundle(this.id, this.name, this.googleDriveId, this.resources.concat(resource))
  }
}