import connection from '@shared/DbHelperE2e'
import SettingsPageHelper from './page-object/SettingsPageHelper'
import { deletePermission } from './GoogleDriveHelper'

describe('Settings', () => {
  let settingsPageHelper: SettingsPageHelper

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    settingsPageHelper = new SettingsPageHelper()
    return connection.clear()
  })

  it('should display the list authorized users', async () => {
    await settingsPageHelper.goTo()

    const authorizedUsers = await settingsPageHelper.getAuthorizedUsers()

    expect(authorizedUsers).toHaveLength(2)
  })

  it('should add an authorized users', async () => {
    await deletePermission('someuser@example.com')
    await settingsPageHelper.goTo()

    expect(await settingsPageHelper.getAuthorizedUsers()).toHaveLength(2)

    await settingsPageHelper.addAuthorizedUser('someuser@example.com')

    expect(await settingsPageHelper.getAuthorizedUsers()).toHaveLength(3)

    await deletePermission('someuser@example.com', true)
  }, 30000)
})