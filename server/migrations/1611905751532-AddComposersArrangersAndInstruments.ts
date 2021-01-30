import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddComposersArrangerAndInstruments1611905751532 implements MigrationInterface {
    name = 'AddComposersArrangerAndInstruments1611905751532'

    private composerTable = new Table({
        name: 'composer', columns: [
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
    private resourceComposerTable = new Table({
        name: 'resource_composer', columns: [
            {
                name: 'resourceId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            }, {
                name: 'composerId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            },
        ], foreignKeys: [
            {
                name: 'resource_composer_resourceId',
                columnNames: ['resourceId'],
                referencedTableName: 'resource',
                referencedColumnNames: ['id'],
            }, {
                name: 'resource_composer_composerId',
                columnNames: ['composerId'],
                referencedTableName: 'composer',
                referencedColumnNames: ['id'],
            },
        ],
    })

    private arrangerTable = new Table({
        name: 'arranger', columns: [
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
    private resourceArrangerTable = new Table({
        name: 'resource_arranger', columns: [
            {
                name: 'resourceId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            }, {
                name: 'arrangerId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            },
        ], foreignKeys: [
            {
                name: 'resource_arranger_resourceId',
                columnNames: ['resourceId'],
                referencedTableName: 'resource',
                referencedColumnNames: ['id'],
            }, {
                name: 'resource_arranger_arrangerId',
                columnNames: ['arrangerId'],
                referencedTableName: 'arranger',
                referencedColumnNames: ['id'],
            },
        ],
    })

    private instrumentTable = new Table({
        name: 'instrument', columns: [
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
    private resourceInstrumentTable = new Table({
        name: 'resource_instrument', columns: [
            {
                name: 'resourceId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            }, {
                name: 'instrumentId',
                type: 'int',
                isNullable: false,
                isPrimary: true,
            },
        ], foreignKeys: [
            {
                name: 'resource_instrument_resourceId',
                columnNames: ['resourceId'],
                referencedTableName: 'resource',
                referencedColumnNames: ['id'],
            }, {
                name: 'resource_instrument_instrumentId',
                columnNames: ['instrumentId'],
                referencedTableName: 'instrument',
                referencedColumnNames: ['id'],
            },
        ],
    })

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.composerTable)
        await queryRunner.createTable(this.resourceComposerTable)

        await queryRunner.createTable(this.arrangerTable)
        await queryRunner.createTable(this.resourceArrangerTable)

        await queryRunner.createTable(this.instrumentTable)
        await queryRunner.createTable(this.resourceInstrumentTable)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.composerTable)
        await queryRunner.dropTable(this.resourceComposerTable)

        await queryRunner.dropTable(this.arrangerTable)
        await queryRunner.dropTable(this.resourceArrangerTable)

        await queryRunner.dropTable(this.instrumentTable)
        await queryRunner.dropTable(this.resourceInstrumentTable)
    }
}
