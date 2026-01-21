"use client";

import React, { createContext, useContext } from 'react';

// FilterContext is kept for potential future filter additions
// All filters have been removed as per requirements

type FilterContextValue = Record<string, never>;

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: FilterContextValue = {};

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return ctx;
}
