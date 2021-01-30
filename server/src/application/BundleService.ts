import BundleRepository from '../infrastructure/BundleRepository'
import Bundle from './Bundle'
import GoogleDrive from '../infrastructure/GoogleDrive'
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

export default class BundleService {
  list(): Promise<Bundle[]> {
    return BundleRepository.findAll()
  }

  get(id: number): Promise<Bundle> {
    return BundleRepository.findOne(id)
  }

  async add(name: string): Promise<Bundle> {
    const googleDriveId = await GoogleDrive.getInstance().createFolder(name)
    const bundle = new Bundle(0, name, googleDriveId)
    return BundleRepository.save(bundle)
  }

  async edit(id: number, name: string): Promise<Bundle> {
    const bundle = await BundleRepository.findOne(id)
    await GoogleDrive.getInstance().renameFile(bundle.googleDriveId, name)
    bundle.name = name

    return BundleRepository.save(bundle)
  }

  async upload(id: number, uploadParams: UploadParams): Promise<Bundle> {
    const bundle = await BundleRepository.findOne(id)
    const driveResource = await GoogleDrive.getInstance()
      .uploadFile(bundle.googleDriveId, uploadParams.name, uploadParams.type, uploadParams.filePath)
    const tempType = uploadParams.type.split('/')[0]
    let type = tempType as ResourceType
    if (tempType === 'application' && !uploadParams.instruments) {
      type = 'song-partition'
    } else if (tempType === 'application' && uploadParams.instruments) {
      type = 'orchestral-partition'
    }

    const newBundle = bundle.addResource({
      driveId: driveResource.id,
      driveLink: driveResource.link,
      ...uploadParams,
      type,
    })
    return BundleRepository.save(newBundle)
  }
}