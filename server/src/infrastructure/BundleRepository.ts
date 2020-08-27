import { getManager } from 'typeorm'
import { BundleEntity } from './entity/BundleEntity'
import { mapFromEntity, mapToEntity } from './EntityMapper'
import Bundle from '../application/Bundle'
import { AuthorEntity } from './entity/AuthorEntity'

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
      const authorEntities = await authorRepository.find()
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
      }
    }
    const storedEntity = await getManager().getRepository(BundleEntity).save(bundleEntity)
    return mapFromEntity(storedEntity)
  }
}