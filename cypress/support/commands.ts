import 'cypress-file-upload'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      typeText(selector: string, textToType: string): Chainable<JQuery>;
    }
  }
}

const appUrl = process.env.APP_URL || 'http://localhost:3000'

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(`${appUrl}${url}`, options)
})

Cypress.Commands.add('typeText', (selector: string, textToType: string) => cy.get(selector).clear().type(textToType))
