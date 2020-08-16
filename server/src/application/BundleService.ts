import Bundle from '@shared/Bundle'
import BundleRepository from '../infrastructure/BundleRepository'

export default class BundleService {
  list(): Promise<Bundle[]> {
    return BundleRepository.findAll()
  }
}