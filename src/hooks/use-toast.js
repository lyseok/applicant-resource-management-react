import { toast } from 'sonner';

export function useToast() {
  return (message, options = {}) => {
    toast(message, options);
  };
}
