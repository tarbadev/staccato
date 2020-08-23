import fs from 'fs'

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

import { drive_v3 as driveV3 } from 'googleapis'
import GoogleDrive from './GoogleDrive'
import Params$Resource$Permissions$List = driveV3.Params$Resource$Permissions$List
import Params$Resource$Permissions$Create = driveV3.Params$Resource$Permissions$Create
import Params$Resource$Files$Update = driveV3.Params$Resource$Files$Update
import { Readable } from 'stream'

describe('GoogleDrive', () => {
  const mockAccessToken = jest.fn()
  const mockCreateFile = jest.fn()
  const mockListFile = jest.fn()
  const mockUpdateFile = jest.fn()
  const mockListPermissions = jest.fn()
  const mockCreatePermissions = jest.fn()
  const driveObject = {
    files: {
      create: mockCreateFile,
      list: mockListFile,
      update: mockUpdateFile,
    },
    permissions: {
      list: mockListPermissions,
      create: mockCreatePermissions,
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

    describe('uploadFile', () => {
      it('should create a file', async () => {
        const filePath = '/path/to/temp/file'
        const bundleId = 'My Bundle id'
        const name = 'My Image Name.png'
        const expectedId = 'SuperSecretId'
        const mimeType = 'image/png'
        const mockedBody = new Readable() as fs.ReadStream
        const expectedOptions = {
          requestBody: {
            name,
            mimeType: mimeType,
            originalFilename: name,
            parents: [bundleId],
          },
          media: {
            mimeType: mimeType,
            body: mockedBody,
          },
          fields: 'id',
        }

        const createReadStreamSpy = jest.spyOn(fs, 'createReadStream')
        createReadStreamSpy.mockReturnValueOnce(mockedBody)

        mockCreateFile.mockResolvedValueOnce({
          data: {
            id: expectedId,
          },
        })

        const returnedId = await googleDriveInstance.uploadFile(bundleId, name, mimeType, filePath)

        expect(returnedId).toEqual(expectedId)
        expect(mockCreateFile).toHaveBeenCalledWith(expectedOptions)
        expect(createReadStreamSpy).toHaveBeenCalledWith(filePath)
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

    describe('listMainFolderPermissions', () => {
      it('should update the file given an id', async () => {
        const permission = { id: 'SomeId', emailAddress: 'test@example.com', role: 'reader' }
        const expectedOptions: Params$Resource$Permissions$List = {
          fileId: staccatoFolderId,
          fields: 'permissions(id, emailAddress, role)',
        }

        mockListPermissions.mockResolvedValueOnce({ data: { permissions: [permission] } })

        const returnedPermissions = await googleDriveInstance.listMainFolderPermissions()

        expect(returnedPermissions).toEqual([permission])
        expect(mockListPermissions).toHaveBeenCalledWith(expectedOptions)
      })
    })

    describe('addPermissionToMainFolder', () => {
      it('should update the file given an id', async () => {
        const permission = { id: 'SomeId', emailAddress: 'test@example.com', role: 'reader' }
        const expectedOptions: Params$Resource$Permissions$Create = {
          fileId: staccatoFolderId,
          fields: 'id, emailAddress, role',
          requestBody: {
            role: 'reader',
            type: 'user',
            emailAddress: permission.emailAddress,
          },
        }

        mockCreatePermissions.mockResolvedValueOnce({ data: permission })

        const returnedPermission = await googleDriveInstance.addPermissionToMainFolder(permission.emailAddress)

        expect(returnedPermission).toEqual(permission)
        expect(mockCreatePermissions).toHaveBeenCalledWith(expectedOptions)
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

  describe('getInstance', () => {
    beforeAll(() => {
      GoogleDrive.destroyInstance()
    })

    it('should throw if initialize has not been called before', () => {
      expect(() => GoogleDrive.getInstance()).toThrowError('Initialize has not been called')
    })
  })
})