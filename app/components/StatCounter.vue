<script setup lang="ts">
const props = defineProps<{ value: string }>()

// Split "60+" -> { num: 60, suffix: "+" }, "5+" -> { num: 5, suffix: "+" }.
const match = props.value.match(/^(\d+)(.*)$/)
const target = match ? parseInt(match[1]!, 10) : 0
const suffix = match ? match[2]! : props.value

const display = ref(match ? '0' + suffix : props.value)
const el = ref<HTMLElement | null>(null)

function animate() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!match || reduce) {
    display.value = props.value
    return
  }
  const duration = 1100
  const start = performance.now()
  function tick(now: number) {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
    display.value = Math.round(eased * target) + suffix
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    display.value = props.value
    return
  }
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate()
          obs.disconnect()
        }
      }
    },
    { threshold: 0.6 }
  )
  if (el.value) obs.observe(el.value)
})
</script>

<template>
  <span ref="el">{{ display }}</span>
</template>
