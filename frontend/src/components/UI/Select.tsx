import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  color?: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  error,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Calculate portal dropdown position from the button's bounding rect
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) updateDropdownPosition();
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside both trigger and portal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = containerRef.current?.contains(target) ?? false;
      const insidePortal = portalRef.current?.contains(target) ?? false;
      if (!insideTrigger && !insidePortal) {
        setIsOpen(false);
      }
    };

    // Close on scroll so dropdown doesn't float away
    const handleScroll = () => setIsOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  // Portal dropdown rendered in document.body so it escapes any stacking context / overflow:hidden
  const dropdownPortal = isOpen
    ? createPortal(
        <div
          ref={portalRef}
          style={dropdownStyle}
          className="bg-white border border-gray-100 rounded-2xl shadow-2xl py-1.5 animate-scaleIn max-h-60 overflow-y-auto"
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400 text-center">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  // onMouseDown prevents the button blur from firing before the click registers
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt.value);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-indigo-50/60 transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-indigo-600 bg-indigo-50/30 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {opt.color && (
                      <span
                        className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                    )}
                    {opt.label}
                  </span>
                  {isSelected && <Check size={14} className="text-indigo-600 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div
      className={`flex flex-col w-full relative ${className}`}
      ref={containerRef}
      id={id}
    >
      {label && (
        <span className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </span>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between text-sm rounded-xl border outline-none bg-gray-50/50 hover:bg-white text-gray-900 transition-all px-4 py-2.5 text-left cursor-pointer ${
          isOpen
            ? 'border-indigo-500 bg-white ring-1 ring-indigo-500/30'
            : 'border-gray-200 hover:border-gray-300'
        } ${
          error ? 'border-red-300 bg-red-50/20' : ''
        }`}
      >
        <span className="flex items-center gap-2.5">
          {selectedOption?.color && (
            <span
              className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className={selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {dropdownPortal}

      {error && (
        <p className="text-xs text-red-600 mt-1.5 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};
