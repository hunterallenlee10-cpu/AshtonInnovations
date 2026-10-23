"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ProjectType } from "@/data/business";
import { ConsultModal } from "./ConsultModal";

type ConsultContextValue = {
  open: (preselect?: ProjectType) => void;
  close: () => void;
};

const ConsultContext = createContext<ConsultContextValue | null>(null);

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used inside ConsultProvider");
  return ctx;
}

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; preselect?: ProjectType; key: number }>({
    open: false,
    key: 0,
  });
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((preselect?: ProjectType) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setState((s) => ({ open: true, preselect, key: s.key + 1 }));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    // Give focus back to whatever opened the modal.
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ConsultContext.Provider value={value}>
      {children}
      <ConsultModal
        open={state.open}
        preselect={state.preselect}
        formKey={state.key}
        onClose={close}
      />
    </ConsultContext.Provider>
  );
}
