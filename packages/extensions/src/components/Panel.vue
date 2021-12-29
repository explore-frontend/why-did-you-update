<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getInjectedFlag,
  getRecords,
  resetRecords,
  reloadAndResetRecords,
} from "../bridge/record";
import {
  NAlert,
  NButton,
  NSpace,
  NButtonGroup,
  NDropdown,
  MenuOption,
  NTabs,
  NTabPane,
} from "naive-ui";
import RecordTable from "./RecordTable.vue";
import { FunctionCallRecord } from "@why-did-you-update/shared";
import TimelineTable from "./TimelineTable.vue";
import { TabKeys } from "@/types";

const recording = ref(false);
const records = ref<FunctionCallRecord[]>([]);
const injected = ref(true);

onMounted(async () => {
  const injectedFlag = await getInjectedFlag();
  injected.value = injectedFlag;
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
  records.value = results;
  recording.value = false;
};

const onClearRecords = () => {
  records.value = [];
};

const reloadAndStartKey = "reloadAndStart";
const dropdownOptions: MenuOption[] = [
  {
    label: "Reload and Start",
    key: reloadAndStartKey,
  },
];

const onDropDownSelect = (key: string) => {
  if (key === reloadAndStartKey) {
    onStartReloadAndRecording();
  }
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
        <n-button-group size="small">
          <n-button
            size="small"
            type="primary"
            primary
            strong
            :disabled="recording"
            :loading="recording"
            @click="onStartRecording"
            >{{ recording ? "Recording" : "Start" }}</n-button
          >
          <n-dropdown
            :options="dropdownOptions"
            :disabled="recording"
            trigger="click"
            @select="onDropDownSelect"
          >
            <n-button primary type="primary" size="small" :disabled="recording"
              >...</n-button
            >
          </n-dropdown>
        </n-button-group>

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
        <n-tabs size="small" :default-value="TabKeys.Aggregate">
          <n-tab-pane :name="TabKeys.Aggregate">
            <record-table :records="records"></record-table>
          </n-tab-pane>
          <n-tab-pane :name="TabKeys.Timeline">
            <timeline-table :records="records"></timeline-table>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-space>
  </div>
</template>

<style scoped>
.container {
  padding: 8px 4px;
}
</style>
