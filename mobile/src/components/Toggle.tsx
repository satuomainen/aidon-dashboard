import { Controller, useFormContext } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';
import { FormInputProps } from './FormInputProps.ts';

export const Toggle = ({ name, label }: FormInputProps) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <FormControlLabel
                    label={label}
                    control={<Switch checked={value} onChange={onChange}/>}
                />
            )}
        />
    );
};
