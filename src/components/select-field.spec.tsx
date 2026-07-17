import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ReactNode } from 'react';
import { useForm, type Control } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import * as z from 'zod';
import SelectField from './select-field';

const mockSchema = z.object({
  status: z.string().min(1, { message: 'Please select a status' }),
});

function TestFormWrapper({
  onChange,
  children,
}: {
  onChange?: (value: string) => void;
  children: (control: Control<z.infer<typeof mockSchema>>) => ReactNode;
}) {
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(mockSchema),
    defaultValues: {
      status: '',
    },
  });

  const watchedValue = watch('status');

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
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
];

describe('SelectField', () => {
  afterEach(async () => await cleanup());

  it('renders the label and placeholder', async () => {
    const label = 'Status';
    const placeholder = 'Select a status';

    const { getByRole } = await render(
      <TestFormWrapper>
        {(control) => (
          <SelectField
            name="status"
            label={label}
            control={control}
            items={items}
            itemToLabel={(item) => item.label}
            itemToValue={(item) => item.value}
            placeholder={placeholder}
          />
        )}
      </TestFormWrapper>,
    );

    const selectField = getByRole('combobox', { name: label });
    await expect.element(selectField).toBeInTheDocument();
    await expect.element(selectField).toHaveTextContent(placeholder);
  });

  it('displays the loading state when isLoading is true', async () => {
    const label = 'Status';
    const { getByRole } = await render(
      <TestFormWrapper>
        {(control) => (
          <SelectField
            name="status"
            label={label}
            control={control}
            items={[]}
            itemToLabel={(item: { label: string; value: string }) => item.label}
            itemToValue={(item: { label: string; value: string }) => item.value}
            isLoading
          />
        )}
      </TestFormWrapper>,
    );

    const selectField = getByRole('combobox', { name: label });
    await expect.element(selectField).toHaveTextContent('Loading...');
    await expect.element(selectField).toBeDisabled();
  });

  it('displays all items in the dropdown when opened', async () => {
    const label = 'Status';
    const { getByRole } = await render(
      <TestFormWrapper>
        {(control) => (
          <SelectField
            name="status"
            label={label}
            control={control}
            items={items}
            itemToLabel={(item) => item.label}
            itemToValue={(item) => item.value}
          />
        )}
      </TestFormWrapper>,
    );

    await getByRole('combobox', { name: label }).click();

    await expect
      .element(getByRole('option', { name: items[0].label }))
      .toBeInTheDocument();
    await expect
      .element(getByRole('option', { name: items[1].label }))
      .toBeInTheDocument();
  });

  it('displays the selected value label in the trigger', async () => {
    const label = 'Status';
    const { getByRole } = await render(
      <TestFormWrapper>
        {(control) => (
          <SelectField
            name="status"
            label={label}
            control={control}
            items={items}
            itemToLabel={(item) => item.label}
            itemToValue={(item) => item.value}
          />
        )}
      </TestFormWrapper>,
    );

    const selectField = getByRole('combobox', { name: label });
    await selectField.click();
    await getByRole('option', { name: items[1].label }).click();
    await expect.element(selectField).toHaveTextContent(items[1].label);
  });

  it('calls field.onChange when an item is selected', async () => {
    const label = 'Status';
    const onChange = vi.fn();

    const { getByRole } = await render(
      <TestFormWrapper onChange={onChange}>
        {(control) => (
          <SelectField
            name="status"
            label={label}
            control={control}
            items={items}
            itemToLabel={(item) => item.label}
            itemToValue={(item) => item.value}
          />
        )}
      </TestFormWrapper>,
    );

    await getByRole('combobox', { name: label }).click();
    await getByRole('option', { name: items[1].label }).click();

    expect(onChange).toHaveBeenCalledWith('beta');
  });

  it('displays the error message when fieldState.invalid is true', async () => {
    const { getByRole, getByText } = await render(
      <TestFormWrapper>
        {(control) => (
          <SelectField
            label="Status"
            name="status"
            control={control}
            items={[]}
            itemToLabel={(item: { label: string; value: string }) => item.label}
            itemToValue={(item: { label: string; value: string }) => item.value}
          />
        )}
      </TestFormWrapper>,
    );

    await getByRole('button', { name: 'Submit' }).click();

    await expect
      .element(getByText(/Please select a status/))
      .toBeInTheDocument();
  });
});
