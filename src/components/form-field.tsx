import type { ReactNode } from 'react';
import {
  useController,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseControllerProps,
} from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> extends UseControllerProps<TFieldValues> {
  /** Label for the form field */
  label: string;

  /** Description for the form field */
  description?: string;

  /** Styles for the form field */
  className?: string;

  /** Children elements to render inside the form control */
  children: (props: {
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
}

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
>(props: FormFieldProps<TFieldValues>) {
  const { field, fieldState } = useController(props);
  const { className, label, description, children } = props;
  return (
    <Field className={className} data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children({ field, fieldState })}
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
