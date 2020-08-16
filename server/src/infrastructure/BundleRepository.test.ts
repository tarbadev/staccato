import BundleRepository from './BundleRepository'
import { BundleEntity } from './BundleEntity'
import connection from '@shared/DbHelperUnit'

describe('BundleRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

  it('should load the saved Bundles', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle' })

    expect(await BundleRepository.findAll()).toEqual([bundle])
  })
})