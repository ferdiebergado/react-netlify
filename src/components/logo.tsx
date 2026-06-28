import { CommandIcon } from '@phosphor-icons/react';

export default function Logo() {
  return (
    <div className="bg-indigo-600 text-background flex items-center justify-center rounded-lg px-3 py-1">
      <CommandIcon className="size-6" weight="bold" data-icon="inline-start" />
    </div>
  );
}
