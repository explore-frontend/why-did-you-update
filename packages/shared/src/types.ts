export interface FunctionCallInfo {
    id: number;
    filename: string;
    line: number;
    column: number;
    name?: string;
    flush?: string;
    type: string;
    isAsync: boolean;
}

export interface FunctionCallRecord {
    info: FunctionCallInfo
    before: number
    after: number
}

export enum FunctionNames {
  computed = 'computed',
  watch = 'watch',
  watchEffect = 'watchEffect',
  watchPostEffect = 'watchPostEffect',
  watchSyncEffect = 'watchSyncEffect'
}

export type WatchEffectFunctionNames =
  | FunctionNames.watchEffect
  | FunctionNames.watchPostEffect
  | FunctionNames.watchSyncEffect;

export enum Types {
  computed = 'computed',
  watch = 'watch',
  watchEffect = 'watchEffect'
}

export enum Flush {
  pre = 'pre',
  post = 'post',
  sync = 'sync'
}
