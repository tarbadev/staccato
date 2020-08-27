import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class AddTypeSourceAndAuthors1598503225791 implements MigrationInterface {
  name = 'AddTypeSourceAndAuthors1598503225791'
  private newTypeColumn = new TableColumn({ name: 'type', type: 'varchar', isNullable: false })
  private newSourceColumn = new TableColumn({ name: 'source', type: 'varchar', isNullable: true })
  private authorTable = new Table({
    name: 'author', columns: [
      {
        name: 'id',
        type: 'int',
        isGenerated: true,
        generationStrategy: 'increment',
        isNullable: false,
        isPrimary: true,
      }, { name: 'name', type: 'varchar', isNullable: false },
    ],
  })
  private resourceAuthorTable = new Table({
    name: 'resource_author', columns: [
      {
        name: 'resourceId',
        type: 'int',
        isNullable: false,
        isPrimary: true,
      }, {
        name: 'authorId',
        type: 'int',
        isNullable: false,
        isPrimary: true,
      },
    ], foreignKeys: [
      {
        name: 'resource_author_resourceId',
        columnNames: ['resourceId'],
        referencedTableName: 'resource',
        referencedColumnNames: ['id'],
      }, {
        name: 'resource_author_authorId',
        columnNames: ['authorId'],
        referencedTableName: 'author',
        referencedColumnNames: ['id'],
      },
    ],
  })

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.authorTable)
    await queryRunner.createTable(this.resourceAuthorTable)

    await queryRunner.addColumns(
      'resource',
      [
        this.newTypeColumn,
        this.newSourceColumn,
      ],
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.resourceAuthorTable)
    await queryRunner.dropTable(this.authorTable)

    await queryRunner.dropColumns('resource', [
      this.newTypeColumn,
      this.newSourceColumn,
    ])
  }
}
