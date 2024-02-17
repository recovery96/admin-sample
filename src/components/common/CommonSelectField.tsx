import { useController, useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import type { Option } from '@/models/option.model'

interface CommonSelectFieldProps {
  name: string
  label: string
  options: Option[]
  required?: boolean
}

export default function CommonSelectField({
  name,
  label,
  options,
  required,
}: CommonSelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  })

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value)
  }

  const error = errors[name]

  return (
    <FormControl fullWidth variant="filled" error={!!error}>
      <InputLabel shrink>{label + (required ? ' *' : '')}</InputLabel>
      <Select value={value} onChange={handleChange} fullWidth>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{(error?.message as string) || ''}</FormHelperText>
    </FormControl>
  )
}
