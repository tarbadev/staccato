import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BundleEntity } from './BundleEntity'
import { AuthorEntity } from './AuthorEntity'
import { AudioType, ResourceType } from '@shared/Resource'
import { ComposerEntity } from './ComposerEntity'
import { ArrangerEntity } from './ArrangerEntity'
import { InstrumentEntity } from './InstrumentEntity'

@Entity({ name: 'resource' })
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title?: string
  @Column({ type: 'varchar' })
  type: ResourceType
  @Column()
  googleDriveId: string
  @Column()
  googleDriveLink: string
  @Column()
  source?: string
  @Column()
  album?: string
  @Column({ type: 'varchar' })
  audioType?: AudioType
  @ManyToOne(() => BundleEntity, bundle => bundle.resources)
  bundle?: BundleEntity
  @ManyToMany(() => AuthorEntity, author => author.resources, { cascade: true, eager: true })
  @JoinTable({ name: 'resource_author' })
  authors?: AuthorEntity[]
  @ManyToMany(() => ComposerEntity, composer => composer.resources, { cascade: true, eager: true })
  @JoinTable({ name: 'resource_composer' })
  composers?: ComposerEntity[]
  @ManyToMany(() => ArrangerEntity, arranger => arranger.resources, { cascade: true, eager: true })
  @JoinTable({ name: 'resource_arranger' })
  arrangers?: ArrangerEntity[]
  @ManyToMany(() => InstrumentEntity, instrument => instrument.resources, { cascade: true, eager: true })
  @JoinTable({ name: 'resource_instrument' })
  instruments?: InstrumentEntity[]

  constructor(
    id: number,
    title: string | undefined,
    type: ResourceType,
    googleDriveId: string,
    googleDriveLink: string,
    source?: string,
    authors?: AuthorEntity[],
    album?: string,
    audioType?: AudioType,
    bundle?: BundleEntity,
    composers?: ComposerEntity[],
    arrangers?: ArrangerEntity[],
    instruments?: InstrumentEntity[],
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
    this.source = source
    this.bundle = bundle
    this.authors = authors
    this.album = album
    this.audioType = audioType
    this.composers = composers
    this.arrangers = arrangers
    this.instruments = instruments
  }
}