import { GaxiosResponse } from 'gaxios'
import { drive_v3, google } from 'googleapis'

export default class GoogleDrive {
  drive: drive_v3.Drive
  private static instance: GoogleDrive
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
    return GoogleDrive.instance
  }

  static destroyInstance() {
    delete GoogleDrive.instance
  }

  static initialize(keyFile: string) {
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

  async initializeStaccatoFolder() {
    this.mainFolderId = await this.findFolder(GoogleDrive.mainFolderName)
      .catch(() => {
        // tslint:disable-next-line:no-console
        console.info('Initializing Staccato folder on Google Drive')
        return this.createFolder(GoogleDrive.mainFolderName)
      })
    // tslint:disable-next-line:no-console
    console.debug(`Staccato folder ID: ${this.mainFolderId}`)
  }
}