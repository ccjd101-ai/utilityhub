import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/">Return to UtilityHub</Link>
    </main>
  )
}

export default NotFoundPage
