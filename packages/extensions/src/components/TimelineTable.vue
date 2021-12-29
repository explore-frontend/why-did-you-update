<script setup lang="ts">
import { defineProps, computed } from "vue";

import { Flush, FunctionCallRecord, Types } from "@why-did-you-update/shared";
import { NDataTable, DataTableColumn } from "naive-ui";

const props = defineProps<{
  records: FunctionCallRecord[];
}>();

const normalizedRecords = computed(() => {
  const minTimeline = Math.min(...props.records.map((record) => record.before));
  return props.records.map((record) => ({
    ...record,
    before: record.before - minTimeline,
    after: record.after - minTimeline,
  }));
});

const msDurationFormat = (ms: number) => {
  return `${Number(ms.toFixed(2))}ms`;
};

const columns: DataTableColumn<FunctionCallRecord>[] = [
  {
    title: "Start Time",
    key: "startTime",
    render: (row) => msDurationFormat(row.before),
    sorter: (row1, row2) => row1.before - row2.before,
  },
  {
    title: "End Time",
    key: "endTime",
    render: (row) => msDurationFormat(row.after),
    sorter: (row1, row2) => row1.after - row2.after,
  },
  {
    title: "Duration",
    key: "duration",
    render: (row) => msDurationFormat(row.after - row.before),
    sorter: (row1, row2) =>
      row1.after - row1.before - (row2.after - row2.before),
  },
  {
    title: "Id",
    key: "id",
    render: (row) => row.info.id,
  },
  {
    title: "Position",
    key: "filename",
    render: (row) => `${row.info.filename}:${row.info.line}:${row.info.column}`,
  },
  {
    title: "Type",
    key: "type",
    render: (row) => row.info.type,
    filterOptions: [
      {
        label: Types.computed,
        value: Types.computed,
      },
      {
        label: Types.watch,
        value: Types.watch,
      },
      {
        label: Types.watchEffect,
        value: Types.watchEffect,
      },
    ],
    filter: "default",
  },
  {
    title: "IsAsync",
    key: "isAsync",
    render: (row) => (row.info.isAsync ? "True" : "False"),
  },
  {
    title: "Flush",
    key: "flush",
    filterOptions: [
      {
        label: Flush.post,
        value: Flush.post,
      },
      {
        label: Flush.pre,
        value: Flush.pre,
      },
      {
        label: Flush.sync,
        value: Flush.sync,
      },
    ],
    filter: "default",
    render: (row) => row.info.flush ?? "-",
  },
  {
    title: "Name",
    key: "name",
    render: (row) => row.info.name ?? "-",
  },
];
</script>
<template>
  <div ref="containerRef" class="container">
    <n-data-table
      size="small"
      striped
      :max-height="600"
      virtual-scroll
      :columns="columns"
      :data="normalizedRecords"
    ></n-data-table>
  </div>
</template>
<style scoped>
.container {
  height: 100%;
}
</style>
