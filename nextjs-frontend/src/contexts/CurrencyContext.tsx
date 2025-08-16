'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, CURRENCIES, getCurrencyInfo } from '../app/getSponsorshipData';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  currencies: typeof CURRENCIES;
  getCurrencySymbol: (currency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');

  // Load saved currency preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
      if (savedCurrency && CURRENCIES.some(c => c.code === savedCurrency)) {
        setSelectedCurrency(savedCurrency);
      }
    }
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', selectedCurrency);
    }
  }, [selectedCurrency]);

  const getCurrencySymbol = (currency?: Currency): string => {
    const currencyCode = currency || selectedCurrency;
    return getCurrencyInfo(currencyCode).symbol;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    currencies: CURRENCIES,
    getCurrencySymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
