import { SlideshowIcon } from '@phosphor-icons/react';

import { SigninForm } from '@/auth/components/signin-form';

export default function SigninPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <SlideshowIcon className="size-4" />
        </div>
        Acme Inc.
      </a>
      <SigninForm />
    </div>
  );
}
