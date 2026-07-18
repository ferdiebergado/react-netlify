import type { ReactNode } from 'react';
import {
  useController,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';

export interface FormFieldProps<
  TFieldValues extends FieldValues,
> extends UseControllerProps<TFieldValues> {
  /** Label for the form field */
  label: string;

  /** React hook form control object */
  control: Control<TFieldValues>;

  /** Description for the form field */
  description?: string;

  /** Styles for the form field */
  className?: string;
}

interface FormFieldPropsWithChildren<
  TFieldValues extends FieldValues,
> extends FormFieldProps<TFieldValues> {
  /** Children elements to render inside the form control */
  children: (props: {
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
}

/**
 * Wrapper around shadcn Field component with react-hook-form integration.
 * Automatically handles field state, validation, and error display.
 * It passes the field and fieldstate to the child component.
 * @example
    <FormField
      name="username"
      label="Username"
      control={control}
      className="w-full max-w-sm"
      description="Your unique username"
    >
      {({ field }) => <Input {...field} {...inputProps} />}
    </FormField>
 */
export function FormField<TFieldValues extends FieldValues>(
  props: FormFieldPropsWithChildren<TFieldValues>,
) {
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
