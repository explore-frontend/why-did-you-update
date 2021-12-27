import type t from '@babel/template';

export function getWrapperHelperTemplate(template: typeof t) {
  const helper = template.statement(`
function WRAP_FUNCTION_NAME(cb, info) {
  return function wrapper(...args) {
    const before = performance.now();
    const result = cb(...args);
    const after = performance.now();
    if (window.__why_did_you_update_records) {
      window.__why_did_you_update_records.push({
        info,
        before,
        after
      });
    }
    return result;
  };
}`);
  return helper;
}

export function getAsyncWrapperHelperTemplate(template: typeof t) {
  const helper = template.statement(`
function ASYNC_WRAP_FUNCTION_NAME(cb, info) {
  return async function wrapper(...args) {
    const before = performance.now();
    const result = await cb(...args);
    const after = performance.now();
    if (window.__why_did_you_update_records) {
      window.__why_did_you_update_records.push({
        info,
        before,
        after
      });
    }
    return result;
  };
}`);
  return helper;
}

export function getFlagInjectTemplate(template: typeof t) {
  const helper = template.statement(`
(function () {
  window.__why_did_you_update = true
})()`);
  return helper;
}

export function getInfoHelperTemplate(template: typeof t) {
  const helper = template.expression(`
{
  id: ID,
  filename: FILENAME,
  line: LINE,
  column: COLUMN,
  name: NAME,
  type: TYPE,
  flush: FLUSH,
  isAsync: ASYNC,
}`);
  return helper;
}
