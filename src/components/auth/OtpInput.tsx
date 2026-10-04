import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  hasError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  hasError = false
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, '').slice(-1);

    const chars = value.split('');
    chars[idx] = digit;
    const nextVal = chars.join('').slice(0, length);
    onChange(nextVal);

    if (digit && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        margin: '20px 0'
      }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, idx) => {
        const char = value[idx] || '';
        return (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={{
              width: '46px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: hasError
                ? '2px solid var(--accent-rose)'
                : char
                ? '2px solid var(--accent-gold)'
                : '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '22px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              textAlign: 'center',
              outline: 'none',
              boxShadow: char ? '0 0 12px var(--accent-gold-glow)' : '0 2px 6px rgba(60,45,30,0.04)',
              transition: 'all 0.15s ease'
            }}
          />
        );
      })}
    </div>
  );
};
