function initDashboardPreview(preview: Element) {
  const tabs = preview.querySelectorAll<HTMLButtonElement>('.dp-tab')
  const views = preview.querySelectorAll<HTMLElement>('.dp-view')
  const viewsContainer = preview.querySelector<HTMLElement>('.dp-views')
  const mobileQuery = window.matchMedia('(max-width: 600px)')

  let tabIndex = 0
  let userInteracted = false
  let cycleTimer: ReturnType<typeof setInterval> | null = null
  let observer: IntersectionObserver | null = null

  function isMobile() {
    return mobileQuery.matches
  }

  function stopAutoCycle() {
    if (cycleTimer) {
      clearInterval(cycleTimer)
      cycleTimer = null
    }
  }

  function updateViewsHeight() {
    if (!viewsContainer || views.length === 0) return

    if (isMobile()) {
      viewsContainer.style.height = ''
      return
    }

    let maxHeight = 0
    views.forEach((view) => {
      maxHeight = Math.max(maxHeight, view.scrollHeight)
    })

    if (maxHeight > 0) {
      viewsContainer.style.height = `${maxHeight}px`
    }
  }

  function switchTo(index: number) {
    const tab = tabs[index]
    const target = tab.dataset.view

    tabs.forEach((t) => {
      t.classList.remove('dp-tab-active')
      t.setAttribute('aria-selected', 'false')
      t.querySelectorAll<HTMLElement>('.dp-tab-bracket').forEach(
        (b) => (b.style.opacity = '0.4'),
      )
    })
    views.forEach((v) => v.classList.remove('dp-view-active'))

    tab.classList.add('dp-tab-active')
    tab.setAttribute('aria-selected', 'true')
    tab
      .querySelectorAll<HTMLElement>('.dp-tab-bracket')
      .forEach((b) => (b.style.opacity = '1'))

    const view = preview.querySelector<HTMLElement>(`#dp-view-${target}`)
    if (view) view.classList.add('dp-view-active')

    tabIndex = index
  }

  // Measure after layout, and again after fonts settle
  requestAnimationFrame(() => {
    updateViewsHeight()
    requestAnimationFrame(updateViewsHeight)
  })

  window.addEventListener('resize', () => {
    updateViewsHeight()
    if (isMobile()) stopAutoCycle()
  })
  window.addEventListener('load', updateViewsHeight)
  mobileQuery.addEventListener('change', () => {
    updateViewsHeight()
    if (isMobile()) stopAutoCycle()
  })

  // Click: take control and stop auto-cycle
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      userInteracted = true
      stopAutoCycle()
      switchTo(i)
    })
  })

  // Auto-cycle when scrolled into view, pause when out of view
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (isMobile()) {
          stopAutoCycle()
          return
        }
        if (entry.isIntersecting && !userInteracted && !cycleTimer) {
          cycleTimer = setInterval(() => {
            switchTo((tabIndex + 1) % tabs.length)
          }, 3000)
        } else if (!entry.isIntersecting && cycleTimer) {
          stopAutoCycle()
        }
      })
    },
    { threshold: 0.4 },
  )

  if (!isMobile()) {
    observer.observe(preview)
  }
}

function init() {
  document.querySelectorAll('.dashboard-preview').forEach(initDashboardPreview)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
