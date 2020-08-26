import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BundleEntity } from './BundleEntity'

@Entity({ name: 'resource' })
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title?: string
  @Column()
  googleDriveId: string
  @Column()
  googleDriveLink: string
  @ManyToOne(() => BundleEntity, bundle => bundle.resources)
  bundle: BundleEntity

  constructor(
    id: number,
    title: string | undefined,
    googleDriveId: string,
    googleDriveLink: string,
    bundle: BundleEntity,
  ) {
    this.id = id
    this.title = title
    this.googleDriveId = googleDriveId
    this.googleDriveLink = googleDriveLink
    this.bundle = bundle
  }
}