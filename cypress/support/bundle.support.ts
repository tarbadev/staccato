declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      goToBundlePage(bundleId: number): Chainable<AUTWindow>;
    }
  }
}

Cypress.Commands.add('goToBundlePage', (bundleId: number) => {
  cy.visit(`/bundles/${bundleId}`)
})

export {}