import { google } from 'googleapis'
import * as path from 'path'
import { GaxiosPromise, GaxiosResponse } from 'gaxios'

const keyFile = path.join(__dirname, '../../../config/drive-credentials.json')

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

export const listFiles = () => drive.files.list({ fields: 'files(id, name, parents)' })
  .then(response => response.data.files)
export const listPermissions = async () => drive.permissions.list({
  fileId: await getMainFolderId(),
  fields: 'permissions(id, emailAddress)',
}).then(response => response.data.permissions)

export const createFolder = async (name: string): Promise<string> => {
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
}

export const findFileByNameAndParent = (name: string, parent: string): Promise<boolean> => {
  return drive.files.list({
    q: `name = '${name}' and '${parent}' in parents`,
  })
    .then(response => !!(response.data.files && response.data.files.length === 1))
}

export const deleteFolderById = async (folderId: string): GaxiosPromise<void> => {
  return drive.files.delete({ fileId: folderId })
}

export const deleteFolder = async (name: string): GaxiosPromise<void> => {
  const folderId = await findFolder(name)
  return deleteFolderById(folderId)
}

export const deletePermission = async (email: string, failOnError = false): Promise<void> => {
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
}