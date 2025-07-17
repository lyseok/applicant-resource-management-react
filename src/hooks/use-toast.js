import { toast } from 'sonner'; // 또는 사용하는 토스트 라이브러리에 맞게 수정

export function useToast() {
  return (message, options = {}) => {
    toast(message, options);
  };
}
