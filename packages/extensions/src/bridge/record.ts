import { FunctionCallRecord } from "@why-did-you-update/shared";

export async function resetRecords() {
  return new Promise((resolve, reject) => {
    const code = `
  (function () {
    window.__why_did_you_update_records = [];
  })()`;

    chrome.devtools.inspectedWindow.eval(code, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export async function getRecords() {
  return new Promise<FunctionCallRecord[]>((resolve, reject) => {
    const code = `
  (function(){
    if (window.__why_did_you_update_records) {
      const result = window.__why_did_you_update_records
      window.__why_did_you_update_records = undefined;
      return result
    }
    return []
  })()`;

    chrome.devtools.inspectedWindow.eval(code, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as FunctionCallRecord[]);
      }
    });
  });
}

export async function getInjectedFlag() {
  return new Promise<boolean>((resolve, reject) => {
    const code = `
  (function(){
    return !!window.__why_did_you_update
  })()`;

    chrome.devtools.inspectedWindow.eval(code, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as boolean);
      }
    });
  });
}
