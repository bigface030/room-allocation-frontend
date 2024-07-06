import { useCallback, useEffect, useRef, useState } from 'react';

interface CustomInputNumberProps {
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  value?: number;
  disabled?: boolean;
  onChange?: (e: InputEvent) => void;
  onBlur?: (e: FocusEvent) => void;
}

const inputEventFor = (input: HTMLInputElement): InputEvent => {
  const inputEvent = new InputEvent('input');
  input.dispatchEvent(inputEvent);
  return inputEvent;
};

const blurEventFor = (input: HTMLInputElement): FocusEvent => {
  const blurEvent = new FocusEvent('blur');
  input.dispatchEvent(blurEvent);
  return blurEvent;
};

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

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({
  min = 0,
  max = 10,
  step = 1,
  name = 'custom_input_number',
  value: initialValue,
  disabled: isInputEventDisabled = false,
  onChange,
  onBlur,
}) => {
  const [value, setValue] = useState<number>(initialValue || min);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIncrement = useCallback(() => {
    if (value >= max) return;
    if (value < min) {
      setValue(min);
    } else {
      setValue((prevValue) => prevValue + step);
    }
  }, [value, min, max, step, setValue]);

  const handleDecrement = useCallback(() => {
    if (value <= min) return;
    if (value > max) {
      setValue(max);
    } else {
      setValue((prevValue) => prevValue - step);
    }
  }, [value, min, max, step, setValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const userInput = parseInt(e.target.value);
      if (isNaN(userInput)) return;
      setValue(userInput);
    },
    [setValue],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget) || !inputRef?.current) return;
      onBlur?.(blurEventFor(inputRef.current));
    },
    [onBlur],
  );

  const {
    handleSingleClick: handleSingleDecrement,
    handleMultipleClickStart: handleMultipleDecrementStart,
    handleMultipleClickEnd: handleMultipleDecrementEnd,
  } = useMultipleClick(handleDecrement);

  const {
    handleSingleClick: handleSingleIncrement,
    handleMultipleClickStart: handleMultipleIncrementStart,
    handleMultipleClickEnd: handleMultipleIncrementEnd,
  } = useMultipleClick(handleIncrement);

  useEffect(() => {
    if (inputRef?.current?.value !== value.toString()) return;
    onChange?.(inputEventFor(inputRef.current));
  }, [value, onChange]);

  const isMinorButtonDisabled = value <= min || isInputEventDisabled;
  const isPlusButtonDisabled = value >= max || isInputEventDisabled;

  return (
    <div className="flex gap-2" onBlur={handleBlur}>
      <button
        type="button"
        onClick={handleSingleDecrement}
        onMouseDown={handleMultipleDecrementStart}
        onMouseUp={handleMultipleDecrementEnd}
        onMouseLeave={handleMultipleDecrementEnd}
        disabled={isMinorButtonDisabled}
        className={`relative w-12 h-12 bg-transparent border-2 border-blue-500 rounded ${isMinorButtonDisabled ? 'opacity-50' : ''}`}
      >
        <div className="absolute inset-y-0 my-auto h-0.5 w-5 bg-blue-500 left-3"></div>
      </button>
      <input
        type="number"
        name={name}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={handleChange}
        disabled={isInputEventDisabled}
        ref={inputRef}
        className={`w-12 h-12 text-black text-base text-center border-2 border-gray-400 rounded focus:outline-none bg-transparent ${isInputEventDisabled ? 'opacity-50' : ''}`}
      ></input>
      <button
        type="button"
        onClick={handleSingleIncrement}
        onMouseDown={handleMultipleIncrementStart}
        onMouseUp={handleMultipleIncrementEnd}
        onMouseLeave={handleMultipleIncrementEnd}
        disabled={isPlusButtonDisabled}
        className={`relative w-12 h-12 bg-transparent border-2 border-blue-500 rounded ${isPlusButtonDisabled ? 'opacity-50' : ''}`}
      >
        <div className="absolute inset-x-0 mx-auto w-0.5 h-5 bg-blue-500 top-3"></div>
        <div className="absolute inset-y-0 my-auto h-0.5 w-5 bg-blue-500 left-3"></div>
      </button>
    </div>
  );
};

export default CustomInputNumber;
