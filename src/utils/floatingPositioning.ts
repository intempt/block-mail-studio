
export interface ViewportBounds {
  width: number;
  height: number;
}

export interface ElementPosition {
  top: number;
  left: number;
}

export interface PositionOptions {
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  boundaryPadding?: number;
  alignment?: 'start' | 'center' | 'end' | 'smart';
}

export const getViewportBounds = (): ViewportBounds => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const calculateFloatingPosition = (
  triggerElement: HTMLElement,
  floatingElement: HTMLElement,
  options: PositionOptions = {}
): ElementPosition => {
  const {
    preferredPlacement = 'top',
    offset = 8,
    boundaryPadding = 16,
    alignment = 'smart'
  } = options;

  const triggerRect = triggerElement.getBoundingClientRect();
  const floatingRect = floatingElement.getBoundingClientRect();
  const viewport = getViewportBounds();

  let top = 0;
  let left = 0;

  // Calculate position based on preferred placement
  switch (preferredPlacement) {
    case 'top':
      top = triggerRect.top - floatingRect.height - offset;
      left = calculateHorizontalAlignment(triggerRect, floatingRect, alignment, viewport, boundaryPadding);
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      left = calculateHorizontalAlignment(triggerRect, floatingRect, alignment, viewport, boundaryPadding);
      break;
    case 'left':
      top = calculateVerticalAlignment(triggerRect, floatingRect, alignment);
      left = triggerRect.left - floatingRect.width - offset;
      break;
    case 'right':
      top = calculateVerticalAlignment(triggerRect, floatingRect, alignment);
      left = triggerRect.right + offset;
      break;
  }

  // Adjust for viewport boundaries
  if (left < boundaryPadding) {
    left = boundaryPadding;
  } else if (left + floatingRect.width > viewport.width - boundaryPadding) {
    left = viewport.width - floatingRect.width - boundaryPadding;
  }

  if (top < boundaryPadding) {
    top = boundaryPadding;
  } else if (top + floatingRect.height > viewport.height - boundaryPadding) {
    top = viewport.height - floatingRect.height - boundaryPadding;
  }

  return { top, left };
};

const calculateHorizontalAlignment = (
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  alignment: string,
  viewport: ViewportBounds,
  boundaryPadding: number
): number => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const floatingHalfWidth = floatingRect.width / 2;
  
  switch (alignment) {
    case 'start':
      return triggerRect.left;
    case 'end':
      return triggerRect.right - floatingRect.width;
    case 'center':
      return triggerCenter - floatingHalfWidth;
    case 'smart':
    default:
      // Smart alignment logic
      const isFloatingWiderThanTrigger = floatingRect.width > triggerRect.width;
      
      if (isFloatingWiderThanTrigger) {
        // For wide menus, try left-align first, then center if there's space
        const leftAlignPosition = triggerRect.left;
        const centerAlignPosition = triggerCenter - floatingHalfWidth;
        
        // Check if left-align fits within viewport
        if (leftAlignPosition + floatingRect.width <= viewport.width - boundaryPadding) {
          return leftAlignPosition;
        }
        
        // Check if center-align fits within viewport
        if (centerAlignPosition >= boundaryPadding && 
            centerAlignPosition + floatingRect.width <= viewport.width - boundaryPadding) {
          return centerAlignPosition;
        }
        
        // Fallback to right-align
        return triggerRect.right - floatingRect.width;
      } else {
        // For narrow menus, prefer center alignment
        return triggerCenter - floatingHalfWidth;
      }
  }
};

const calculateVerticalAlignment = (
  triggerRect: DOMRect,
  floatingRect: DOMRect,
  alignment: string
): number => {
  switch (alignment) {
    case 'start':
      return triggerRect.top;
    case 'end':
      return triggerRect.bottom - floatingRect.height;
    case 'center':
    case 'smart':
    default:
      return triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
  }
};

export const createPortalRoot = (id: string): HTMLElement => {
  const existing = document.getElementById(id);
  if (existing) return existing;

  const portal = document.createElement('div');
  portal.id = id;
  portal.style.position = 'absolute';
  portal.style.top = '0';
  portal.style.left = '0';
  portal.style.pointerEvents = 'none';
  portal.style.zIndex = '99999';
  document.body.appendChild(portal);
  return portal;
};
