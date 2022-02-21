import { getManager } from 'typeorm'
import { BundleEntity } from './entity/BundleEntity'
import { mapFromEntity, mapToEntity } from './EntityMapper'
import Bundle from '../domain/Bundle'
import { AuthorEntity } from './entity/AuthorEntity'
import { ComposerEntity } from './entity/ComposerEntity'
import { ArrangerEntity } from './entity/ArrangerEntity'
import { InstrumentEntity } from './entity/InstrumentEntity'

export default class BundleRepository {
  static async findAll(): Promise<Bundle[]> {
    const bundleEntities = await getManager().getRepository(BundleEntity).find()
    return bundleEntities.map(mapFromEntity)
  }

  static async findOne(id: number): Promise<Bundle> {
    const bundleEntity = await getManager().getRepository(BundleEntity).findOne(id)

    if (bundleEntity) {
      return mapFromEntity(bundleEntity)
    } else {
      throw new Error(`Bundle with id ${id} was not found`)
    }
  }

  static async save(bundle: Bundle): Promise<Bundle> {
    const bundleEntity = mapToEntity(bundle)

    if (bundleEntity.resources && bundleEntity.resources.length > 0) {
      const authorRepository = getManager().getRepository(AuthorEntity)
      const composerRepository = getManager().getRepository(ComposerEntity)
      const arrangerRepository = getManager().getRepository(ArrangerEntity)
      const instrumentRepository = getManager().getRepository(InstrumentEntity)

      const authorEntities = await authorRepository.find()
      const composerEntities = await composerRepository.find()
      const arrangerEntities = await arrangerRepository.find()
      const instrumentEntities = await instrumentRepository.find()

      for (let index = 0; index < bundleEntity.resources.length; index++) {
        const resource = bundleEntity.resources[index]

        if (resource.authors) {
          for (let y = 0; y < resource.authors.length; y++) {
            const author = resource.authors[y]
            let authorEntity = authorEntities.find(entity => entity.name === author.name)

            if (!authorEntity) {
              authorEntity = await authorRepository.save(author)
              authorEntities.push(authorEntity)
            }

            resource.authors[y] = authorEntity
          }
        }

        if (resource.composers) {
          for (let y = 0; y < resource.composers.length; y++) {
            const composer = resource.composers[y]
            let composerEntity = composerEntities.find(entity => entity.name === composer.name)

            if (!composerEntity) {
              composerEntity = await composerRepository.save(composer)
              composerEntities.push(composerEntity)
            }

            resource.composers[y] = composerEntity
          }
        }

        if (resource.arrangers) {
          for (let y = 0; y < resource.arrangers.length; y++) {
            const arranger = resource.arrangers[y]
            let arrangerEntity = arrangerEntities.find(entity => entity.name === arranger.name)

            if (!arrangerEntity) {
              arrangerEntity = await arrangerRepository.save(arranger)
              arrangerEntities.push(arrangerEntity)
            }

            resource.arrangers[y] = arrangerEntity
          }
        }

        if (resource.instruments) {
          for (let y = 0; y < resource.instruments.length; y++) {
            const instrument = resource.instruments[y]
            let instrumentEntity = instrumentEntities.find(entity => entity.name === instrument.name)

            if (!instrumentEntity) {
              instrumentEntity = await instrumentRepository.save(instrument)
              instrumentEntities.push(instrumentEntity)
            }

            resource.instruments[y] = instrumentEntity
          }
        }
      }
    }
    const storedEntity = await getManager().getRepository(BundleEntity).save(bundleEntity)
    return mapFromEntity(storedEntity)
  }
}