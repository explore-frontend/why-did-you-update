function _a_wrap(cb, info) {
  return async function wrapper(...args) {
    const before = performance.now();
    const result = await cb(...args);
    const after = performance.now();

    if (window.__why_did_you_update_records) {
      window.__why_did_you_update_records.push({
        info,
        before,
        after,
      });
    }

    return result;
  };
}

function _wrap(cb, info) {
  return function wrapper(...args) {
    const before = performance.now();
    const result = cb(...args);
    const after = performance.now();

    if (window.__why_did_you_update_records) {
      window.__why_did_you_update_records.push({
        info,
        before,
        after,
      });
    }

    return result;
  };
}

(function () {
  window.__why_did_you_update = true;
})();

import {
  ref,
  computed,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
} from "@vue/composition-api";
const result = ref(42);
const namedReadonlyComputed = computed(
  _wrap(
    () => {
      return result.value;
    },
    {
      id: 1,
      filename: "tests/fixtures/should-work/code.ts",
      line: 5,
      column: 39,
      name: "namedReadonlyComputed",
      type: "computed",
      flush: undefined,
      isAsync: false,
    }
  )
);
const namedRWComputed = computed({
  get() {
    return result.value;
  },

  set(v: number) {
    result.value = v;
  },
});
const anonymousReadonlyComputed = {
  v: computed(
    _wrap(
      () => {
        return result.value;
      },
      {
        id: 2,
        filename: "tests/fixtures/should-work/code.ts",
        line: 19,
        column: 16,
        name: undefined,
        type: "computed",
        flush: undefined,
        isAsync: false,
      }
    )
  ),
};
const anonymousRWComputed = {
  v: computed({
    get() {
      return result.value;
    },

    set(v: number) {
      console.log(v);
    },
  }),
};
watch(
  () => result,
  _wrap(
    () => {
      console.log("result changed");
    },
    {
      id: 3,
      filename: "tests/fixtures/should-work/code.ts",
      line: 35,
      column: 20,
      name: undefined,
      type: "watch",
      flush: undefined,
      isAsync: false,
    }
  )
);
watch(
  () => result,
  _a_wrap(
    async () => {
      console.log("result changed");
    },
    {
      id: 4,
      filename: "tests/fixtures/should-work/code.ts",
      line: 39,
      column: 20,
      name: undefined,
      type: "watch",
      flush: undefined,
      isAsync: true,
    }
  )
);
watch(
  () => result,
  _wrap(
    () => {
      console.log("result changed");
    },
    {
      id: 5,
      filename: "tests/fixtures/should-work/code.ts",
      line: 43,
      column: 20,
      name: undefined,
      type: "watch",
      flush: "post",
      isAsync: false,
    }
  ),
  {
    flush: "post",
  }
);
watch(
  () => result,
  _a_wrap(
    async () => {
      console.log("result changed");
    },
    {
      id: 6,
      filename: "tests/fixtures/should-work/code.ts",
      line: 49,
      column: 20,
      name: undefined,
      type: "watch",
      flush: "post",
      isAsync: true,
    }
  ),
  {
    flush: "post",
  }
);
watch(
  () => result,
  _wrap(
    () => {
      console.log("result changed");
    },
    {
      id: 7,
      filename: "tests/fixtures/should-work/code.ts",
      line: 55,
      column: 20,
      name: undefined,
      type: "watch",
      flush: "pre",
      isAsync: false,
    }
  ),
  {
    flush: "pre",
  }
);
watch(
  () => result,
  _wrap(
    () => {
      console.log("result changed");
    },
    {
      id: 8,
      filename: "tests/fixtures/should-work/code.ts",
      line: 61,
      column: 20,
      name: undefined,
      type: "watch",
      flush: "sync",
      isAsync: false,
    }
  ),
  {
    flush: "sync",
  }
);
watchEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 9,
      filename: "tests/fixtures/should-work/code.ts",
      line: 67,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: undefined,
      isAsync: false,
    }
  )
);
watchEffect(
  _a_wrap(
    async () => {
      console.log("result changed" + result.value);
    },
    {
      id: 10,
      filename: "tests/fixtures/should-work/code.ts",
      line: 71,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: undefined,
      isAsync: true,
    }
  )
);
watchEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 11,
      filename: "tests/fixtures/should-work/code.ts",
      line: 75,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: "post",
      isAsync: false,
    }
  ),
  {
    flush: "post",
  }
);
watchEffect(
  _a_wrap(
    async () => {
      console.log("result changed" + result.value);
    },
    {
      id: 12,
      filename: "tests/fixtures/should-work/code.ts",
      line: 81,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: "post",
      isAsync: true,
    }
  ),
  {
    flush: "post",
  }
);
watchEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 13,
      filename: "tests/fixtures/should-work/code.ts",
      line: 87,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: "pre",
      isAsync: false,
    }
  ),
  {
    flush: "pre",
  }
);
watchEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 14,
      filename: "tests/fixtures/should-work/code.ts",
      line: 93,
      column: 12,
      name: undefined,
      type: "watchEffect",
      flush: "sync",
      isAsync: false,
    }
  ),
  {
    flush: "sync",
  }
);
watchPostEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 15,
      filename: "tests/fixtures/should-work/code.ts",
      line: 99,
      column: 16,
      name: undefined,
      type: "watchEffect",
      flush: "post",
      isAsync: false,
    }
  )
);
watchPostEffect(
  _a_wrap(
    async () => {
      console.log("result changed" + result.value);
    },
    {
      id: 16,
      filename: "tests/fixtures/should-work/code.ts",
      line: 103,
      column: 16,
      name: undefined,
      type: "watchEffect",
      flush: "post",
      isAsync: true,
    }
  )
);
watchSyncEffect(
  _wrap(
    () => {
      console.log("result changed" + result.value);
    },
    {
      id: 17,
      filename: "tests/fixtures/should-work/code.ts",
      line: 107,
      column: 16,
      name: undefined,
      type: "watchEffect",
      flush: "sync",
      isAsync: false,
    }
  )
);
