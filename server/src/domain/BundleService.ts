import BundleRepository from '../infrastructure/BundleRepository'
import Bundle from './Bundle'
import GoogleDrive from '../infrastructure/GoogleDrive'

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
    const bundle = await this.get(id)
    await GoogleDrive.getInstance().renameFile(bundle.googleDriveId, name)
    bundle.name = name

    return BundleRepository.save(bundle)
  }
}