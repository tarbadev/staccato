import { BundleEntity } from './BundleEntity'
import Bundle from '../application/Bundle'
import { ResourceEntity } from './ResourceEntity'
import Resource from '../application/Resource'

const mapResourceEntity = (resourceEntity: ResourceEntity): Resource => {
  return new Resource(resourceEntity.id, resourceEntity.title, resourceEntity.googleDriveId)
}

export const mapBundleEntity = (bundleEntity: BundleEntity): Bundle => {
  return new Bundle(
    bundleEntity.id,
    bundleEntity.name,
    bundleEntity.googleDriveId,
    bundleEntity.resources?.map(mapResourceEntity)
  )
}