import { useRef, useState, useCallback, CSSProperties } from "react";

type SwipeDirection = "left" | "right" | null;

interface UseSwipeOptions {
  onSwipe: (direction: "left" | "right") => void;
  threshold?: number;
}

interface UseSwipeReturn {
  dragStyle: CSSProperties;
  swipeDirection: SwipeDirection;
  triggerSwipe: (direction: "left" | "right") => void;
  pointerHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

export function useSwipe({ onSwipe, threshold = 80 }: UseSwipeOptions): UseSwipeReturn {
  const startX = useRef(0);
  const isDragging = useRef(false);
  const [deltaX, setDeltaX] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isFlying, setIsFlying] = useState(false);

  const flyOut = useCallback(
    (direction: "left" | "right") => {
      setIsFlying(true);
      setSnapping(false);
      setSwipeDirection(direction);
      setDeltaX(direction === "right" ? 600 : -600);
      setTimeout(() => {
        onSwipe(direction);
        setDeltaX(0);
        setSwipeDirection(null);
        setIsFlying(false);
      }, 350);
    },
    [onSwipe]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isFlying) return;
      isDragging.current = true;
      startX.current = e.clientX;
      setSnapping(false);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isFlying]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || isFlying) return;
      const dx = e.clientX - startX.current;
      setDeltaX(dx);
      setSwipeDirection(dx > 20 ? "right" : dx < -20 ? "left" : null);
    },
    [isFlying]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    setDeltaX((current) => {
      if (Math.abs(current) >= threshold) {
        flyOut(current > 0 ? "right" : "left");
        return current;
      } else {
        setSnapping(true);
        setSwipeDirection(null);
        setTimeout(() => setSnapping(false), 300);
        return 0;
      }
    });
  }, [threshold, flyOut]);

  const triggerSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isFlying) return;
      flyOut(direction);
    },
    [isFlying, flyOut]
  );

  const rotate = deltaX / 15;
  const useTransition = isFlying || snapping;

  const dragStyle: CSSProperties = {
    transform: `translateX(${deltaX}px) rotate(${rotate}deg)`,
    transition: useTransition ? "transform 0.3s ease-out" : "none",
    cursor: isDragging.current ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none",
  };

  return {
    dragStyle,
    swipeDirection,
    triggerSwipe,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
