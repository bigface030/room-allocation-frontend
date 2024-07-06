import { useCallback, useEffect, useRef, useState } from 'react';

const useMultipleClick = (handleClick: () => void) => {
  const intervalRef = useRef<ReturnType<typeof setTimeout>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [isMultipleClick, setIsMultipleClick] = useState<boolean>(false);
  const [isSingleClick, setIsSingleClick] = useState<boolean>(true);

  const handleMultipleClickStart = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsMultipleClick(true);
    }, 700);
  }, [setIsMultipleClick]);

  const handleMultipleClickEnd = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsMultipleClick(false);
  }, [setIsMultipleClick]);

  const handleSingleClick = useCallback(() => {
    if (!isSingleClick) return;
    handleClick();
  }, [isSingleClick, handleClick]);

  useEffect(() => {
    if (!isMultipleClick) {
      clearTimeout(intervalRef.current);
      setIsSingleClick(true);
      return;
    }
    setIsSingleClick(false);
    intervalRef.current = setTimeout(handleClick, 100);
  }, [handleClick, isMultipleClick, setIsSingleClick]);

  return {
    handleSingleClick,
    handleMultipleClickStart,
    handleMultipleClickEnd,
  };
};

export default useMultipleClick;
