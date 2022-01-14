<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Result } from "@/types";
import { Flush, FunctionCallRecord, Types } from "@why-did-you-update/shared";
import { NDataTable, DataTableColumn } from "naive-ui";
import { aggregateResult } from "./aggregate";

const props = defineProps<{
  records: FunctionCallRecord[];
}>();

const results = computed(() => {
  return aggregateResult(props.records);
});

const columns: DataTableColumn<Result>[] = [
  {
    title: "Id",
    key: "id",
    fixed: "left",
  },
  {
    title: "Position",
    key: "filename",
    render: (row) => `${row.filename}:${row.line}:${row.column}`,
  },
  {
    title: "Type",
    key: "type",
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
    render: (row) => (row.isAsync ? "True" : "False"),
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
    render: (row) => row.flush ?? "-",
  },
  {
    title: "Name",
    key: "name",
    render: (row) => row.name ?? "-",
  },
  {
    title: "Count",
    key: "count",
    sorter: (row1, row2) => row1.count - row2.count,
  },
  {
    title: "Average",
    key: "averageDuration",
    sorter: (row1, row2) => row1.averageDuration - row2.averageDuration,
    render: (row) => `${row.averageDuration} ms`,
  },
  {
    title: "Max",
    key: "maxDuration",
    sorter: (row1, row2) => row1.maxDuration - row2.maxDuration,
    render: (row) => `${row.maxDuration} ms`,
  },
  {
    title: "Sum",
    key: "sumDuration",
    sorter: (row1, row2) => row1.sumDuration - row2.sumDuration,
    render: (row) => `${row.sumDuration} ms`,
  },
];

const pagination = {
  pageSize: 30,
};
</script>
<template>
  <n-data-table
    size="small"
    striped
    :pagination="pagination"
    :columns="columns"
    :data="results"
    :scroll-x="900"
  ></n-data-table>
</template>
