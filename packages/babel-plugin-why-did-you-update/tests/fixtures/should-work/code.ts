import { ref, computed, watch, watchEffect, watchPostEffect, watchSyncEffect } from '@vue/composition-api'

const result = ref(42)

const namedReadonlyComputed = computed(() => {
    return result.value
})

const namedRWComputed = computed({
    get () {
        return result.value
    },
    set (v: number) {
        result.value = v
    }
})

const anonymousReadonlyComputed = {
    v: computed(() => {
        return result.value
    })
}

const anonymousRWComputed = {
    v: computed({
        get () {
            return result.value
        },
        set (v: number) {
            console.log(v)
        }
    })
}

watch(() => result, () => {
    console.log('result changed')
})

watch(() => result, async () => {
    console.log('result changed')
})

watch(() => result, () => {
    console.log('result changed')
}, {
    flush: 'post'
})

watch(() => result, async () => {
    console.log('result changed')
}, {
    flush: 'post'
})

watch(() => result, () => {
    console.log('result changed')
}, {
    flush: 'pre'
})

watch(() => result, () => {
    console.log('result changed')
}, {
    flush: 'sync'
})

watchEffect(() => {
    console.log('result changed' + result.value)
})

watchEffect(async () => {
    console.log('result changed' + result.value)
})

watchEffect(() => {
    console.log('result changed' + result.value)
}, {
    flush: 'post'
})

watchEffect(async () => {
    console.log('result changed' + result.value)
}, {
    flush: 'post'
})

watchEffect(() => {
    console.log('result changed' + result.value)
}, {
    flush: 'pre'
})

watchEffect(() => {
    console.log('result changed' + result.value)
}, {
    flush: 'sync'
})

watchPostEffect(() => {
    console.log('result changed' + result.value)
})

watchPostEffect(async () => {
    console.log('result changed' + result.value)
})

watchSyncEffect(() => {
    console.log('result changed' + result.value)
})