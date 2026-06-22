<template>
  <div id="top">
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
    <noscript>
      <!-- Without JS the scroll-reveal never fires; keep everything visible. -->
      <component :is="'style'">.reveal { opacity: 1 !important; transform: none !important; }</component>
    </noscript>
  </div>
</template>
