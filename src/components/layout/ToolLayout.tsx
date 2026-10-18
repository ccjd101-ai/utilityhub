import { useState, type ReactNode } from 'react'
import { ArrowLeft, Wrench } from 'lucide-react'
import { Link } from 'react-router'
import ToolSidebar from './ToolSidebar'

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div
      className={[
        'tool-page',
        sidebarCollapsed ? 'sidebar-collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ToolSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div className="tool-page-shell">
        <header className="tool-page-header tool-page-header-minimal">
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

          <section
            className="tool-page-content"
            aria-label={`${title} content`}
          >
            {children}
          </section>

          <footer className="tool-page-footer">
            <span>UtilityHub</span>
            <span>Simple, useful tools for everyday tasks.</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default ToolLayout
