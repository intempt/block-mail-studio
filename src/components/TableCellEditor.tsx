
import React, { useState, useRef, useEffect } from 'react';

interface TableCellEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur: () => void;
  autoFocus?: boolean;
}

export const TableCellEditor: React.FC<TableCellEditorProps> = ({
  content,
  onChange,
  onBlur,
  autoFocus
}) => {
  const [value, setValue] = useState(content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      className="w-full px-2 py-1 border-none outline-none bg-transparent"
    />
  );
};
