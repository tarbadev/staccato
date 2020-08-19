import Bundle from '@shared/Bundle'
import BundleRepository from '../infrastructure/BundleRepository'

export default class BundleService {
  list(): Promise<Bundle[]> {
    return BundleRepository.findAll()
  }

  get(id: number): Promise<Bundle> {
    return BundleRepository.findOne(id)
  }

  add(name: string): Promise<Bundle> {
    return BundleRepository.save({ id: 0, name })
  }

  async edit(id: number, name: string): Promise<Bundle> {
    const bundle = await BundleRepository.findOne(id)
    bundle.name = name

    return BundleRepository.save(bundle)
  }
}