import { AudioType, ResourceType } from '@shared/Resource'
import { BundleEntity } from 'staccato-server/src/infrastructure/entity/BundleEntity'
import Chainable = Cypress.Chainable

const typeText = (selector: string, textToType: string): Chainable<JQuery> => cy.get(selector).clear().type(textToType)
const editName = (newName: string): void => {
  const editButtonSelector = '[data-edit-bundle-name]'
  const bundleNameSelector = '[data-new-bundle-name] input'
  const submitBundleSelector = '[data-submit-bundle]'

  cy.get(editButtonSelector).click()
  typeText(bundleNameSelector, newName)
  cy.get(submitBundleSelector).click()
  cy.waitFor(`[data-bundle-name='${newName}']`)
}

const verifyTextContent = (
  selector: string,
  expectedText: string,
  textFormatCallback?: (unFormattedText: string) => string,
): void => {
  cy.get(selector)
    .invoke('text')
    .then(text => textFormatCallback ? textFormatCallback(text) : text)
    .should('equal', expectedText)
}

const addImage = (path: string, title: string): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-image-resource]').click()

  typeText('[data-add-image-title] input', title)

  cy.get('[data-dropzone-container="image"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const addVideo = (path: string, title: string, source: string, authors: string[]): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-video-resource]').click()

  typeText('[data-add-video-title] input', title)
  typeText('[data-add-video-source] input', source)
  typeText('[data-add-video-authors] input', authors.join(';'))

  cy.get('[data-dropzone-container="video"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const verifyExpectedResource = ({ album = '', authors = [], source = '', title, type }: {
  title: string;
  type: ResourceType;
  source?: string;
  authors?: string[];
  album?: string;
  audioType?: AudioType;
}): void => {
  if (type === 'image') {
    verifyTextContent('[data-resource-title]', title)
  } else if (type === 'video') {
    verifyTextContent('[data-resource-title] .MuiCardHeader-title', title)
    verifyTextContent('[data-resource-source]', source, source => source.replace('Source: ', ''))
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
  } else if (type === 'audio') {
    verifyTextContent('[data-music-resource-type]', source, type => type.replace('Type: ', ''))
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      title,
      text => text.split(' - ')[0],
    )
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      (album)!,
      text => text.split(' - ')[1],
    )
  } else if (type === 'song-partition') {
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      title,
      text => text.split(' - ')[0],
    )
  }
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

  it('should add an image', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const imageTitle = 'Super cute kitty'
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)
            addImage('kitty.jpg', imageTitle)

            verifyExpectedResource({
              type: 'image',
              title: imageTitle,
            })

            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should add a video', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const videoTitle = 'An example video'
        const videoSource = 'https://example.com'
        const videoAuthors = ['First Author', 'Second Author']
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)
            addVideo('video.mp4', videoTitle, videoSource, videoAuthors)

            verifyExpectedResource({ type: 'video', title: videoTitle, source: videoSource, authors: videoAuthors })

            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })
})