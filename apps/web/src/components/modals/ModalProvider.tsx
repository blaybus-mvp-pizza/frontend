'use client';

import React from 'react';
import { useUIStore } from '@/store/ui.store';
import { AnimatePresence } from 'framer-motion';
import ModalManager from './ModalManager';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const modals = useUIStore((state) => state.modals);

  return (
    <>
      {children}
      <AnimatePresence mode="wait">
        {modals.map((modal) => (
          <ModalManager key={modal.id} modal={modal} />
        ))}
      </AnimatePresence>
    </>
  );
};