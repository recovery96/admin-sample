import { TextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'

interface CommonTextFieldProps {
  name: string
  label: string
  required?: boolean
}

export default function CommonTextField({
  name,
  label,
  required,
}: CommonTextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]

  return (
    <TextField
      label={label + (required ? ' *' : '')}
      {...register(name)}
      fullWidth
      InputLabelProps={{ shrink: true }}
      error={!!error}
      helperText={(error?.message as string) || ''}
    />
  )
}
