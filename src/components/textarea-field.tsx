import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';
import type { FormFieldProps } from './form-field';
import { FormField } from './form-field';
import { Textarea } from './ui/textarea';

export function TextareaField<TFieldValues extends FieldValues>(
  props: FormFieldProps<TFieldValues> &
    Omit<ComponentProps<'textarea'>, 'className'>,
) {
  const { name, label, control, ...textAreaProps } = props;

  return (
    <FormField name={name} label={label} control={control}>
      {({ field }) => <Textarea {...field} {...textAreaProps} />}
    </FormField>
  );
}
