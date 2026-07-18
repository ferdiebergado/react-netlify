import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { FormFieldProps } from './form-field';
import { FormField } from './form-field';
import { Input } from './ui/input';

/**
 * Wrapper around shadcn Input component with react-hook-form integration.
 * Automatically handles field state, validation, and error display.
 * @example
  <InputField
   name="email"
   label="Email"
   control={control}
   type="email"
   description="We'll never share your email"
  />
 */
export function InputField<TFieldValues extends FieldValues>(
  props: FormFieldProps<TFieldValues> &
    Omit<ComponentProps<'input'>, 'className' | 'name'>,
) {
  const { name, label, control, className, description, ...inputProps } = props;

  return (
    <FormField
      name={name}
      label={label}
      control={control}
      className={className}
      description={description}
    >
      {({ field }) => <Input {...field} {...inputProps} />}
    </FormField>
  );
}
