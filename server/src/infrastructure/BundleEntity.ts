import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import Bundle from '@shared/Bundle'

@Entity()
export class BundleEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string

  toDomain(): Bundle {
    return {
      id: this.id,
      name: this.name,
    }
  }
}