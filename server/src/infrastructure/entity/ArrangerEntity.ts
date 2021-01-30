import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { ResourceEntity } from './ResourceEntity'

@Entity({ name: 'arranger' })
export class ArrangerEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @ManyToMany(() => ResourceEntity, resource => resource.arrangers)
  resources?: ResourceEntity[]

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}