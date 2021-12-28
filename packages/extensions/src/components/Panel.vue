<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  getInjectedFlag,
  getRecords,
  resetRecords,
  reloadAndResetRecords,
} from "../bridge/record";
import { Result } from "@/types";
import { aggregateResult } from "./aggregate";
import { NAlert, NDataTable, NButton, NSpace } from "naive-ui";
import { Flush, Types } from "@why-did-you-update/shared";
import { TableColumn } from "naive-ui/lib/data-table/src/interface";

const recording = ref(false);
const records = ref<Result[]>([]);
const injected = ref(true);
const proMode = ref(false);

const CtrlKeyCode = "Control";
const onKeyUp = (e: KeyboardEvent) => {
  if (e.key === CtrlKeyCode) {
    proMode.value = !proMode.value;
  }
};

onMounted(async () => {
  const injectedFlag = await getInjectedFlag();
  injected.value = injectedFlag;

  document.addEventListener("keyup", onKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});

const onStartRecording = async () => {
  await resetRecords();
  records.value = [];
  recording.value = true;
};

const onStartReloadAndRecording = async () => {
  reloadAndResetRecords();
  records.value = [];
  recording.value = true;
};

const onStopRecording = async () => {
  const results = await getRecords();
  records.value = aggregateResult(results);
  recording.value = false;
};

const onClearRecords = () => {
  records.value = [];
};

const columns: TableColumn<Result>[] = [
  {
    title: "Id",
    key: "id",
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
  <div class="container">
    <div v-if="!injected">
      <n-alert
        type="warning"
        title="Cannot detect why did you update"
      ></n-alert>
    </div>
    <n-space vertical v-else>
      <n-space>
        <n-button
          v-if="!proMode"
          size="small"
          type="primary"
          :disabled="recording"
          :loading="recording"
          @click="onStartRecording"
          >{{ recording ? "Recording" : "Start" }}</n-button
        >
        <n-button
          v-else
          size="small"
          type="primary"
          :disabled="recording"
          :loading="recording"
          @click="onStartReloadAndRecording"
          >{{ recording ? "Recording" : "Reload and Start" }}</n-button
        >
        <n-button size="small" :disabled="!recording" @click="onStopRecording"
          >End</n-button
        >
        <n-button
          size="small"
          type="error"
          secondary
          :disabled="recording"
          @click="onClearRecords"
          >Clear</n-button
        >
      </n-space>
      <div v-if="!recording">
        <n-data-table
          size="small"
          striped
          :pagination="pagination"
          :columns="columns"
          :data="records"
        ></n-data-table>
      </div>
    </n-space>
  </div>
</template>

<style scoped>
.container {
  padding: 8px 4px;
}
</style>
