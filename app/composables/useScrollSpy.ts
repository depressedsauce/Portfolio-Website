// Tracks which section of a long page the reader is currently in, so a table
// of contents can mark it.
//
// Deliberately offsets-plus-scroll rather than IntersectionObserver. Section
// tops are measured once and cached, so the scroll handler is pure arithmetic
// against cached numbers and forces no layout — cheaper than an observer, and
// it behaves the same whether or not the page is being composited.
//
// Positions come from the offsetTop chain rather than getBoundingClientRect,
// because the scroll-reveal directive holds sections under a translateY until
// they animate in and rect would report that transform as layout position.

// How far below the top of the viewport a section has to reach to count as the
// one being read. Clears the sticky header with room to spare, so a section
// activates as its heading arrives rather than once it fills the screen.
const ACTIVATION_LINE = 120

export function useScrollSpy(ids: string[]) {
  const activeId = ref(ids[0] ?? '')

  if (import.meta.server) return activeId

  let tops: { id: string; top: number }[] = []
  let onScroll: (() => void) | null = null
  let onResize: (() => void) | null = null
  let resizeTimer: ReturnType<typeof setTimeout> | undefined

  const docTop = (el: HTMLElement) => {
    let y = 0
    let node: HTMLElement | null = el
    while (node) {
      y += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    return y
  }

  const measure = () => {
    tops = ids
      .map((id) => {
        const el = document.getElementById(id)
        return el ? { id, top: docTop(el) } : null
      })
      .filter((x): x is { id: string; top: number } => x !== null)
  }

  const update = () => {
    if (!tops.length) return
    const doc = document.documentElement

    // At the very bottom, the last section may never cross the line — it can be
    // shorter than the gap between the line and the end of the page.
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
      activeId.value = tops[tops.length - 1]!.id
      return
    }

    const line = window.scrollY + ACTIVATION_LINE
    let current = tops[0]!.id
    for (const section of tops) {
      if (section.top <= line) current = section.id
      else break
    }
    activeId.value = current
  }

  onMounted(() => {
    measure()
    update()

    onScroll = update
    window.addEventListener('scroll', onScroll, { passive: true })

    // Anything that reflows the column moves every section below it.
    onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        measure()
        update()
      }, 120)
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('load', onResize, { once: true })
    document.fonts?.ready.then(onResize).catch(() => {})
  })

  onBeforeUnmount(() => {
    clearTimeout(resizeTimer)
    if (onScroll) window.removeEventListener('scroll', onScroll)
    if (onResize) window.removeEventListener('resize', onResize)
  })

  return activeId
}
