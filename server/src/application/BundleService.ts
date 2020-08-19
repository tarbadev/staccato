import Bundle from '@shared/Bundle'
import BundleRepository from '../infrastructure/BundleRepository'

export default class BundleService {
  list(): Promise<Bundle[]> {
    return BundleRepository.findAll()
  }

  get(id: number): Promise<Bundle> {
    return BundleRepository.findOne(id)
  }

  add(name: string) {
    return BundleRepository.save({ id: 0, name })
  }
}