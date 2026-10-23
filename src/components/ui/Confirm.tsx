import type { ReactNode } from "react";

// Marks a fact the owner still has to confirm. Always visible on purpose.
export function Confirm({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <span className="confirm-token" title={note ?? "Owner to confirm before launch"}>
      <span className="confirm-token__tag" aria-label="To confirm:">
        {"{{CONFIRM}}"}
      </span>
      <span>{children}</span>
    </span>
  );
}
