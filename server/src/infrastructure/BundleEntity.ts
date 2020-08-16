import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import Bundle from '@shared/Bundle'

@Entity()
export class BundleEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }

  toDomain(): Bundle {
    return {
      id: this.id,
      name: this.name,
    }
  }
}