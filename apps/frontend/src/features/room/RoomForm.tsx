import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea
} from '@/components/ui/input-group';

export const roomSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(20, 'Name must be at most 20 characters long'),
  description: z
    .string()
    .min(1, 'Description must be at least 1 characters long')
    .max(60, 'Description must be at most 60 characters long')
});

export type RoomInput = z.infer<typeof roomSchema>;

const DEFAULT_VALUES: RoomInput = {
  name: '',
  description: ''
};

type RoomFormProps = {
  defaultValues?: Partial<RoomInput>;
  onSubmit: (data: RoomInput) => unknown | Promise<unknown>;
  children: ReactNode;
};

export function RoomForm({ defaultValues, onSubmit, children }: RoomFormProps) {
  const form = useForm<RoomInput>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues
    }
  });

  const handleSubmit = (data: RoomInput) =>
    onSubmit({
      name: data.name.trim(),
      description: data.description.trim()
    });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="room-form-name">Room name:</FieldLabel>
              <Input
                {...field}
                id="room-form-name"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. Login issues on mobile"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="room-form-description">Description:</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="room-form-description"
                  placeholder="I'm having an issue with the login button on mobile."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/60 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      {children}
    </form>
  );
}
