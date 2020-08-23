import SettingsService from './SettingsService'
import AuthorizedUser from './AuthorizedUser'
import GoogleDrive from '../infrastructure/GoogleDrive'

describe('SettingsService', () => {
  const user: AuthorizedUser = { email: 'test@example.com' }
  const settingsService = new SettingsService()

  describe('listAuthorizedUsers', () => {
    it('should retrieve the list of users from GoogleDrive', async () => {
      const returnedDrivePermissions = [
        {
          id: 'someid',
          emailAddress: user.email,
          role: 'reader',
        },
      ]
      const expectedUsers = [user]
      const mockListMainFolderPermissions = jest.fn()

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        listMainFolderPermissions: mockListMainFolderPermissions,
      })
      mockListMainFolderPermissions.mockResolvedValueOnce(returnedDrivePermissions)

      const returnedUsers = await settingsService.listAuthorizedUsers()

      expect(mockListMainFolderPermissions).toHaveBeenCalled()
      expect(returnedUsers).toEqual(expectedUsers)
    })
  })

  describe('addAuthorizedUsers', () => {
    it('should call GoogleDrive to add the user to the permissions', async () => {
      const mockAddPermissionToMainFolder = jest.fn()
      const returnedDrivePermissions = {
        id: 'someid',
        emailAddress: user.email,
        role: 'reader',
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        addPermissionToMainFolder: mockAddPermissionToMainFolder,
      })
      mockAddPermissionToMainFolder.mockResolvedValueOnce(returnedDrivePermissions)

      const returnedUser = await settingsService.addAuthorizedUser(user.email)

      expect(mockAddPermissionToMainFolder).toHaveBeenCalledWith(user.email)
      expect(returnedUser).toEqual(user)
    })
  })
})