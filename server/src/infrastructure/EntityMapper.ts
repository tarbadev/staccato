import { BundleEntity } from './BundleEntity'
import Bundle from '../application/Bundle'

export const mapBundleEntity = (bundleEntity: BundleEntity): Bundle => {
  return {
    id: bundleEntity.id,
    name: bundleEntity.name,
    googleDriveId: bundleEntity.googleDriveId,
  }
}