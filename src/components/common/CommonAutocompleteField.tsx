import { useController, useFormContext } from 'react-hook-form'
import { Autocomplete, TextField } from '@mui/material'

import type { Option } from '@/models/option.model'

interface CommonAutocompleteFieldProps {
  name: string
  label: string
  options: Option[]
  required?: boolean
}

export default function CommonAutocompleteField({
  name,
  label,
  options,
  required,
}: CommonAutocompleteFieldProps) {
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

  const error = errors[name]

  return (
    <Autocomplete
      clearOnBlur
      disableClearable
      options={options}
      value={value.value ? value : null}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label + (required ? ' *' : '')}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={(error?.message as string) || ''}
        />
      )}
    />
  )
}
