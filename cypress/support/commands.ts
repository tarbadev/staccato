import 'cypress-file-upload'
const appUrl = process.env.APP_URL || 'http://localhost:3000'

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(`${appUrl}${url}`, options)
})
