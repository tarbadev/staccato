import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { ResourceEntity } from './ResourceEntity'

@Entity({ name: 'instrument' })
export class InstrumentEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @ManyToMany(() => ResourceEntity, resource => resource.instruments)
  resources?: ResourceEntity[]

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}