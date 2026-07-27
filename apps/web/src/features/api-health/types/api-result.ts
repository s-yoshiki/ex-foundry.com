/** Outcome of a call to the companion API, with failures modelled as values. */
export type ApiResult<TData> = { data: TData; status: "ok" } | { message: string; status: "error" };

export type ApiHealthState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok" }
  | { message: string; status: "error" };
