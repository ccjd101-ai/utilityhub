import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <a className="brand" href="/" aria-label="UtilityHub home">
          <span className="brand-icon" aria-hidden="true">
            U
          </span>
          <span>UtilityHub</span>
        </a>
      </header>

      <main className="app-main">
        <div className="placeholder">
          <h1>UtilityHub</h1>
          <p>Your everyday utilities, all in one place.</p>
          <p className="placeholder-note">
            We're building something useful. Check back soon.
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          UtilityHub — Simple, useful tools for everyday tasks.
        </p>
      </footer>
    </div>
  )
}

export default App