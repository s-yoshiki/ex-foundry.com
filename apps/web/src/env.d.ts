interface ImportMetaEnv {
  /**
   * Origin of the companion API (`apps/api`). Leave unset to build the site
   * without any API integration — the status indicator then renders nothing.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
