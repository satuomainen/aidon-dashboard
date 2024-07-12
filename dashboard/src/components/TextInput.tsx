import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { FormInputProps } from './FormInputProps.ts';

export interface TextInputProps extends FormInputProps {
    required?: boolean;
}

export const TextInput = ({ name, label, required = false }: TextInputProps) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field: { onChange, value },
                         fieldState: { error },
                     }) => (
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                    required={required}
                />
            )}
        />
    );
};
