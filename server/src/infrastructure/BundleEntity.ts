import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BundleEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  googleDriveId: string

  constructor(id: number, name: string, googleDriveId: string) {
    this.id = id
    this.name = name
    this.googleDriveId = googleDriveId
  }
}