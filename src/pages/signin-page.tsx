import { SlideshowIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'wouter';

import { SigninForm } from '../auth/components/signin-form';

export default function SigninPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const msg = searchParams.get('error');
    if (msg) toast.error(msg);
  }, [searchParams]);

  return (
    <>
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <SlideshowIcon className="size-4" />
        </div>
        Acme Inc.
      </a>
      <SigninForm />
    </>
  );
}
