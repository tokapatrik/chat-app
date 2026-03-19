import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingSpinnerProps = {
  className?: string;
};

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return <LoaderCircle className={cn('animate-spin', className)} />;
};
