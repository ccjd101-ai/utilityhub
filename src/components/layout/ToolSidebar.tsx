import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Home,
  Menu,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { tools } from '../../tools/registry'
import type { ToolCategory } from '../../tools/types'

const categories: { id: ToolCategory; label: string }[] = [
  { id: 'DEVELOPERS', label: 'Developers' },
  { id: 'PRODUCTIVITY', label: 'Productivity' },
]

interface ToolSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

function ToolSidebar({
  collapsed,
  onCollapsedChange,
}: ToolSidebarProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function closeMobileSidebar() {
    setMobileOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="tool-sidebar-mobile-toggle"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="tool-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={[
          'tool-sidebar',
          collapsed ? 'is-collapsed' : '',
          mobileOpen ? 'is-mobile-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Tool navigation"
      >
        <div className="tool-sidebar-top">
          <Link
            to="/"
            className="tool-sidebar-brand"
            aria-label="UtilityHub home"
            onClick={closeMobileSidebar}
          >
            <span className="tool-sidebar-brand-mark">U</span>
            {!collapsed && <span>UtilityHub</span>}
          </Link>

          <button
            type="button"
            className="tool-sidebar-collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={18} aria-hidden="true" />
            ) : (
              <ChevronLeft size={18} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="tool-sidebar-mobile-close"
            aria-label="Close navigation menu"
            onClick={closeMobileSidebar}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="tool-sidebar-nav" aria-label="Main navigation">
          <Link
            to="/"
            className="tool-sidebar-home"
            onClick={closeMobileSidebar}
            title={collapsed ? 'Home' : undefined}
          >
            <Home size={18} aria-hidden="true" />
            {!collapsed && <span>Home</span>}
          </Link>

          <div className="tool-sidebar-section-heading">
            {collapsed ? (
              <span className="tool-sidebar-section-divider" />
            ) : (
              <span>YOUR TOOLS</span>
            )}
          </div>

          {categories.map((category) => {
            const categoryTools = tools.filter(
              (tool) => tool.category === category.id,
            )

            if (categoryTools.length === 0) {
              return null
            }

            return (
              <section
                className="tool-sidebar-category"
                key={category.id}
                aria-label={category.label}
              >
                {!collapsed && (
                  <h2 className="tool-sidebar-category-title">
                    {category.label}
                  </h2>
                )}

                {categoryTools.map((tool) => {
                  const Icon = tool.icon
                  const active = location.pathname === tool.href

                  return (
                    <Link
                      key={tool.href}
                      to={tool.href}
                      className={[
                        'tool-sidebar-link',
                        active ? 'is-active' : '',
                        `accent-${tool.accent}`,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? tool.title : undefined}
                      onClick={closeMobileSidebar}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {!collapsed && <span>{tool.title}</span>}
                      {active && (
                        <span
                          className="tool-sidebar-active-indicator"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  )
                })}
              </section>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="tool-sidebar-bottom">
            <span className="tool-sidebar-bottom-icon">
              <Code2 size={16} aria-hidden="true" />
            </span>
            <div>
              <strong>Built for productivity</strong>
              <span>Simple tools. No fuss.</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default ToolSidebar
