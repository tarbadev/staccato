import BundleRepository from '../infrastructure/BundleRepository'
import Bundle from './Bundle'
import GoogleDrive from '../infrastructure/GoogleDrive'
import { ResourceType } from './Resource'

export type UploadParams = {
  name: string;
  title?: string;
  type: string;
  filePath: string;
  source?: string;
  authors?: string[];
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
    const newBundle = bundle.addResource({
      driveId: driveResource.id,
      driveLink: driveResource.link,
      ...uploadParams,
      type: uploadParams.type.split('/')[0] as ResourceType,
    })
    return BundleRepository.save(newBundle)
  }
}