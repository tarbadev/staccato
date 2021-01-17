import { BundleEntity } from 'staccato-server/src/infrastructure/entity/BundleEntity'

describe('Bundle', () => {
  before(() => cy.task('database:createConnection'))

  after(() => cy.task('database:closeConnection'))

  beforeEach(() => cy.task('database:clear'))

  it('should display the bundle details', () => {
    const bundleToStore: BundleEntity = { id: 0, name: 'Bundle 2', googleDriveId: '' }
    cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
      .then(b => b as BundleEntity)
      .then(storedBundle => {
        cy.goToBundlePage(storedBundle.id)

        cy.get('[data-bundle-name]').should('have.text', storedBundle.name)
      })
  })
})