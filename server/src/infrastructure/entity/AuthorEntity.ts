import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'
import { ResourceEntity } from './ResourceEntity'

@Entity({ name: 'author' })
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @ManyToMany(() => ResourceEntity, resource => resource.authors)
  resources?: ResourceEntity[]

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}