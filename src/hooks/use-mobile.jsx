import { useEffect, useState } from 'react';

export function useMobile(threshold = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= threshold);
    };

    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [threshold]);

  return isMobile;
}
