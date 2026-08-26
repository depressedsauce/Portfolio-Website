// Snaps written text onto the paper theme's ruled lines.
//
// The sheet's rules repeat every --grid-size from the top of the canvas, and
// main.css already makes each line of writing exactly one rule tall. What CSS
// cannot do is line up the START of a block: a block's offset depends on the
// summed height of everything above it — headers, images, sticky notes — so
// its phase against the rule grid is arbitrary. This walks the writing in
// document order and pads each block until its first baseline lands on a
// rule — so the line rests on the line, at any type size.
//
// Paper only. Blueprint never gets a padding of ours, and switching away
// clears everything we set.

const SNAP = 'p, li, dd, dt, figcaption, blockquote'

export default defineNuxtPlugin((nuxtApp) => {
  let frame: ReturnType<typeof setTimeout> | undefined
  let snapped: HTMLElement[] = []

  const isPaper = () => document.documentElement.getAttribute('data-theme') === 'paper'

  const pitch = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--rule-pitch')
    const n = parseFloat(raw)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  // Layout position from the top of the document. offsetTop is used rather
  // than getBoundingClientRect because the scroll-reveal directive holds
  // elements under a translateY until they animate in, and rect would report
  // that transform as if it were the layout position.
  const docTop = (el: HTMLElement) => {
    let y = 0
    let node: HTMLElement | null = el
    while (node) {
      y += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    return y
  }

  // Where the first baseline actually falls, measured from the element's own
  // border-box top. An empty inline-block sits on the baseline of its line, so
  // dropping one in and reading its bottom edge reports the truth — including
  // whatever else shares that line. Deriving this from font metrics instead
  // gets it wrong the moment a line holds something taller than the text, as
  // the hero's pen nib does.
  //
  // Both rects come from the same element subtree, so any transform on an
  // ancestor (the scroll-reveal holds elements under a translateY) cancels.
  const baselineIn = (el: HTMLElement) => {
    const sitter = document.createElement('span')
    sitter.style.cssText = 'display:inline-block;width:0;height:0'
    el.insertBefore(sitter, el.firstChild)
    const offset = sitter.getBoundingClientRect().bottom - el.getBoundingClientRect().top
    el.removeChild(sitter)
    return offset
  }

  const clear = () => {
    for (const el of snapped) {
      el.style.paddingTop = ''
      el.removeAttribute('data-rule-snap')
      el.removeAttribute('data-ruled')
    }
    snapped = []
  }

  // One pass corrects each block by the SIGNED distance from its baseline to
  // the nearest rule, on top of whatever padding it already carries. That
  // makes the pass idempotent and convergent: run it on a settled layout and
  // nothing moves; run it after something shifted (a media query changed the
  // pitch, an image decoded, a font swapped) and it corrects by that small
  // residual rather than recomputing from a stale zero.
  const apply = (settlePasses = 2) => {
    frame = undefined
    if (!isPaper()) {
      clear()
      return
    }

    const p = pitch()
    const main = document.querySelector('main')
    if (!p || !main) return

    // The rule is painted in the last pixel of each cell, so a baseline
    // landing there is a line of writing sitting on the rule.
    const target = p - 1

    const targets = ([...main.querySelectorAll<HTMLElement>(SNAP)]).filter((el) => {
      // A sticky note is opaque, so it hides the rules it sits on — there is
      // nothing under that text to line up with.
      if (el.closest('.card') || el.classList.contains('eyebrow')) return false
      // Only things laid out as running text. Plenty of p/li on this site are
      // layout boxes — the hero stat row is a flex `li`, the eyebrow is an
      // inline-flex `p` — and snapping those moves furniture, not writing.
      const display = getComputedStyle(el).display
      return display === 'block' || display === 'list-item'
    })

    let moved = false

    // Document order matters: padding added to one block moves every block
    // below it, so each is measured after its predecessors have been set.
    for (const el of targets) {
      // Mark first, measure second. `data-ruled` is what tells CSS this is
      // writing and gives it the rule's line height; reading metrics before
      // that would size the baseline against the element's old line box.
      if (!el.hasAttribute('data-ruled')) {
        el.setAttribute('data-ruled', '')
        snapped.push(el)
      }

      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0
      // baselineIn is measured from the border box, so it already carries pad.
      const baseline = docTop(el) + baselineIn(el)

      // Signed residual in (-p/2, p/2] — nudge to the nearest rule, never a
      // whole cell away from it.
      let delta = target - baseline
      delta -= Math.round(delta / p) * p
      if (Math.abs(delta) < 0.5) continue

      let next = pad + delta
      while (next < 0) next += p
      el.style.paddingTop = `${next.toFixed(2)}px`
      el.setAttribute('data-rule-snap', '')
      moved = true
    }

    // Only chase the layout while it is still moving.
    if (moved && settlePasses > 0) setTimeout(() => apply(settlePasses - 1), 200)
  }

  // A task, not an animation frame: a page opened in a background tab gets
  // no frames, and the writing would sit unsnapped until it was focused.
  const schedule = (delay = 0) => {
    clearTimeout(frame)
    frame = setTimeout(() => apply(), delay)
  }

  // Fonts change line box heights, which moves everything below; so does a
  // late-decoding image.
  document.fonts?.ready.then(() => schedule()).catch(() => {})
  window.addEventListener('load', () => schedule(), { once: true })

  // Re-snap when the theme flips, and when a resize reflows the column.
  new MutationObserver(() => schedule()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  // Width changes rewrap the text and can move the rule pitch to its narrow
  // value, so the whole sheet has to be measured again. Width only: our own
  // padding changes the page's height, and reacting to that would loop.
  let lastWidth = -1
  const onWidthChange = (width: number) => {
    if (Math.abs(width - lastWidth) < 0.5) return
    lastWidth = width
    schedule(120)
  }
  // Both, deliberately. ResizeObserver also catches reflows that change the
  // column without changing the window; the resize event still fires when the
  // page is getting no animation frames, which is where the observer goes
  // quiet.
  new ResizeObserver((entries) => onWidthChange(entries[0]?.contentRect.width ?? 0)).observe(
    document.documentElement
  )
  window.addEventListener('resize', () => onWidthChange(document.documentElement.clientWidth), {
    passive: true
  })

  // Every route renders a different amount of prose.
  nuxtApp.hook('page:finish', () => schedule())
  schedule()
})
