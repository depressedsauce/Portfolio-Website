// v-reveal: fades elements in when they scroll into view.
// Registered universally so SSR can resolve the directive; the observer
// work only runs in the browser.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (import.meta.client && typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
  }

  nuxtApp.vueApp.directive('reveal', {
    // Ensure the element ships hidden in SSR markup so there's no flash.
    getSSRProps() {
      return { class: 'reveal' }
    },
    mounted(el: HTMLElement, binding) {
      el.classList.add('reveal')
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      if (observer) observer.observe(el)
      else el.classList.add('is-visible')
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    }
  })
})
