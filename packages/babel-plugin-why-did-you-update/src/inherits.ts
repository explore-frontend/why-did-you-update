export function tryRequireTsSyntax(): unknown {
  try {
    return require('@babel/plugin-syntax-typescript').default;
  } catch {
    // do nothing
  }
}
