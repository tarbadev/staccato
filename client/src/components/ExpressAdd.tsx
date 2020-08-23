import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import React, { FormEvent, useState } from 'react'

type ExpressAddProps = {
  onSubmitCallback: (newElement: string, onExpressAddSuccess: () => void) => void,
}
export const ExpressAdd = ({ onSubmitCallback }: ExpressAddProps) => {
  const [displayAddBundleForm, setDisplayAddBundleForm] = useState(false)
  const [newElementName, setNewElementName] = useState('')

  return <ExpressAddDisplay
    onAddClick={() => setDisplayAddBundleForm(true)}
    isEditMode={displayAddBundleForm}
    newElementName={newElementName}
    onNewElementNameChange={(newName => setNewElementName(newName))}
    onSubmitCallback={() => onSubmitCallback(newElementName, () => setDisplayAddBundleForm(false))}
  />
}

type ExpressAddDisplayProps = {
  onAddClick: () => void,
  isEditMode: boolean,
  newElementName: string,
  onNewElementNameChange: (newName: string) => void,
  onSubmitCallback: () => void,
}

const ExpressAddDisplay = ({ onAddClick, isEditMode, newElementName, onNewElementNameChange, onSubmitCallback }: ExpressAddDisplayProps) => {
  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmitCallback()
  }

  return <>
    <Tooltip title='Add' aria-label='add'>
      <Fab color='primary' onClick={onAddClick} data-add-express>
        <AddIcon />
      </Fab>
    </Tooltip>
    {isEditMode &&
    <form onSubmit={onFormSubmit}>
      <TextField
          label='Name'
          value={newElementName}
          onChange={({ target }) => onNewElementNameChange(target.value)}
          data-new-express-name />
      <Button variant='contained' color='primary' onClick={onSubmitCallback} data-submit-express>
        Submit
      </Button>
    </form>
    }
  </>
}