// src/index.d.ts
import { ReactNode, ReactElement } from 'react';

export interface MSWProviderProps {
  children: ReactNode;
}

export function MSWProvider(props: MSWProviderProps): ReactElement;
