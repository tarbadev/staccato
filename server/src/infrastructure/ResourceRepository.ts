import { getManager } from 'typeorm'
import { ResourceEntity } from './entity/ResourceEntity'
import Resource from '../domain/Resource'
import { mapFromResourceEntity, mapToBundleEntity, mapToResourceEntity } from './EntityMapper'
import Bundle from '../domain/Bundle'
import { AuthorEntity } from './entity/AuthorEntity'
import { ComposerEntity } from './entity/ComposerEntity'
import { ArrangerEntity } from './entity/ArrangerEntity'
import { InstrumentEntity } from './entity/InstrumentEntity'

export default class ResourceRepository {
  static async save(bundle: Bundle, resource: Resource): Promise<Resource> {
    const authorRepository = getManager().getRepository(AuthorEntity)
    const composerRepository = getManager().getRepository(ComposerEntity)
    const arrangerRepository = getManager().getRepository(ArrangerEntity)
    const instrumentRepository = getManager().getRepository(InstrumentEntity)

    const authorEntities = await authorRepository.find()
    const composerEntities = await composerRepository.find()
    const arrangerEntities = await arrangerRepository.find()
    const instrumentEntities = await instrumentRepository.find()

    const resourceEntity = mapToResourceEntity(mapToBundleEntity(bundle), resource)

    if (resourceEntity.authors) {
      for (let y = 0; y < resourceEntity.authors.length; y++) {
        const author = resourceEntity.authors[y]
        let authorEntity = authorEntities.find(entity => entity.name === author.name)

        if (!authorEntity) {
          authorEntity = await authorRepository.save(author)
          authorEntities.push(authorEntity)
        }

        resourceEntity.authors[y] = authorEntity
      }
    }

    if (resourceEntity.composers) {
      for (let y = 0; y < resourceEntity.composers.length; y++) {
        const composer = resourceEntity.composers[y]
        let composerEntity = composerEntities.find(entity => entity.name === composer.name)

        if (!composerEntity) {
          composerEntity = await composerRepository.save(composer)
          composerEntities.push(composerEntity)
        }

        resourceEntity.composers[y] = composerEntity
      }
    }

    if (resourceEntity.arrangers) {
      for (let y = 0; y < resourceEntity.arrangers.length; y++) {
        const arranger = resourceEntity.arrangers[y]
        let arrangerEntity = arrangerEntities.find(entity => entity.name === arranger.name)

        if (!arrangerEntity) {
          arrangerEntity = await arrangerRepository.save(arranger)
          arrangerEntities.push(arrangerEntity)
        }

        resourceEntity.arrangers[y] = arrangerEntity
      }
    }

    if (resourceEntity.instruments) {
      for (let y = 0; y < resourceEntity.instruments.length; y++) {
        const instrument = resourceEntity.instruments[y]
        let instrumentEntity = instrumentEntities.find(entity => entity.name === instrument.name)

        if (!instrumentEntity) {
          instrumentEntity = await instrumentRepository.save(instrument)
          instrumentEntities.push(instrumentEntity)
        }

        resourceEntity.instruments[y] = instrumentEntity
      }
    }

    const storedEntity = await getManager().getRepository(ResourceEntity).save(resourceEntity)
    return mapFromResourceEntity(storedEntity)
  }

  static async findOne(id: number): Promise<Resource> {
    const resourceEntity = await getManager().getRepository(ResourceEntity).findOne(id)

    if (resourceEntity) {
      return mapFromResourceEntity(resourceEntity)
    } else {
      throw new Error(`Resource with id ${id} was not found`)
    }
  }

  static async delete(id: number): Promise<void> {
    const resourceRepository = getManager().getRepository(ResourceEntity)
    const resource = await resourceRepository.findOne(id)

    if (!resource) {
      throw new Error('Resource was not found')
    }

    const resourceWithoutRelationships: ResourceEntity = {
      ...resource,
      bundle: resource.bundle,
      authors: [],
      arrangers: [],
      composers: [],
      instruments: [],
    }

    await resourceRepository.save(resourceWithoutRelationships)
    await resourceRepository.delete(id)
  }
}