import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BundleEntity } from './BundleEntity'

@Entity()
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title?: string
  @Column()
  googleDriveId: string
  @ManyToOne(() => BundleEntity, bundle => bundle.resources)
  bundle: BundleEntity

  constructor(id: number, title: string | undefined, googleDriveId: string, bundle: BundleEntity) {
    this.id = id
    this.title = title
    this.googleDriveId = googleDriveId
    this.bundle = bundle
  }
}