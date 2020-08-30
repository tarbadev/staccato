import BundlePageHelper from './page-object/BundlePageHelper'
import connection from '@shared/DbHelperE2e'
import { createFolder, deleteFolderById } from './page-object/GoogleDriveHelper'
import * as path from 'path'

describe('Bundle', () => {
  let bundlePageHelper: BundlePageHelper

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    return connection.clear()
  })

  it('should display the bundle details', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()

    expect(await bundlePageHelper.getTitle()).toEqual(storedBundle.name)
  })

  it('should rename the bundle', async () => {
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const newName = 'My super new name'
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()

    expect(await bundlePageHelper.getTitle()).toEqual(storedBundle.name)

    await bundlePageHelper.editName(newName)
    expect(await bundlePageHelper.getTitle()).toEqual(newName)

    await deleteFolderById(folderId)
  })

  it('should add an image', async () => {
    const imageTitle = 'Super cute kitty'
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()
    await bundlePageHelper.addImage(path.join(__dirname, '../assets/kitty.jpg'), imageTitle)

    const resources = await bundlePageHelper.getResources()
    expect(resources[0]).toEqual({ type: 'image', title: imageTitle, authors: undefined, source: undefined })

    await deleteFolderById(folderId)
  })

  it('should add a video', async () => {
    const videoTitle = 'An example video'
    const videoSource = 'https://example.com'
    const videoAuthors = ['First Author', 'Second Author']
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()
    await bundlePageHelper.addVideo(path.join(__dirname, '../assets/video.mp4'), videoTitle, videoSource, videoAuthors)

    expect(await bundlePageHelper.getResources())
      .toEqual([{ type: 'video', title: videoTitle, source: videoSource, authors: videoAuthors }])

    await deleteFolderById(folderId)
  })

  it('should add a song', async () => {
    const title = 'An example music'
    const album = 'Some Album'
    const audioType = 'playback'
    const authors = ['First Author', 'Second Author']
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()
    await bundlePageHelper.addMusic(path.join(__dirname, '../assets/music.mp3'), title, album, authors, audioType)

    expect(await bundlePageHelper.getResources()).toEqual([{ type: 'audio', title, album, authors, audioType: 'Playback' }])

    await deleteFolderById(folderId)
  })

  it('should add a song partition', async () => {
    const title = 'An example music'
    const authors = ['First Author', 'Second Author']
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()
    await bundlePageHelper.addSongPartition(path.join(__dirname, '../assets/song-partition.pdf'), title, authors)

    expect(await bundlePageHelper.getResources()).toEqual([{ type: 'song-partition', title, authors }])

    await deleteFolderById(folderId)
  })
})