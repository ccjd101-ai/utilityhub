import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ToolDefinition } from '../../tools/types'

function ToolCarousel({ title, tools }: { title: string; tools: ToolDefinition[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateScrollState = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setCanScrollBack(rail.scrollLeft > 2)
    setCanScrollForward(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [tools.length, updateScrollState])

  function scroll(direction: -1 | 1) {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * rail.clientWidth * 0.82, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <section className="tool-section-row" aria-label={`${title} tools`}>
      <div className="tool-row-heading">
        <div><h3>{title}</h3><span>{tools.length} {tools.length === 1 ? 'tool' : 'tools'}</span></div>
        <div className="tool-row-controls">
          <button type="button" aria-label={`Scroll ${title} tools left`} onClick={() => scroll(-1)} disabled={!canScrollBack}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label={`Scroll ${title} tools right`} onClick={() => scroll(1)} disabled={!canScrollForward}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="tool-carousel" ref={railRef} onScroll={updateScrollState} tabIndex={0} aria-label={`${title} tool cards`}>
        {tools.map((tool) => {
          const Icon = tool.icon
          return <Link className={`tool-card accent-${tool.accent}`} to={tool.href} key={tool.href}>
            <div className="tool-card-top"><span className="tool-icon"><Icon size={26} strokeWidth={2.2} aria-hidden="true" /></span><span className="tool-category">{title}</span></div>
            <h3>{tool.title}</h3><p>{tool.description}</p><span className="tool-card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
          </Link>
        })}
      </div>
    </section>
  )
}

export default ToolCarousel
