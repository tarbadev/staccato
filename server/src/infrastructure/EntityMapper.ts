import { BundleEntity } from './BundleEntity'
import Bundle from '@shared/Bundle'

export const mapBundleEntity = (bundleEntity: BundleEntity): Bundle => {
  return {
    id: bundleEntity.id,
    name: bundleEntity.name,
  }
}