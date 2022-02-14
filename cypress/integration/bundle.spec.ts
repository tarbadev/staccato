import { AudioType, ResourceType } from '@shared/Resource'
import { BundleEntity } from 'staccato-server/src/infrastructure/entity/BundleEntity'
import { describe } from 'mocha'

const editName = (newName: string): void => {
  const editButtonSelector = '[data-edit-bundle-name]'
  const bundleNameSelector = '[data-new-bundle-name] input'
  const submitBundleSelector = '[data-submit-bundle]'

  cy.get(editButtonSelector).click()
  cy.typeText(bundleNameSelector, newName)
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

  cy.typeText('[data-add-image-title] input', title)

  cy.get('[data-dropzone-container="image"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const deleteResourceByTitle = (title: string): void => {
  cy.get('[data-resource-title]')
    .contains(title, { timeout: 2000 })
    .get('[data-delete-icon]')
    .click()

  cy.get('[data-resource-title]', { timeout: 15000 }).should('not.exist')
}

const addVideo = (path: string, title: string, source: string, authors: string[]): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-video-resource]').click()

  cy.typeText('[data-add-video-title] input', title)
  cy.typeText('[data-add-video-source] input', source)
  cy.typeText('[data-add-video-authors] input', authors.join(';'))

  cy.get('[data-dropzone-container="video"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const addMusic = (path: string, title: string, album: string, authors: string[], audioType: AudioType): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-audio-resource]').click()

  cy.typeText('[data-add-music-title] input', title)
  cy.typeText('[data-add-music-album] input', album)
  cy.typeText('[data-add-music-authors] input', authors.join(';'))

  if (audioType === 'playback') {
    cy.get('[data-add-music-type]').click()
  }

  cy.get('[data-dropzone-container="music"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const addSongPartition = (path: string, title: string, authors: string[]): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-song-partition-resource]').click()

  cy.typeText('[data-add-song-partition-title] input', title)
  cy.typeText('[data-add-song-partition-authors] input', authors.join(';'))

  cy.get('[data-dropzone-container="song-partition"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const addOrchestralPartition = (
  path: string,
  title: string,
  composers: string[],
  arrangers: string[],
  instruments: string[],
): void => {
  cy.get('[data-add-resource]').click()
  cy.get('[data-add-orchestral-partition-resource]').click()

  cy.typeText('[data-add-orchestral-partition-title] input', title)
  cy.typeText('[data-add-orchestral-partition-composers] input', composers.join(';'))
  cy.typeText('[data-add-orchestral-partition-arrangers] input', arrangers.join(';'))
  cy.typeText('[data-add-orchestral-partition-instruments] input', instruments.join(';'))

  cy.get('[data-dropzone-container="orchestral-partition"] input[type="file"]').attachFile(path)

  cy.get('[data-button-submit]').click()

  cy.get('[data-resource-title]').contains(title, { timeout: 2000 })
}

const verifyExpectedResource = ({
                                  album = '',
                                  authors = [],
                                  source = '',
                                  title,
                                  type,
                                  audioType,
                                  composers = [],
                                  arrangers = [],
                                  instruments = [],
                                }: {
  title: string;
  type: ResourceType;
  source?: string;
  authors?: string[];
  album?: string;
  audioType?: AudioType;
  composers?: string[];
  arrangers?: string[];
  instruments?: string[];
}): void => {
  if (type === 'image') {
    verifyTextContent('[data-resource-title]', title)
  } else if (type === 'video') {
    verifyTextContent('[data-resource-title] .MuiCardHeader-title', title)
    verifyTextContent('[data-resource-source]', source, source => source.replace('Source: ', ''))
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
  } else if (type === 'audio') {
    if (audioType) {
      verifyTextContent('[data-music-resource-type]', audioType, type => type.replace('Type: ', '').toLowerCase())
    }
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      title,
      text => text.split(' - ')[0],
    )
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      album,
      text => text.split(' - ')[1],
    )
  } else if (type === 'song-partition') {
    verifyTextContent('[data-resource-title] .MuiCardHeader-subheader', authors.join(', '))
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      title,
      text => text.split(' - ')[0],
    )
  } else if (type === 'orchestral-partition') {
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-title',
      title,
      text => text.split(' - ')[0],
    )
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-subheader',
      composers.join(', '),
      text => text.split(' - ')[0].replace('Composed by ', ''),
    )
    verifyTextContent(
      '[data-resource-title] .MuiCardHeader-subheader',
      arrangers.join(', '),
      text => text.split(' - ')[1].replace('Arranged by ', ''),
    )
    verifyTextContent('[data-resource-instruments]', instruments.join(', '), text => text.replace('Instruments: ', ''))
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

  it('should add and delete an image', () => {
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

            cy.task('googleDrive:getFilesInFolder', folderId).should('not.be.empty')

            deleteResourceByTitle(imageTitle)

            cy.task('googleDrive:getFilesInFolder', folderId).should('be.empty')
            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should add and delete a video', () => {
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

            cy.task('googleDrive:getFilesInFolder', folderId).should('not.be.empty')

            deleteResourceByTitle(videoTitle)

            cy.task('googleDrive:getFilesInFolder', folderId).should('be.empty')
            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should add and delete a song', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const title = 'An example music'
        const album = 'Some Album'
        const audioType = 'playback'
        const authors = ['First Author', 'Second Author']
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)
            addMusic('music.mp3', title, album, authors, audioType)

            verifyExpectedResource({ type: 'audio', title, album, authors, audioType: 'playback' })

            cy.task('googleDrive:getFilesInFolder', folderId).should('not.be.empty')

            deleteResourceByTitle(title)

            cy.task('googleDrive:getFilesInFolder', folderId).should('be.empty')
            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should add and delete a song partition', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const title = 'An example music'
        const authors = ['First Author', 'Second Author']
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)
            addSongPartition('song-partition.pdf', title, authors)

            verifyExpectedResource({ type: 'song-partition', title, authors })

            cy.task('googleDrive:getFilesInFolder', folderId).should('not.be.empty')

            deleteResourceByTitle(title)

            cy.task('googleDrive:getFilesInFolder', folderId).should('be.empty')
            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should add and delete an orchestral partition', () => {
    cy.task('googleDrive:createFolder', 'Bundle 2')
      .then(folderId => {
        const title = 'An example music'
        const composers = ['First Composer', 'Second Composer']
        const arrangers = ['First Arranger', 'Second Arranger']
        const instruments = ['Piano', 'Violin', 'Trumpet']
        const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
        cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
          .then(b => b as BundleEntity)
          .then(storedBundle => {
            cy.goToBundlePage(storedBundle.id)
            addOrchestralPartition('orchestral-partition.pdf', title, composers, arrangers, instruments)

            verifyExpectedResource({ type: 'orchestral-partition', title, composers, arrangers, instruments })

            cy.task('googleDrive:getFilesInFolder', folderId).should('not.be.empty')

            deleteResourceByTitle(title)

            cy.task('googleDrive:getFilesInFolder', folderId).should('be.empty')
            cy.task('googleDrive:deleteFolderById', folderId)
          })
      })
  })

  it('should open the bundle folder in Drive', () => {
    const bundleToStore: BundleEntity = { id: 0, name: 'Bundle 2', googleDriveId: '1xDo3_2QB5OqBiskgyHR8ekgJX1uVyWmG' }
    cy.task('database:store', { entity: 'BundleEntity', object: bundleToStore })
      .then(b => b as BundleEntity)
      .then(storedBundle => {
        cy.goToBundlePage(storedBundle.id)

        cy.get('[data-view-in-drive]')
          .should('have.attr', 'target', '_blank')
          .should('have.attr', 'href', `https://drive.google.com/drive/folders/${storedBundle.googleDriveId}`)
      })
  })
})