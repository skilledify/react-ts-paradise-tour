import { useRef, useState } from 'react';
import type { DragEvent, MouseEvent, PointerEvent } from 'react';

interface SwipeOptions {
  /** Направление: 1 — следующий слайд, -1 — предыдущий. */
  onSwipe: (direction: 1 | -1) => void;
  /** Минимальная длина свайпа в пикселях. */
  threshold?: number;
  /** Вызывается, когда пользователь начал/закончил тянуть слайдер. */
  onDragChange?: (dragging: boolean) => void;
}

interface StartPoint {
  x: number;
  y: number;
  id: number;
}

/**
 * Свайп/перетаскивание указателем (мышь, палец, стилус).
 * Работает на любой ширине экрана, не мешает вертикальному скроллу
 * и не даёт клику сработать сразу после свайпа.
 */
export function useSwipe({
  onSwipe,
  threshold = 48,
  onDragChange,
}: SwipeOptions) {
  const start = useRef<StartPoint | null>(null);
  const draggingRef = useRef(false);
  const swipedRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const setDrag = (value: boolean) => {
    if (draggingRef.current === value) return;
    draggingRef.current = value;
    setDragging(value);
    onDragChange?.(value);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swipedRef.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const point = start.current;
    if (!point || e.pointerId !== point.id) return;

    const dx = e.clientX - point.x;
    const dy = e.clientY - point.y;

    if (!draggingRef.current && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      setDrag(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* некоторые браузеры могут не поддерживать capture — свайп всё равно работает */
      }
    }
  };

  const finish = (e: PointerEvent<HTMLElement>, allowSwipe: boolean) => {
    const point = start.current;
    if (!point || e.pointerId !== point.id) return;

    const dx = e.clientX - point.x;
    const dy = e.clientY - point.y;
    const isSwipe =
      allowSwipe && Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy);
    const wasDragging = draggingRef.current;

    if (isSwipe) onSwipe(dx < 0 ? 1 : -1);
    // Даже короткое перетаскивание не должно превращаться в клик по карточке.
    if (isSwipe || wasDragging) swipedRef.current = true;

    start.current = null;
    setDrag(false);
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => finish(e, true);
  const onPointerCancel = (e: PointerEvent<HTMLElement>) => finish(e, false);

  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (!swipedRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    swipedRef.current = false;
  };

  return {
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
      onDragStart: (e: DragEvent<HTMLElement>) => e.preventDefault(),
    },
  };
}
