const mockGoogleAuth = jest.fn()
const mockDrive = jest.fn()
jest.mock(
  'googleapis',
  () => ({
    google: {
      auth: {
        GoogleAuth: mockGoogleAuth,
      },
      drive: mockDrive,
    },
  }),
)

import { drive_v3 } from 'googleapis'
import GoogleDrive from './GoogleDrive'
import Params$Resource$Files$Update = drive_v3.Params$Resource$Files$Update


describe('GoogleDrive', () => {
  const mockAccessToken = jest.fn()
  const mockCreateFile = jest.fn()
  const mockListFile = jest.fn()
  const mockUpdateFile = jest.fn()
  const driveObject = {
    files: {
      create: mockCreateFile,
      list: mockListFile,
      update: mockUpdateFile,
    },
  }

  describe('Instance', () => {
    const staccatoFolderId = 'SomeIdForStaccatoFolder'
    let googleDriveInstance: GoogleDrive
    beforeEach(async () => {
      mockGoogleAuth.mockImplementationOnce(() => ({ getAccessToken: mockAccessToken }))
      mockDrive.mockImplementationOnce(() => driveObject)
      const findFolderSpy = jest.spyOn(GoogleDrive.prototype, 'findFolder')
      findFolderSpy.mockResolvedValueOnce(staccatoFolderId)
      await GoogleDrive.initialize('')
      googleDriveInstance = GoogleDrive.getInstance()
    })

    describe('createFolder', () => {
      it('should create a file with mime type folder', async () => {
        const name = 'My Bundle Name'
        const expectedId = 'SuperSecretId'
        const expectedOptions = {
          requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [staccatoFolderId],
          },
          media: {
            mimeType: 'application/vnd.google-apps.folder',
          },
        }

        mockCreateFile.mockResolvedValueOnce({
          data: {
            id: expectedId,
          },
        })

        const returnedId = await googleDriveInstance.createFolder(name)

        expect(returnedId).toEqual(expectedId)
        expect(mockCreateFile).toHaveBeenCalledWith(expectedOptions)
      })
    })

    describe('findFolder', () => {
      it('should find a folder given a name', async () => {
        const folderName = 'My Bundle Name'
        const expectedId = 'SuperSecretId'
        const expectedOptions = {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        }

        mockListFile.mockResolvedValueOnce({
          data: {
            files: [{ id: expectedId }],
          },
        })

        const returnedId = await googleDriveInstance.findFolder(folderName)

        expect(returnedId).toEqual(expectedId)
        expect(mockListFile).toHaveBeenCalledWith(expectedOptions)
      })
    })

    describe('renameFile', () => {
      it('should update the file given an id', async () => {
        const folderName = 'My Bundle Name'
        const folderId = 'SuperSecretId'
        const expectedOptions: Params$Resource$Files$Update = {
          fileId: folderId,
          fields: 'id, name',
          requestBody: {
            name: folderName,
          },
        }

        mockUpdateFile.mockResolvedValueOnce({ data: { id: folderId } })

        const returnedId = await googleDriveInstance.renameFile(folderId, folderName)

        expect(returnedId).toEqual(folderId)
        expect(mockUpdateFile).toHaveBeenCalledWith(expectedOptions)
      })
    })

    describe('initializeStaccatoFolder', () => {
      it('should call findFolder and create it on rejection', async () => {
        const folderName = 'Staccato'
        const folderId = 'SecretId'

        const findFolderSpy = jest.spyOn(googleDriveInstance, 'findFolder')
        const createFolderSpy = jest.spyOn(googleDriveInstance, 'createFolder')

        findFolderSpy.mockRejectedValueOnce('')
        createFolderSpy.mockResolvedValueOnce(folderId)

        await googleDriveInstance.initializeStaccatoFolder()

        expect(findFolderSpy).toHaveBeenCalledWith(folderName)
        expect(createFolderSpy).toHaveBeenCalledWith(folderName)
      })

      it('should not call createFolder when folder is found', async () => {
        const folderName = 'Staccato'
        const folderId = 'SecretId'

        const findFolderSpy = jest.spyOn(googleDriveInstance, 'findFolder')
        const createFolderSpy = jest.spyOn(googleDriveInstance, 'createFolder')

        createFolderSpy.mockReset()
        findFolderSpy.mockResolvedValueOnce(folderId)
        createFolderSpy.mockResolvedValueOnce(folderId)

        await googleDriveInstance.initializeStaccatoFolder()

        expect(findFolderSpy).toHaveBeenCalledWith(folderName)
        expect(createFolderSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('initialize', () => {
    beforeEach(() => {
      GoogleDrive.destroyInstance()
    })

    it('should load the credentials, assign drive object and call initializeStaccatoFolder', async () => {
      const credentialsPath = 'Some/path/to/credentials.json'
      const oAuth2Client = { getAccessToken: mockAccessToken }
      const expectedAuthOptions = {
        keyFile: credentialsPath,
        scopes: 'https://www.googleapis.com/auth/drive',
      }
      const expectedDriveOptions = {
        version: 'v3',
        auth: oAuth2Client,
      }

      const initializeStaccatoFolderSpy = jest.spyOn(GoogleDrive.prototype, 'initializeStaccatoFolder')
      initializeStaccatoFolderSpy.mockResolvedValueOnce()

      mockGoogleAuth.mockImplementationOnce(() => oAuth2Client)
      mockDrive.mockImplementationOnce(() => driveObject)

      await GoogleDrive.initialize(credentialsPath)

      expect(mockGoogleAuth).toHaveBeenCalledWith(expectedAuthOptions)
      expect(mockDrive).toHaveBeenCalledWith(expectedDriveOptions)
      expect(initializeStaccatoFolderSpy).toHaveBeenCalled()
      expect(GoogleDrive.getInstance().drive).toEqual(driveObject)
    })
  })
})