import ResourceRepository from '../infrastructure/ResourceRepository'
import GoogleDrive from '../infrastructure/GoogleDrive'

export default class ResourceService {
  async delete(resourceId: number): Promise<void> {
    const resource = await ResourceRepository.findOne(resourceId)

    await ResourceRepository.delete(resource.id)
    await GoogleDrive.getInstance().deleteFile(resource.googleDriveId)
  }
}