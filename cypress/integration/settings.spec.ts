const addAuthorizedUser = (email: string): void => {
  const addButtonSelector = '[data-add-express]'
  const userEmailSelector = '[data-new-express-name] input'
  const submitBundleSelector = '[data-submit-express]'

  cy.get(addButtonSelector).click()
  cy.typeText(userEmailSelector, email)
  cy.get(submitBundleSelector).click()
  cy.waitFor(`[data-authorized-user='${email}']`)
}

describe('Settings', () => {
  before(() => cy.task('database:createConnection'))

  after(() => cy.task('database:closeConnection'))

  beforeEach(() => cy.task('database:clear'))

  it('should display the list authorized users', () => {
    cy.task('googleDrive:deletePermission', { email: 'someuser@example.com' })
    cy.visit('/settings')

    cy.get('[data-authorized-user').should('have.length', 2)
  })

  it('should add an authorized users', () => {
    cy.task('googleDrive:deletePermission', { email: 'someuser@example.com' })
    cy.visit('/settings')

    cy.get('[data-authorized-user').should('have.length', 2)

    addAuthorizedUser('someuser@example.com')

    cy.get('[data-authorized-user', { timeout: 6000 }).should('have.length', 3)

    cy.task('googleDrive:deletePermission', { email: 'someuser@example.com', failOnError: true })
  })
})