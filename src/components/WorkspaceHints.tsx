import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** One delayed hint system for map controls, filters and status symbols. */
export function WorkspaceHints() {
  const [hint, setHint] = useState<{ text: string; x: number; y: number } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const hide = () => {
      clearTimeout(timer);
      setHint(null);
    };
    const show = (event: Event) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-hint]");
      if (!target) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const box = target.getBoundingClientRect();
        setHint({
          text: target.dataset["hint"] ?? "",
          x: Math.max(144, Math.min(innerWidth - 144, box.left + box.width / 2)),
          y: box.bottom + 10 < innerHeight - 70 ? box.bottom + 10 : box.top - 64,
        });
      }, 400);
    };
    document.addEventListener("pointerover", show);
    document.addEventListener("focusin", show);
    document.addEventListener("pointerout", hide);
    document.addEventListener("focusout", hide);
    document.addEventListener("keydown", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", show);
      document.removeEventListener("focusin", show);
      document.removeEventListener("pointerout", hide);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", hide);
    };
  }, []);
  return hint
    ? createPortal(
        <div role="tooltip" className="workspace-hint" style={{ left: hint.x, top: hint.y }}>
          {hint.text}
        </div>,
        document.body,
      )
    : null;
}
