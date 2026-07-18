import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormField, type FormFieldProps } from './form-field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox';

interface ComboboxFieldProps<
  TFieldValues extends FieldValues,
  TItem,
> extends FormFieldProps<TFieldValues> {
  /** Combobox items */
  items: readonly TItem[];

  /** Text displayed when no items match */
  emptyText?: string;

  placeholder?: string;

  disabled?: boolean;

  getItemValue: (item: TItem) => string;
  getItemLabel: (item: TItem) => string;

  /** Renders a single item */
  renderItem?: (item: TItem) => ReactNode;
}

export function ComboboxField<TFieldValues extends FieldValues, TItem>({
  control,
  name,
  label,
  description,
  className,
  items,
  emptyText = 'No items found.',
  placeholder = 'Select an item...',
  disabled,
  getItemValue,
  getItemLabel,
  renderItem,
}: ComboboxFieldProps<TFieldValues, TItem>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      className={className}
    >
      {({ field, fieldState }) => {
        const selectedItem =
          field.value == null
            ? null
            : (items.find(
                (item) => getItemValue(item) === String(field.value),
              ) ?? null);

        const handleValueChange = (nextItem: TItem | null) => {
          field.onChange(nextItem == null ? null : getItemValue(nextItem));
        };

        return (
          <Combobox
            value={selectedItem}
            onValueChange={handleValueChange}
            items={items}
          >
            <ComboboxInput
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              disabled={disabled}
              name={field.name}
              ref={field.ref}
            />
            <ComboboxContent>
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={getItemValue(item)} value={item}>
                    {renderItem ? renderItem(item) : getItemLabel(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FormField>
  );
}
