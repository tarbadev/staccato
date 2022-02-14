import path from 'path'
import { google } from 'googleapis'
import { GaxiosPromise, GaxiosResponse } from 'gaxios'

const keyFile = path.join(__dirname, '../../config/drive-credentials.json')

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    keyFile,
    scopes: 'https://www.googleapis.com/auth/drive',
  }),
})

let mainFolderId: string

const findFolder = (name: string): Promise<string> => {
  return drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${name}'`,
    fields: 'files(id, name)',
  }).then((response: GaxiosResponse) => response.data.files[0].id)
}

const getMainFolderId = async (): Promise<string> => {
  if (mainFolderId) {
    return mainFolderId
  } else {
    return await findFolder('Staccato')
  }
}

export default {
  async 'googleDrive:createFolder'(name: string): Promise<string> {
    const folderId = await getMainFolderId()
    return drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [folderId],
      },
      media: {
        mimeType: 'application/vnd.google-apps.folder',
      },
    })
      .then(response => response.data)
      .then(file => file.id as string)
  },

  async 'googleDrive:deleteFolderById'(folderId: string): GaxiosPromise<void> {
    return drive.files.delete({ fileId: folderId })
  },

  async 'googleDrive:deleteFolder'(name: string): GaxiosPromise<void> {
    const folderId = await findFolder(name)
    return drive.files.delete({ fileId: folderId })
  },

  async 'googleDrive:deletePermission'({
                                         email,
                                         failOnError = false,
                                       }: { email: string; failOnError?: boolean }): Promise<null> {
    const folderId = await getMainFolderId()
    const permissions = await drive.permissions.list({ fileId: folderId, fields: 'permissions(id, emailAddress)' })
      .then(response => response.data.permissions)
    // @ts-ignore
    const permissionIndex = permissions.findIndex(permission => permission.emailAddress === email)
    if (permissionIndex >= 0) {
      // @ts-ignore
      const permissionId = permissions[permissionIndex].id

      await drive.permissions.delete({ fileId: folderId!!, permissionId: permissionId!! })
    } else {
      if (failOnError) {
        throw new Error(`Permission not found for user ${email}`)
      }
    }

    return null
  },

  async 'googleDrive:getFilesInFolder'(folderId: string): Promise<string[] | null> {
    const children = await drive.files.list({ pageSize: 100, q: `'${folderId}' in parents` })

    const fileIds = children.data.files && children.data.files
      .map(file => file.id ? file.id : null)
      .filter((fileId): fileId is string => fileId != null)

    return fileIds || null
  },
}