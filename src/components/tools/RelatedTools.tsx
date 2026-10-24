import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { getRelatedTools } from '../../tools/registry'

function RelatedTools({ currentPath }: { currentPath?: string }) {
  if (!currentPath) return null
  const related = getRelatedTools(currentPath)
  if (related.length === 0) return null

  return (
    <section className="related-tools" aria-labelledby="related-tools-heading">
      <div className="related-tools-heading">
        <div><span className="section-kicker">KEEP EXPLORING</span><h2 id="related-tools-heading">Related tools</h2></div>
        <span>{related.length} {related.length === 1 ? 'tool' : 'tools'}</span>
      </div>
      <div className="related-tools-list">
        {related.map((tool) => {
          const Icon = tool.icon
          return <Link key={tool.href} to={tool.href} className={`related-tool-card accent-${tool.accent}`}>
            <span className="related-tool-icon"><Icon size={18} aria-hidden="true" /></span>
            <span className="related-tool-copy"><strong>{tool.title}</strong><span>{tool.description}</span></span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        })}
      </div>
    </section>
  )
}

export default RelatedTools
