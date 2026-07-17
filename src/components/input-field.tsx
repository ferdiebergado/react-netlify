import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { FormFieldProps } from './form-field';
import { FormField } from './form-field';
import { Input } from './ui/input';

export function InputField<TFieldValues extends FieldValues>(
  props: FormFieldProps<TFieldValues> &
    Omit<ComponentProps<'input'>, 'className'>,
) {
  const { name, label, control, ...inputProps } = props;

  return (
    <FormField name={name} label={label} control={control}>
      {({ field }) => <Input {...field} {...inputProps} />}
    </FormField>
  );
}
