import React from 'react'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'
import Login from '../login'

function setup() {
  const handleSubmit = jest.fn()
  const utils = render(<Login onSubmit={handleSubmit} />)
  const userObj = {username: 'michelle', password: 'smith'}
  const changeUsernameInput = value =>
    user.type(utils.getByLabelText(/username/i), value)
  const changePasswordInput = value =>
    user.type(utils.getByLabelText(/password/i), value)
  const clickSubmit = () => user.click(utils.getByText(/submit/i))
  return {
    ...utils,
    ...userObj,
    handleSubmit,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  }
}

test('Login calls onSubmit with the username and password', () => {
  const {
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
    handleSubmit,
    username,
    password,
  } = setup()
  changeUsernameInput(username)
  changePasswordInput(password)
  clickSubmit()
  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({username, password})
})

test('Login shows an error message when submit is clicked and no username is provided', () => {
  const {
    handleSubmit,
    changePasswordInput,
    clickSubmit,
    getByRole,
    password,
  } = setup()
  changePasswordInput(password)
  clickSubmit()
  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/username is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})

test('Login shows an error message when password is not provided', () => {
  const {
    changeUsernameInput,
    clickSubmit,
    getByRole,
    handleSubmit,
    username,
  } = setup()
  changeUsernameInput(username)
  clickSubmit()
  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/password is required/i)
  expect(handleSubmit).not.toHaveBeenCalled()
})
