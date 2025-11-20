'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'

type WidgetFrameSyncProps = PropsWithChildren<{
  widgetId?: string
}>

const MESSAGE_TYPE = 'ATATURK_QUOTE_WIDGET_SIZE'

export default function WidgetFrameSync({ widgetId, children }: WidgetFrameSyncProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!widgetId) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    if (!window.parent || window.parent === window) {
      return
    }

    const postHeight = () => {
      const node = containerRef.current
      if (!node) return
      const height = Math.ceil(node.getBoundingClientRect().height)
      window.parent.postMessage(
        {
          type: MESSAGE_TYPE,
          widgetId,
          height,
        },
        '*'
      )
    }

    postHeight()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        postHeight()
      })
      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
      return () => {
        observer.disconnect()
      }
    }

    const intervalId = window.setInterval(postHeight, 600)
    return () => window.clearInterval(intervalId)
  }, [widgetId])

  return <div ref={containerRef}>{children}</div>
}
