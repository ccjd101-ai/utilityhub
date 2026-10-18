import { Link, Navigate, useLocation, useRoutes } from 'react-router'
import { getToolByPath, tools } from '../tools/registry'
import ToolLayout from '../components/layout/ToolLayout'
import NotFoundPage from '../pages/NotFoundPage'
import App from '../App'

function ToolPlaceholder() {
  const location = useLocation()
  const tool = getToolByPath(location.pathname)

  if (!tool) {
    return <NotFoundPage />
  }

  return (
    <ToolLayout
      title={tool.title}
      description={tool.description}
    >
      <div className="tool-coming-soon">
        <span className="tool-coming-soon-badge">COMING SOON</span>
        <h2>We're working on this tool.</h2>
        <p>
          This utility isn't available yet. Check back as UtilityHub continues
          to grow.
        </p>
        <Link to="/">Explore available tools</Link>
      </div>
    </ToolLayout>
  )
}

function AppRoutes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <App />,
    },
    ...tools.map((tool) => ({
      path: tool.href,
      element: <ToolPlaceholder />,
    })),
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ])

  return routes ?? <Navigate to="/" replace />
}

export default AppRoutes
