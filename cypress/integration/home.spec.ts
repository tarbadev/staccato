import { BundleEntity } from 'staccato-server/src/infrastructure/entity/BundleEntity'

const addBundle = async (bundleName: string): Promise<void> => {
  const addButtonSelector = '[data-add-express]'
  const bundleNameSelector = '[data-new-express-name] input'
  const submitBundleSelector = '[data-submit-express]'

  cy.get(addButtonSelector).click()
  cy.typeText(bundleNameSelector, bundleName)
  cy.get(submitBundleSelector).click()
  cy.waitFor(`[data-bundle-name='${bundleName}']`)
}

describe('Home', () => {
  before(() => cy.task('database:createConnection'))

  after(() => cy.task('database:closeConnection'))

  beforeEach(() => cy.task('database:clear'))

  it('should display the list of bundles', () => {
    const bundlesToStore = [
      { name: 'Bundle 1', googleDriveId: '' },
      { name: 'Bundle 2', googleDriveId: '' },
      { name: 'Bundle 3', googleDriveId: '' },
    ]
    cy.task('database:store', { entity: 'BundleEntity', object: bundlesToStore })
      .then(() => {
        cy.visit('/')

        cy.get('[data-bundle-name]').should('have.length', 3)
        bundlesToStore.forEach(bundle => {
          cy.get(`[data-bundle-name='${bundle.name}']`).should('have.text', bundle.name)
        })
      })
  })

  it('should display the newly created bundle', () => {
    const bundleName = 'Some Super New Bundle'

    cy.visit('/')

    addBundle(bundleName)

    cy.get('[data-bundle-name]').should('have.length', 1)
    cy.get(`[data-bundle-name='${bundleName}']`).should('have.text', bundleName)

    cy.task('googleDrive:deleteFolder', bundleName)
  })

  it('should redirect to Bundle detail page', () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
      .then(s => s as BundleEntity)
      .then(storedBundle => {
        cy.visit('/')

        cy.get(`[data-bundle-name='${bundleToStore.name}']`).click()

        cy.location()
          .then(location => location.pathname)
          .should('equal', `/bundles/${storedBundle.id}`)
      })
  })

  it('should redirect to Settings page', () => {
    cy.visit('/')

    cy.get('[data-menu-settings]').click()

    cy.location()
      .then(location => location.pathname)
      .should('equal', '/settings')
  })
})