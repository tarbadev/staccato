import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BundleEntity } from './BundleEntity'
import { AuthorEntity } from './AuthorEntity'
import { ResourceType } from '../../application/Resource'

@Entity({ name: 'resource' })
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title?: string
  @Column()
  type: ResourceType
  @Column()
  googleDriveId: string
  @Column()
  googleDriveLink: string
  @Column()
  source?: string
  @ManyToOne(() => BundleEntity, bundle => bundle.resources)
  bundle?: BundleEntity
  @ManyToMany(() => AuthorEntity, author => author.resources, { cascade: true, eager: true })
  @JoinTable({ name: 'resource_author' })
  authors?: AuthorEntity[]

  constructor(
    id: number,
    title: string | undefined,
    type: ResourceType,
    googleDriveId: string,
    googleDriveLink: string,
    source: string | undefined,
    authors?: AuthorEntity[],
    bundle?: BundleEntity,
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
    this.source = source
    this.bundle = bundle
    this.authors = authors
  }
}