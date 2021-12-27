import { Result } from "@/types";
import { FunctionCallRecord } from "@why-did-you-update/shared";

export function aggregateResult(records: FunctionCallRecord[]) {
  const map = new Map<number, FunctionCallRecord[]>();
  records.forEach((record) => {
    const list = map.get(record.info.id) ?? [];
    list.push(record);
    map.set(record.info.id, list);
  });

  const results: Result[] = [];
  map.forEach((value) => {
    const anyItem = value[0];

    const durations = value.map((x) => x.after - x.before);
    const maxDuration = Math.max(...durations);
    const sumDuration = durations.reduce((prev, next) => next + prev, 0);
    const averageDuration = sumDuration / durations.length;

    results.push({
      id: anyItem.info.id,
      filename: anyItem.info.filename,
      line: anyItem.info.line,
      column: anyItem.info.column,
      type: anyItem.info.type,
      flush: anyItem.info.flush,
      name: anyItem.info.name,
      isAsync: anyItem.info.isAsync,
      maxDuration: Number(maxDuration.toFixed(2)),
      averageDuration: Number(averageDuration.toFixed(2)),
      sumDuration: Number(sumDuration.toFixed(2)),
      count: durations.length,
    });
  });
  return results;
}
