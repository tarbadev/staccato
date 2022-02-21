import { BundleEntity } from './entity/BundleEntity'
import Bundle from '../domain/Bundle'
import { ResourceEntity } from './entity/ResourceEntity'
import Resource from '../domain/Resource'
import { AuthorEntity } from './entity/AuthorEntity'
import { ComposerEntity } from './entity/ComposerEntity'
import { ArrangerEntity } from './entity/ArrangerEntity'
import { InstrumentEntity } from './entity/InstrumentEntity'

export const mapFromResourceEntity = (resourceEntity: ResourceEntity): Resource => {
  return new Resource(
    resourceEntity.id,
    resourceEntity.title,
    resourceEntity.type,
    resourceEntity.googleDriveId,
    resourceEntity.googleDriveLink,
    resourceEntity.source,
    resourceEntity.authors?.map(author => author.name),
    resourceEntity.album,
    resourceEntity.audioType,
    resourceEntity.composers?.map(composer => composer.name),
    resourceEntity.arrangers?.map(arranger => arranger.name),
    resourceEntity.instruments?.map(instrument => instrument.name),
  )
}

export const mapFromBundleEntity = (bundleEntity: BundleEntity): Bundle => {
  return new Bundle(
    bundleEntity.id,
    bundleEntity.name,
    bundleEntity.googleDriveId,
    bundleEntity.resources?.map(mapFromResourceEntity),
  )
}

const mapToResourceEntity = (bundleEntity: BundleEntity, resource: Resource): ResourceEntity => {
  return new ResourceEntity(
    resource.id,
    resource.title,
    resource.type,
    resource.googleDriveId,
    resource.googleDriveLink,
    bundleEntity,
    resource.source,
    resource.authors ? resource.authors.map(author => new AuthorEntity(0, author)) : [],
    resource.album,
    resource.audioType,
    resource.composers ? resource.composers.map(composer => new ComposerEntity(0, composer)) : [],
    resource.arrangers ? resource.arrangers.map(arranger => new ArrangerEntity(0, arranger)) : [],
    resource.instruments ? resource.instruments.map(instrument => new InstrumentEntity(0, instrument)) : [],
  )
}

export const mapToBundleEntity = (bundle: Bundle): BundleEntity => {
  const bundleEntity = new BundleEntity(
    bundle.id,
    bundle.name,
    bundle.googleDriveId,
    [],
  )
  bundleEntity.resources = bundle.resources?.map(resource => mapToResourceEntity(bundleEntity, resource))

  return bundleEntity
}