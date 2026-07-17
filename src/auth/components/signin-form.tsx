import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import { useState, type ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export function SigninForm({ className, ...props }: ComponentProps<'div'>) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    window.location.assign('/api/signin');
  };

  return (
    <div
      className={cn('flex flex-col gap-6 w-full max-w-86', className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Continue with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button
                  type="button"
                  onClick={handleClick}
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <>
                      <Spinner data-icon="inline-start" /> Redirecting to
                      Google...
                    </>
                  ) : (
                    <>
                      <GoogleLogoIcon
                        className="size-6"
                        weight="bold"
                        data-icon="inline-start"
                      />{' '}
                      Continue with Google
                    </>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
