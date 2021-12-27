<script setup lang="ts">
import { watch, computed, ref } from "@vue/composition-api";

const sleep = (n: number) => new Promise(resolve => setTimeout(resolve, n))

const msg = ref(0);
const plusOne = computed(() => {
  return msg.value + 1;
});
const plusTwo = ref(msg.value);
watch(
  () => plusOne.value,
  (one) => {
    plusTwo.value = one + 1;
  }
);
const plusTwoAfterOneSecond = ref(msg.value);
watch(
  () => plusOne.value,
  async (one) => {
    await sleep(1000)
    plusTwoAfterOneSecond.value = one + 1;
  }
);
</script>

<template>
  <div class="hello">
    <p>value: {{ msg }}</p>
    <p>value plus one: {{ plusOne }}</p>
    <p>value plus two: {{ plusTwo }}</p>
    <p>value plus two after one second: {{ plusTwoAfterOneSecond }}</p>
    <button @click="msg++">Plus</button>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
