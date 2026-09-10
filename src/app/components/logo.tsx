import { CommandIcon } from '@phosphor-icons/react';

export function Logo() {
  return (
    <div className="text-background flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1">
      <CommandIcon className="size-6" weight="bold" data-icon="inline-start" />
    </div>
  );
}
