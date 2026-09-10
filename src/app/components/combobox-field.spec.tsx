import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ReactNode } from 'react';
import { useForm, type Control } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import * as z from 'zod';
import { ComboboxField } from './combobox-field';

const mockSchema = z.object({
  item: z.enum(['yaye', 'aremondeng']).nullish(),
});

function TestFormWrapper({
  onChange,
  children,
}: {
  onChange?: (value: string | null | undefined) => void;
  children: (control: Control<z.infer<typeof mockSchema>>) => ReactNode;
}) {
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(mockSchema),
    defaultValues: {
      item: null,
    },
  });

  const watchedValue = watch('item');

  useEffect(() => {
    if (onChange) onChange(watchedValue);
  }, [watchedValue, onChange]);

  return (
    <form onSubmit={handleSubmit(vi.fn())}>
      {children(control)}
      <button type="submit">Submit</button>
    </form>
  );
}

const items = [
  { label: 'Yaye', value: 'yaye' },
  { label: 'Aremondeng', value: 'aremondeng' },
] as const;

describe('ComboboxField', () => {
  afterEach(async () => await cleanup());

  it('calls field.onChange with the item value when an item is selected', async () => {
    const label = 'Item';
    const onChange = vi.fn();

    const { getByRole } = await render(
      <TestFormWrapper onChange={onChange}>
        {(control) => (
          <ComboboxField
            control={control}
            items={items}
            name="item"
            label={label}
            getItemValue={(item) => item.value}
            getItemLabel={(item) => item.label}
          />
        )}
      </TestFormWrapper>,
    );

    const input = getByRole('combobox', { name: label });
    await input.click();
    await getByRole('option', { name: items[1].label }).click();

    expect(onChange).toHaveBeenCalledWith('aremondeng');
  });
});
