import { ComboboxField } from '@/components/combobox-field';
import { InputField } from '@/components/input-field';
import { SelectField } from '@/components/select-field';
import { TextareaField } from '@/components/textarea-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSearchParams } from 'wouter';
import * as z from 'zod';

export function Dashboard() {
  const [searchParams] = useSearchParams();

  const items = [
    { label: 'Yaye', value: 'yaye' },
    { label: 'Aremondeng', value: 'aremondeng' },
  ];

  const schema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    status: z.string().min(1, 'Status is required'),
    venue: z.string(),
    date: z.iso.date(),
    comments: z.string(),
    item: z.enum(['yaye', 'aremondeng']).nullish(),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      venue: '',
      status: '',
      date: '',
      comments: '',
      item: null,
    },
  });
  useEffect(() => {
    const msg = searchParams.get('success');
    if (msg) toast.success(msg);
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>This is the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p>Welcome to your dashboard!</p>
        <form
          className="space-y-5"
          onSubmit={handleSubmit((values) => console.log('values:', values))}
        >
          <SelectField
            name="status"
            label="Status"
            control={control}
            items={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
            ]}
            itemToLabel={(item) => item.label}
            itemToValue={(item) => item.value}
            className="w-full max-w-xs"
          />

          <InputField
            control={control}
            name="firstName"
            label="First Name"
            className="w-full max-w-xs"
          />
          <InputField
            type="date"
            control={control}
            name="date"
            label="Date"
            className="w-full max-w-xs"
          />
          <TextareaField
            control={control}
            name="comments"
            label="Comments"
            className="w-full max-w-xs"
          />

          <ComboboxField
            control={control}
            items={items}
            name="item"
            label="Item"
            description="Items"
            getItemValue={(item) => item.value}
            getItemLabel={(item) => item.label}
            className="w-full max-w-xs"
            renderItem={(item) => (
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.label}
                  </ItemTitle>
                  <ItemDescription>{item.label}</ItemDescription>
                </ItemContent>
              </Item>
            )}
          />

          <FieldGroup>
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button type="button" onClick={() => reset()}>
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
