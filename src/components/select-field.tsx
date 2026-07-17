import { type FieldValues } from 'react-hook-form';
import { FormField, type FormFieldProps } from './form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SelectFieldProps<
  TFieldValues extends FieldValues,
  TItem,
> extends FormFieldProps<TFieldValues> {
  /** Array of items to display in the select */
  items: TItem[];

  /** Function to extract the display label from an item */
  itemToLabel: (item: TItem) => string;

  /** Function to extract the value from an item */
  itemToValue: (item: TItem) => string;

  /** Placeholder text when no item is selected */
  placeholder?: string;

  /** Whether the select is currently loading data */
  isLoading?: boolean;
}

export function SelectField<TFieldValues extends FieldValues, TItem>(
  props: SelectFieldProps<TFieldValues, TItem>,
) {
  const {
    name,
    label,
    description,
    placeholder = 'Select an item...',
    className,
    control,
    items,
    itemToLabel,
    itemToValue,
    isLoading = false,
  } = props;

  return (
    <FormField
      name={name}
      label={label}
      description={description}
      control={control}
      className={className}
    >
      {({ field, fieldState }) => {
        const handleValueChange = (nextValue: string | null) => {
          if (!nextValue) return;

          field.onChange(nextValue);
        };

        return (
          <Select
            name={field.name}
            value={String(field.value ?? '')}
            onValueChange={handleValueChange}
            itemToStringLabel={(item) => {
              const itemValue = String(item);
              const selectedItem = items.find(
                (candidate) => itemToValue(candidate) === itemValue,
              );

              return selectedItem ? itemToLabel(selectedItem) : itemValue;
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={isLoading}
            >
              <SelectValue
                placeholder={isLoading ? 'Loading...' : placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={itemToValue(item)} value={itemToValue(item)}>
                  {itemToLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormField>
  );
}
