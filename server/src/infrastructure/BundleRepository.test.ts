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

  it('should load the saved Bundle', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle' })

    expect(await BundleRepository.findOne(bundle.id)).toEqual(bundle)
  })

  it('should throw if not found', async () => {
    await expect(BundleRepository.findOne(90)).rejects.toThrow(new Error('Bundle with id 90 was not found'))
  })
})