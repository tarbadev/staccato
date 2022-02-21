import ResourceRepository from '../infrastructure/ResourceRepository'
import GoogleDrive from '../infrastructure/GoogleDrive'
import Bundle from './Bundle'
import Resource from './Resource'
import { AudioType, ResourceType } from '@shared/Resource'

export type UploadParams = {
  name: string;
  title?: string;
  type: string;
  filePath: string;
  source?: string;
  authors?: string[];
  composers?: string[];
  arrangers?: string[];
  instruments?: string[];
  album?: string;
  audioType?: AudioType;
}

export default class ResourceService {
  async upload(bundle: Bundle, uploadParams: UploadParams): Promise<Resource> {
    const driveResource = await GoogleDrive.getInstance()
      .uploadFile(bundle.googleDriveId, uploadParams.name, uploadParams.type, uploadParams.filePath)
    const tempType = uploadParams.type.split('/')[0]
    let type = tempType as ResourceType
    if (tempType === 'application' && !uploadParams.instruments) {
      type = 'song-partition'
    } else if (tempType === 'application' && uploadParams.instruments) {
      type = 'orchestral-partition'
    }

    const resource = new Resource(
      0,
      uploadParams.title,
      type,
      driveResource.id,
      driveResource.link,
      uploadParams.source,
      uploadParams.authors,
      uploadParams.album,
      uploadParams.audioType,
      uploadParams.composers,
      uploadParams.arrangers,
      uploadParams.instruments,
    )
    return ResourceRepository.save(bundle, resource)
  }

  async delete(resourceId: number): Promise<void> {
    const resource = await ResourceRepository.findOne(resourceId)

    await ResourceRepository.delete(resource.id)
    await GoogleDrive.getInstance().deleteFile(resource.googleDriveId)
  }
}