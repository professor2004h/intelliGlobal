'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { Currency } from '../app/getSponsorshipData';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
}

export default function CurrencySelector({ className = '', showLabel = true }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  const selectedCurrencyInfo = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors duration-200"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center">
            <span className="text-lg mr-2">{selectedCurrencyInfo?.symbol}</span>
            <span className="block truncate font-medium">{selectedCurrencyInfo?.code}</span>
            <span className="ml-2 text-gray-500 text-sm">{selectedCurrencyInfo?.name}</span>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => handleCurrencySelect(currency.code)}
                className={`relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 ${
                  currency.code === selectedCurrency
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{currency.symbol}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="ml-2 text-gray-500 text-sm">{currency.name}</span>
                </div>
                {currency.code === selectedCurrency && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
