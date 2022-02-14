import React from 'react'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

export const DeleteButton = ({ onDeleteClick }: { onDeleteClick: Function }) =>
  <IconButton aria-label='delete'
              onClick={() => onDeleteClick()}
              data-delete-icon>
    <DeleteIcon />
  </IconButton>