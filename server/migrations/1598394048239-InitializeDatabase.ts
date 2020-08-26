import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions'
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions'

export class InitializeDatabase1598394048239 implements MigrationInterface {
  name = 'InitializeDatabase1598394048239'

  private bundleTableOptions(): TableOptions {
    const idColumn: TableColumnOptions = {
      name: 'id',
      type: 'int',
      isGenerated: true,
      generationStrategy: 'increment',
      isNullable: false,
      isPrimary: true,
    }
    const nameColumn: TableColumnOptions = { name: 'name', type: 'varchar', isNullable: false }
    const googleDriveIdColumn: TableColumnOptions = { name: 'googleDriveId', type: 'varchar', isNullable: false }

    return { name: 'bundle', columns: [idColumn, nameColumn, googleDriveIdColumn] }
  }

  private resourceTableOptions(): TableOptions {
    const idColumn: TableColumnOptions = {
      name: 'id',
      type: 'int',
      isGenerated: true,
      generationStrategy: 'increment',
      isNullable: false,
      isPrimary: true,
    }
    const titleColumn: TableColumnOptions = { name: 'title', type: 'varchar', isNullable: true }
    const googleDriveIdColumn: TableColumnOptions = { name: 'googleDriveId', type: 'varchar', isNullable: false }
    const googleDriveLinkColumn: TableColumnOptions = { name: 'googleDriveLink', type: 'varchar', isNullable: false }
    const bundleIdColumn: TableColumnOptions = { name: 'bundleId', type: 'int', isNullable: false }

    return {
      name: 'resource',
      columns: [idColumn, titleColumn, googleDriveIdColumn, googleDriveLinkColumn, bundleIdColumn],
      foreignKeys: [
        {
          name: 'resource',
          columnNames: ['bundleId'],
          referencedTableName: 'bundle',
          referencedColumnNames: ['id'],
        },
      ],
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table(this.bundleTableOptions()))
    await queryRunner.createTable(new Table(this.resourceTableOptions()))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('resource')
    await queryRunner.dropTable('bundle')
  }
}
