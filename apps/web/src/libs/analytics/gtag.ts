export type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}
