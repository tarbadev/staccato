import React from 'react'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { SettingsPage } from './SettingsPage'
import * as Utils from './Utils'
import { request } from './Utils'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}))

const requestSpy = jest.spyOn(Utils, 'request')

describe('SettingsPage', () => {
  const verifyUserIsInDoc = async (email: string) => {
    await waitFor(() => {
      const text = screen.getByText(email)
      expect(text).toBeInTheDocument()
    })
  }

  async function addAuthorizedUser(email: string) {
    fireEvent.click(screen.getByRole('button', { name: 'add' }))

    await waitFor(() => {
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeInTheDocument()

      fireEvent.change(input, { target: { value: email } })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitForElementToBeRemoved(() => screen.getByRole('textbox'))
  }

  beforeEach(() => {
    requestSpy.mockReset()
    requestSpy.mockClear()
  })

  it('Displays the list of authorized users', async () => {
    const user1 = 'test1@example.com'
    const user2 = 'test2@example.com'
    const user3 = 'test3@example.com'
    const response = [
      { email: user1 },
      { email: user2 },
      { email: user3 },
    ]

    requestSpy.mockResolvedValue(response)

    render(<SettingsPage />)

    expect(request).toHaveBeenCalledWith({ url: '/api/settings/authorizedUsers' })

    await verifyUserIsInDoc(user1)
    await verifyUserIsInDoc(user3)
    await verifyUserIsInDoc(user3)
  })

  it('should post the new authorized user', async () => {
    const userEmail = 'test@example.com'

    requestSpy.mockResolvedValue([])

    render(<SettingsPage />)

    await addAuthorizedUser(userEmail)

    await waitFor(() => {
      expect(request)
        .toHaveBeenCalledWith({ url: '/api/settings/authorizedUsers', method: 'POST', body: { email: userEmail } })
    })
  })

  it('should load the bundles once the new bundle is added', async () => {
    const userEmail = 'test@example.com'

    requestSpy.mockResolvedValue([])

    render(<SettingsPage />)

    await addAuthorizedUser(userEmail)

    await waitFor(() => {
      expect(request).toHaveBeenLastCalledWith({ url: '/api/settings/authorizedUsers' })
    })
  })
})