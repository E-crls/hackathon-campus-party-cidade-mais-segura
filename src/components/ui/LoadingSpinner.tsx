import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}

export function LoadingSpinner({ className, message }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
} 