import React from 'react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export const DeleteButton = ({ onDeleteClick }: { onDeleteClick: Function }) =>
  <IconButton aria-label='delete'
              onClick={() => onDeleteClick()}
              data-delete-icon>
    <DeleteIcon />
  </IconButton>