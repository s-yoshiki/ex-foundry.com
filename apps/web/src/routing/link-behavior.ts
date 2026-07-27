export type LinkActivation = {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

/**
 * Decides whether a click on an in-app link should be left to the browser.
 *
 * Client-side navigation must not swallow "open in new tab", "download", or
 * secondary-button clicks — the anchor has to keep behaving like an anchor.
 */
export function shouldLetBrowserHandle(event: LinkActivation, target?: string): boolean {
  if (event.defaultPrevented) {
    return true;
  }

  if (event.button !== 0) {
    return true;
  }

  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return true;
  }

  return target !== undefined && target !== "" && target !== "_self";
}
