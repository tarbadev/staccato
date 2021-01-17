import { BundleEntity } from 'staccato-server/src/infrastructure/entity/BundleEntity'

const editName = (newName: string): void => {
  const editButtonSelector = '[data-edit-bundle-name]'
  const bundleNameSelector = '[data-new-bundle-name] input'
  const submitBundleSelector = '[data-submit-bundle]'

  cy.get(editButtonSelector).click()
  cy.get(bundleNameSelector).clear().type(newName)
  cy.get(submitBundleSelector).click()
  cy.waitFor(`[data-bundle-name='${newName}']`)
}

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

  it('should rename the bundle', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        const newName = 'My super new name'
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)

            cy.get('[data-bundle-name]').should('have.text', storedBundle.name)

            editName(newName)
            cy.get('[data-bundle-name]').should('have.text', newName)

            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })
})