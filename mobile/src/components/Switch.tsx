import { Controller, useFormContext } from 'react-hook-form';
import { FormInputProps } from './FormInputProps.ts';
import { FormControlLabel, Switch as MuiSwitch } from '@mui/material';

export const Switch = ({ name, label }: FormInputProps) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <FormControlLabel
                    control={
                        <MuiSwitch
                            defaultChecked={value}
                            name={name}
                            onChange={onChange}
                            value={value}/>
                    }
                    label={label}
                    sx={{ marginBottom: 3 }}
                />
            )}
        />
    );
};
