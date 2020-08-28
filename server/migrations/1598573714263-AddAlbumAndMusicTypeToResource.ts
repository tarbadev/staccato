import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddAlbumAndAudioTypeToResource1598573714263 implements MigrationInterface {
  name = 'AddAlbumAndAudioTypeToResource1598573714263'
  private newAlbumColumn = new TableColumn({ name: 'album', type: 'varchar', isNullable: true })
  private newAudioTypeColumn = new TableColumn({ name: 'audioType', type: 'varchar', isNullable: true })

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'resource',
      [
        this.newAlbumColumn,
        this.newAudioTypeColumn,
      ],
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('resource', [
      this.newAlbumColumn,
      this.newAudioTypeColumn,
    ])
  }
}
