import { GaxiosResponse } from 'gaxios'
import { drive_v3 as driveV3, google } from 'googleapis'

export default class GoogleDrive {
  drive: driveV3.Drive
  private static instance?: GoogleDrive | undefined
  private static mainFolderName = 'Staccato'
  private mainFolderId: string | undefined

  private constructor(keyFile: string) {
    const oAuth2Client = new google.auth.GoogleAuth({
      keyFile,
      scopes: 'https://www.googleapis.com/auth/drive',
    })
    this.drive = google.drive({
      version: 'v3',
      auth: oAuth2Client,
    })
  }

  static getInstance(): GoogleDrive {
    if (!GoogleDrive.instance) {
      throw new Error('Initialize has not been called')
    }

    return GoogleDrive.instance
  }

  static destroyInstance(): void {
    delete GoogleDrive.instance
  }

  static initialize(keyFile: string): Promise<void> {
    if (!GoogleDrive.instance) {
      GoogleDrive.instance = new GoogleDrive(keyFile)
    }

    return GoogleDrive.instance.initializeStaccatoFolder()
  }

  createFolder(name: string): Promise<string> {
    return this.drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: this.mainFolderId ? [this.mainFolderId] : [],
      },
      media: {
        mimeType: 'application/vnd.google-apps.folder',
      },
    }).then((response: GaxiosResponse) => response.data.id)
  }

  findFolder(name: string): Promise<string> {
    return this.drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${name}'`,
      fields: 'files(id, name)',
    }).then((response: GaxiosResponse) => response.data.files[0].id)
  }

  renameFile(fileId: string, newName: string): Promise<void> {
    return this.drive.files.update({
      fileId,
      fields: 'id, name',
      requestBody: {
        name: newName,
      },
    }).then((response: GaxiosResponse) => response.data.id)
  }

  async initializeStaccatoFolder(): Promise<void> {
    this.mainFolderId = await this.findFolder(GoogleDrive.mainFolderName)
      .catch(() => {
        // eslint-disable-next-line no-console
        console.info('Initializing Staccato folder on Google Drive')
        return this.createFolder(GoogleDrive.mainFolderName)
      })
    // eslint-disable-next-line no-console
    console.debug(`Staccato folder ID: ${this.mainFolderId}`)
  }
}