import type { ReactNode } from 'react'
import { ArrowLeft, Wrench } from 'lucide-react'
import { Link } from 'react-router'

interface ToolLayoutProps {
  children: ReactNode
  title: string
  description: string
}

function ToolLayout({
  children,
  title,
  description,
}: ToolLayoutProps) {
  return (
    <div className="tool-page">
      <header className="tool-page-header">
        <Link to="/" className="tool-page-brand" aria-label="UtilityHub home">
          <span className="tool-page-brand-mark">U</span>
          <span>UtilityHub</span>
        </Link>

        <Link to="/" className="tool-page-back">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>All tools</span>
        </Link>
      </header>

      <main className="tool-page-main">
        <div className="tool-page-heading">
          <span className="section-kicker">
            <Wrench size={14} aria-hidden="true" />
            UTILITY TOOL
          </span>

          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <section className="tool-page-content" aria-label={`${title} content`}>
          {children}
        </section>

        <footer className="tool-page-footer">
          <span>UtilityHub</span>
          <span>Simple, useful tools for everyday tasks.</span>
        </footer>
      </main>
    </div>
  )
}

export default ToolLayout