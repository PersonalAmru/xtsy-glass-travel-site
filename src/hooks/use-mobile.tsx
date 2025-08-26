import * as React from "react"

// Consistent breakpoint constants
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  large: 1440
} as const

const MOBILE_BREAKPOINT = BREAKPOINTS.tablet
const TABLET_BREAKPOINT = BREAKPOINTS.desktop

// Enhanced useMediaQuery hook
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
}

export function useScreenSize() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  return 'desktop'
}

// Additional responsive utilities
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${TABLET_BREAKPOINT}px)`)
}

export function useIsLarge() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.large}px)`)
}

// Touch device detection
export function useIsTouchDevice() {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}
