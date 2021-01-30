import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { ResourceEntity } from './ResourceEntity'

@Entity({ name: 'composer' })
export class ComposerEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @ManyToMany(() => ResourceEntity, resource => resource.composers)
  resources?: ResourceEntity[]

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}