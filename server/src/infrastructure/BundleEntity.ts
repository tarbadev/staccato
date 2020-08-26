import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ResourceEntity } from './ResourceEntity'

@Entity({ name: 'bundle' })
export class BundleEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  googleDriveId: string
  @OneToMany(() => ResourceEntity, resource => resource.bundle, { cascade: true, eager: true })
  resources?: ResourceEntity[]

  constructor(id: number, name: string, googleDriveId: string, resources?: ResourceEntity[]) {
    this.id = id
    this.name = name
    this.googleDriveId = googleDriveId
    this.resources = resources
  }
}