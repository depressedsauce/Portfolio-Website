<script setup lang="ts">
// A clear blueprint of the request flow that "draws itself" in:
//   Client  ──request──▶  Nuxt 4 / Nitro  ──SQL──▶  Postgres (RLS)
//   Postgres ──realtime──▶ Client  (live updates)
const drawn = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    drawn.value = true
  })
})
</script>

<template>
  <svg
    class="sketch"
    :class="{ drawn }"
    viewBox="0 0 320 200"
    role="img"
    aria-label="Request flow: client to Nuxt/Nitro server to Postgres with row-level security, and a realtime channel back to the client"
  >
    <defs>
      <marker id="ah" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 z" fill="var(--accent)" />
      </marker>
      <marker id="ahR" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 z" fill="var(--accent-2)" />
      </marker>
    </defs>

    <!-- ===== nodes ===== -->
    <!-- Client -->
    <g class="node">
      <rect x="14" y="42" width="74" height="48" rx="3" />
      <text x="51" y="63" text-anchor="middle">Client</text>
      <text x="51" y="76" text-anchor="middle" class="sm">web · mobile</text>
    </g>

    <!-- Nuxt / Nitro -->
    <g class="node accent">
      <rect x="124" y="40" width="82" height="52" rx="3" />
      <text x="165" y="61" text-anchor="middle">Nuxt 4 / Nitro</text>
      <text x="165" y="74" text-anchor="middle" class="sm">server · auth guards</text>
    </g>

    <!-- Postgres cylinder -->
    <g class="node db">
      <path d="M242 50 a36 9 0 0 0 72 0 v36 a36 9 0 0 1 -72 0 z" />
      <ellipse cx="278" cy="50" rx="36" ry="9" />
      <text x="278" y="72" text-anchor="middle">Postgres</text>
      <text x="278" y="84" text-anchor="middle" class="sm">+ RLS</text>
    </g>

    <!-- ===== connectors ===== -->
    <g class="wires">
      <line class="wire" x1="90" y1="60" x2="121" y2="60" marker-end="url(#ah)" />
      <text class="wlabel" x="105" y="52" text-anchor="middle">request</text>

      <line class="wire" x1="208" y1="60" x2="240" y2="60" marker-end="url(#ah)" />
      <text class="wlabel" x="224" y="52" text-anchor="middle">SQL</text>

      <!-- realtime return: db -> down -> across -> up into client -->
      <path class="wire realtime" d="M278 96 V168 H51 V92" marker-end="url(#ahR)" />
      <text class="wlabel rt" x="165" y="182" text-anchor="middle">realtime updates</text>
    </g>
  </svg>
</template>

<style scoped>
.sketch { width: 100%; height: auto; display: block; }

.node rect,
.node ellipse,
.node path {
  fill: transparent;
  stroke: var(--ink-soft);
  stroke-width: 1.5;
}
.node.accent rect { stroke: var(--accent); }
.node.db path,
.node.db ellipse { stroke: var(--accent-3); }
.node text { font-family: var(--font-mono); font-size: 9px; fill: var(--ink); }
.node text.sm { font-size: 7px; fill: var(--ink-soft); }

.wire { fill: none; stroke: var(--accent); stroke-width: 1.5; }
.wire.realtime { stroke: var(--accent-2); stroke-dasharray: 4 4; }
.wlabel { font-family: var(--font-mono); font-size: 7.5px; fill: var(--ink-faint); }
.wlabel.rt { fill: var(--accent-2); }

/* ---- draw-on animation ---- */
.node { opacity: 0; transition: opacity .5s ease; }
.sketch.drawn .node { opacity: 1; }
.node.accent { transition-delay: .15s; }
.node.db { transition-delay: .3s; }

.wires { opacity: 0; transition: opacity .01s ease .45s; }
.sketch.drawn .wires { opacity: 1; }
.wire {
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 1s ease .5s;
}
.wire.realtime { stroke-dasharray: 4 4; stroke-dashoffset: 0; opacity: 0; transition: opacity .6s ease 1.2s; }
.sketch.drawn .wire { stroke-dashoffset: 0; }
.sketch.drawn .wire.realtime { opacity: 1; }
.wlabel { opacity: 0; transition: opacity .5s ease 1s; }
.sketch.drawn .wlabel { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .node, .wires, .wire, .wlabel { transition: none; opacity: 1; }
  .wire { stroke-dashoffset: 0; }
}
</style>
