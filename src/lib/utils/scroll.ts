/**
 * Check if a scrollable container is scrolled near the bottom
 * @param container - The scrollable HTMLElement
 * @param threshold - Distance from bottom in pixels (default: 100)
 * @returns true if the container is within threshold pixels of the bottom
 */
export function isAtBottom(container: HTMLElement | null, threshold: number = 100): boolean {
  if (!container) return false;
  
  const position = container.scrollTop + container.clientHeight;
  const bottom = container.scrollHeight;
  
  return bottom - position < threshold;
}

/**
 * Smoothly scroll a container to the bottom
 * @param container - The scrollable HTMLElement
 */
export function scrollToBottom(container: HTMLElement | null): void {
  if (!container) return;
  
  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
}

