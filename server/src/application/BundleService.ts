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
    const bundle = await BundleRepository.findOne(id)
    await GoogleDrive.getInstance().renameFile(bundle.googleDriveId, name)
    bundle.name = name

    return BundleRepository.save(bundle)
  }

  async upload(id: number, file: { name: string; title: string; type: string; filePath: string }): Promise<Bundle> {
    const bundle = await BundleRepository.findOne(id)
    const driveId = await GoogleDrive.getInstance()
      .uploadFile(bundle.googleDriveId, file.name, file.type, file.filePath)
    const newBundle = bundle.addResource(file.title, driveId)
    return BundleRepository.save(newBundle)
  }
}