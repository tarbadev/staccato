import AuthorizedUser from './AuthorizedUser'
import GoogleDrive from '../infrastructure/GoogleDrive'

export default class SettingsService {
  async listAuthorizedUsers(): Promise<AuthorizedUser[]> {
    const permissions = await GoogleDrive.getInstance().listMainFolderPermissions()
    return permissions.map(permission => ({ email: permission.emailAddress }))
  }

  async addAuthorizedUser(email: string): Promise<AuthorizedUser> {
    const permission = await GoogleDrive.getInstance().addPermissionToMainFolder(email)
    return { email: permission.emailAddress }
  }
}