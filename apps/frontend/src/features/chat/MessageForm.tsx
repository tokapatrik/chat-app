import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontal } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export const messageSchema = z.object({
  text: z.string().max(500, 'Text must be at most 500 characters long')
});

type MessageInput = z.infer<typeof messageSchema>;

const DEFAULT_VALUES: MessageInput = {
  text: ''
};

type MessageCreateProps = {
  onSubmit: (messageInput: MessageInput) => unknown | Promise<unknown>;
};

export function MessageCreate({ onSubmit }: MessageCreateProps) {
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: DEFAULT_VALUES
  });

  const handleSubmit = async (data: MessageInput) => {
    await onSubmit({ text: data.text.trim() });
    form.reset();
  };

  return (
    <form className="flex gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Type your message..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">
        Send
        <SendHorizontal />
      </Button>
    </form>
  );
}
