import type { ReactNode } from 'react';
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';

interface FormFieldProps<TFieldValues extends FieldValues> {
  /** Name of the form field */
  name: Path<TFieldValues>;

  /** Label for the form field */
  label: string;

  /** Description for the form field */
  description?: string;

  /** React Hook Form field object */
  control: Control<TFieldValues>;

  /** Children elements to render inside the form control */
  children: (props: {
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
}

export default function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  control,
  children,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {children({ field, fieldState })}
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
