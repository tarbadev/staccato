import { BundleEntity } from './entity/BundleEntity'
import Bundle from '../application/Bundle'
import { ResourceEntity } from './entity/ResourceEntity'
import Resource from '../application/Resource'
import { AuthorEntity } from './entity/AuthorEntity'

const mapResourceEntity = (resourceEntity: ResourceEntity): Resource => {
  return new Resource(
    resourceEntity.id,
    resourceEntity.title,
    resourceEntity.type,
    resourceEntity.googleDriveId,
    resourceEntity.googleDriveLink,
    resourceEntity.source,
    resourceEntity.authors?.map(author => author.name),
  )
}

export const mapFromEntity = (bundleEntity: BundleEntity): Bundle => {
  return new Bundle(
    bundleEntity.id,
    bundleEntity.name,
    bundleEntity.googleDriveId,
    bundleEntity.resources?.map(mapResourceEntity),
  )
}

const mapResource = (resource: Resource): ResourceEntity => {
  return new ResourceEntity(
    resource.id,
    resource.title,
    resource.type,
    resource.googleDriveId,
    resource.googleDriveLink,
    resource.source,
    resource.authors ? resource.authors.map(author => new AuthorEntity(0, author)) : [],
    undefined,
  )
}

export const mapToEntity = (bundle: Bundle): BundleEntity => {
  return new BundleEntity(
    bundle.id,
    bundle.name,
    bundle.googleDriveId,
    bundle.resources?.map(mapResource),
  )
}