import { FunctionCallRecord } from "@why-did-you-update/shared";

const resetRecordsCode = `
(function () {
  window.__why_did_you_update_records = [];
})()`;

const getRecordsCode = `
(function(){
  if (window.__why_did_you_update_records) {
    const result = window.__why_did_you_update_records
    window.__why_did_you_update_records = undefined;
    return result
  }
  return []
})()`;

const getInjectFlagCode = `
(function(){
  return !!window.__why_did_you_update
})()`;

export async function resetRecords(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(resetRecordsCode, (_, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function getRecords(): Promise<FunctionCallRecord[]> {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(getRecordsCode, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as FunctionCallRecord[]);
      }
    });
  });
}

export async function getInjectedFlag(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(getInjectFlagCode, (result, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as boolean);
      }
    });
  });
}

export function reloadAndResetRecords(): void {
  chrome.devtools.inspectedWindow.reload({
    injectedScript: resetRecordsCode,
  });
}
