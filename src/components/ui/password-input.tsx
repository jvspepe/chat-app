import {
  useState,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  showPassword?: boolean;
  setShowPassword?: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordInput({
  showPassword: controlledShowPassword,
  setShowPassword: setControlledShowPassword,
  className,
  ...props
}: PasswordInputProps) {
  const [uncontrolledShowPassword, setUncontrolledShowPassword] =
    useState(false);

  const isControlled =
    typeof controlledShowPassword === 'boolean' &&
    typeof setControlledShowPassword === 'function';

  const showPassword = isControlled
    ? controlledShowPassword
    : uncontrolledShowPassword;
  const setShowPassword = isControlled
    ? setControlledShowPassword
    : setUncontrolledShowPassword;

  return (
    <div
      aria-disabled={props.disabled}
      aria-invalid={props['aria-invalid']}
      className={cn(
        'border-input flex items-center rounded-md border shadow-xs transition-[color,box-shadow]',
        'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        'has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 has-[input:focus]:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      )}
    >
      <input
        type={showPassword ? 'text' : 'password'}
        data-slot="input"
        className={cn(
          'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        {...props}
      />
      <Button
        onClick={() => setShowPassword(!showPassword)}
        type="button"
        aria-label="Toggle password visibility"
        size="icon"
        variant="ghost"
        className="rounded-l-none"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
