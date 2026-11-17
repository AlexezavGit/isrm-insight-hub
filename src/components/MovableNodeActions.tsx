import { useEffect, useRef, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

export function MovableNodeActions({ children, uk }: { children: ReactNode; uk: boolean }) {
  const element = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const reset = () => setPosition(null);
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);
  const move = (x: number, y: number) => {
    const el = element.current,
      parent = el?.parentElement;
    if (!el || !parent) return;
    setPosition({
      x: Math.max(4, Math.min(x, parent.clientWidth - el.offsetWidth - 4)),
      y: Math.max(4, Math.min(y, parent.clientHeight - el.offsetHeight - 4)),
    });
  };
  return (
    <aside
      ref={element}
      className="network-node-preview network-node-strip"
      aria-label={uk ? "Обраний вузол" : "Selected node"}
      style={
        position
          ? { left: position.x, top: position.y, bottom: "auto", transform: "none" }
          : undefined
      }
    >
      <button
        type="button"
        className="network-node-grip"
        aria-label={
          uk
            ? "Перемістити панель дій. Використовуйте клавіші зі стрілками"
            : "Move node actions. Use arrow keys"
        }
        onPointerDown={(event) => {
          const rect = element.current!.getBoundingClientRect();
          drag.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          event.currentTarget.setPointerCapture(event.pointerId);
          event.preventDefault();
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const rect = element.current!.parentElement!.getBoundingClientRect();
          move(
            event.clientX - rect.left - drag.current.x,
            event.clientY - rect.top - drag.current.y,
          );
        }}
        onPointerUp={(event) => {
          drag.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-24, 0],
            ArrowRight: [24, 0],
            ArrowUp: [0, -24],
            ArrowDown: [0, 24],
          };
          const direction = directions[event.key];
          if (!direction) return;
          const el = element.current!,
            r = el.getBoundingClientRect(),
            p = el.parentElement!.getBoundingClientRect();
          move(r.left - p.left + direction[0], r.top - p.top + direction[1]);
          event.preventDefault();
        }}
      >
        <GripVertical size={16} />
      </button>
      {children}
    </aside>
  );
}
