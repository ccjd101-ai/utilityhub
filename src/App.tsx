import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Code2,
  LockKeyhole,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { toolCategories, tools } from './tools/registry'
import { useNavigate } from 'react-router'


const benefits = [
  {
    title: 'Fast & Responsive',
    description: 'Get results instantly with a smooth, responsive experience.',
    icon: Zap,
    accent: 'red',
  },
  {
    title: 'Privacy Focused',
    description: 'Your data stays in your browser whenever possible.',
    icon: ShieldCheck,
    accent: 'green',
  },
  {
    title: 'Works Everywhere',
    description: 'Use your favourite tools on desktop, tablet or mobile.',
    icon: Code2,
    accent: 'blue',
  },
  {
    title: 'Always Improving',
    description: 'A growing collection of useful tools for everyday tasks.',
    icon: Sparkles,
    accent: 'orange',
  },
]

const audiences = [
  {
    title: 'Developers',
    description: 'Format, validate and compare data without unnecessary setup.',
    icon: Code2,
    accent: 'red',
  },
  {
    title: 'Content Creators',
    description: 'Clean and transform text quickly and conveniently.',
    icon: Type,
    accent: 'blue',
  },
  {
    title: 'Students',
    description: 'Simple tools that make everyday tasks easier.',
    icon: Sparkles,
    accent: 'green',
  },
  {
    title: 'Everyday Users',
    description: 'Useful utilities for a more productive day.',
    icon: Zap,
    accent: 'orange',
  },
]

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [introVisible, setIntroVisible] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [typedLogo, setTypedLogo] = useState('')
  const [introMoving, setIntroMoving] = useState(false)
  const logoTargetRef = useRef<HTMLAnchorElement>(null)
  const introLogoRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<number | undefined>(undefined)
  const animationTimerRef = useRef<number | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    if (!introVisible) return

    const logoName = 'UtilityHub'
    let currentIndex = 0

    typingTimerRef.current = window.setInterval(() => {
      currentIndex += 1
      setTypedLogo(logoName.slice(0, currentIndex))

      if (currentIndex >= logoName.length) {
        window.clearInterval(typingTimerRef.current)

        animationTimerRef.current = window.setTimeout(() => {
          const introLogo = introLogoRef.current
          const targetLogo = logoTargetRef.current

          if (introLogo && targetLogo) {
            const from = introLogo.getBoundingClientRect()
            const to = targetLogo.getBoundingClientRect()
            const scale = Math.min(to.height / from.height, to.width / from.width)

            introLogo.style.setProperty('--move-x', `${to.left + to.width / 2 - (from.left + from.width / 2)}px`)
            introLogo.style.setProperty('--move-y', `${to.top + to.height / 2 - (from.top + from.height / 2)}px`)
            introLogo.style.setProperty('--move-scale', String(scale))
          }

          setIntroMoving(true)

          animationTimerRef.current = window.setTimeout(() => {
            setIntroVisible(false)
          }, 900)
        }, 450)
      }
    }, 105)

    return () => {
      window.clearInterval(typingTimerRef.current)
      window.clearTimeout(animationTimerRef.current)
    }
  }, [introVisible])

  const filteredTools = tools.filter((tool) =>
    `${tool.title} ${tool.description} ${tool.category}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  )

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (filteredTools.length === 1) {
      navigate(filteredTools[0].href)
    } else if (filteredTools.length > 1) {
      document.getElementById('tools')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="site-shell">
      {introVisible && (
        <div
          className={`intro-screen ${introMoving ? 'intro-screen--moving' : ''}`}
          aria-hidden="true"
        >
          <div className="intro-logo" ref={introLogoRef}>
            <span className="brand-mark intro-brand-mark">U</span>
            <span className="intro-brand-name">
              {typedLogo}
              {!introMoving && <span className="typing-caret" />}
            </span>
          </div>
        </div>
      )}
      <header className="site-header">
        <a className="brand" href="/" aria-label="UtilityHub home" ref={logoTargetRef}>
          <span className="brand-mark">U</span>
          <span>UtilityHub</span>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={22} />
        </button>

        <nav
          id="primary-navigation"
          className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#tools" onClick={() => setMobileMenuOpen(false)}>
            Tools
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>
            About
          </a>
        </nav>

        <div className="header-actions">
          <a
            className="icon-button header-search"
            href="#tool-search"
            aria-label="Search tools"
          >
            <Search size={19} />
          </a>
          <a className="button button-outline" href="#tools">
            Explore
          </a>
          <a className="button button-primary" href="#tools">
            Get Started <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-backdrop" aria-hidden="true" />
          <div className="hero-content">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              SIMPLE TOOLS. BIGGER POSSIBILITIES.
            </span>

            <h1>
              Utility tools
              <br />
              for a <span className="text-gradient">smarter you.</span>
            </h1>

            <p className="hero-description">
              A collection of powerful, privacy-conscious tools designed to
              make everyday tasks simpler and more productive.
            </p>

            <form
              className="tool-search"
              id="tool-search"
              role="search"
              onSubmit={handleSearch}
            >
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tools (e.g. JSON, text, GUID...)"
                aria-label="Search available tools"
              />
              <button
                type="submit"
                className="search-submit"
                aria-label="Find tools"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="hero-highlights">
              <div className="hero-highlight">
                <Zap className="highlight-icon accent-orange" size={27} />
                <div>
                  <strong>Free to use</strong>
                  <span>No hidden costs</span>
                </div>
              </div>
              <div className="hero-highlight">
                <ShieldCheck className="highlight-icon accent-green" size={27} />
                <div>
                  <strong>Privacy focused</strong>
                  <span>Browser-first processing</span>
                </div>
              </div>
              <div className="hero-highlight">
                <Sparkles className="highlight-icon accent-blue" size={27} />
                <div>
                  <strong>Always improving</strong>
                  <span>Useful tools, growing collection</span>
                </div>
              </div>
            </div>
          </div>

          <a className="hero-scroll" href="#tools" aria-label="Explore tools">
            <ArrowDownRight size={18} />
          </a>
        </section>

        <section className="section tools-section" id="tools">
          <div className="section-heading">
            <div>
              <span className="section-kicker">OUR TOOLS</span>
              <h2>
                Simple, powerful tools
                <br />
                for everyday tasks.
              </h2>
            </div>
            <p>
              Beautifully designed, easy-to-use utilities that help you get
              things done without unnecessary complexity.
            </p>
          </div>

          <div
            className="tool-grid"
            aria-live="polite"
            aria-relevant="additions removals"
          >
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon

              return (
                <a
                  className={`tool-card accent-${tool.accent}`}
                  href={tool.href}
                  key={tool.title}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="tool-card-top">
                    <span className="tool-icon">
                      <Icon size={29} strokeWidth={2.2} />
                    </span>
                    <span className="tool-category">
                      {toolCategories.find((category) => category.id === tool.category)?.label ?? tool.category}
                    </span>
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <span className="tool-card-arrow" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </a>
              )
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="empty-search">
              <Search size={25} />
              <h3>No matching tools yet</h3>
              <p>Try searching for JSON, text, GUID or developer tools.</p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
            </div>
          )}

          <div className="stats-bar">
            <div className="stat-item">
              <strong>4</strong>
              <span>Useful tools</span>
            </div>
            <div className="stat-item">
              <strong>Free</strong>
              <span>To get started</span>
            </div>
            <div className="stat-item stat-feature">
              <ShieldCheck size={27} className="accent-green" />
              <div>
                <strong>Privacy first</strong>
                <span>Browser-first by design</span>
              </div>
            </div>
            <div className="stat-item stat-feature">
              <Check size={27} className="accent-orange" />
              <div>
                <strong>Built for everyone</strong>
                <span>Simple and approachable</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WHY UTILITYHUB</span>
              <h2>
                A better way to get
                <br />
                things done.
              </h2>
            </div>
            <p>
              Useful tools should feel effortless. UtilityHub brings everyday
              utilities together in one clean, thoughtful experience.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article className="benefit-item" key={benefit.title}>
                  <span className={`benefit-icon accent-${benefit.accent}`}>
                    <Icon size={32} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="privacy-note">
            <div className="privacy-note-icon">
              <LockKeyhole size={21} />
            </div>
            <div>
              <strong>Your work stays yours.</strong>
              <p>
                Tools are designed to process data in your browser wherever
                practical. We aim to minimise unnecessary data collection.
              </p>
            </div>
            <span className="privacy-badge">PRIVACY MINDED</span>
          </div>
        </section>

        <section className="section audience-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">BUILT FOR EVERYONE</span>
              <h2>
                Small tasks.
                <br />
                Smoother workflows.
              </h2>
            </div>
            <p>
              Whether you write code, create content, study or simply need a
              quick utility, there is something here for you.
            </p>
          </div>

          <div className="audience-grid">
            {audiences.map((audience) => {
              const Icon = audience.icon

              return (
                <article
                  className={`audience-card accent-${audience.accent}`}
                  key={audience.title}
                >
                  <Icon size={27} />
                  <h3>{audience.title}</h3>
                  <p>{audience.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-copy">
            <span className="section-kicker">READY TO GET STARTED?</span>
            <h2>
              Make everyday tasks
              <br />
              <span className="text-gradient">a little simpler.</span>
            </h2>
            <p>
              Explore useful, easy-to-use tools designed to make your day
              smoother.
            </p>
          </div>
          <a className="button button-primary cta-button" href="#tools">
            Explore tools <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="/" aria-label="UtilityHub home">
              <span className="brand-mark">U</span>
              <span>UtilityHub</span>
            </a>
            <p>Simple, useful tools for everyday tasks.</p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#tools">Tools</a>
            <a href="#about">About</a>
          </div>

          <div className="footer-column">
            <h3>Project</h3>
            <a
              href="https://github.com/ccjd101-ai/utilityhub"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repository
            </a>
            <a href="#about">Our approach</a>
          </div>

          <div className="footer-column footer-social">
            <h3>Connect</h3>
            <div className="social-links">
              <a
                href="https://github.com/ccjd101-ai"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.66 2.02 3.7 1.53.1-.73.39-1.23.7-1.52-2.48-.28-5.1-1.24-5.1-5.52 0-1.22.43-2.22 1.16-3-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.44 3.04-1.14 3.04-1.14.61 1.55.23 2.69.12 2.98.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.23-5.12 5.51.4.35.75 1.02.75 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM8.1 18.9H5.15V9.4H8.1v9.5ZM6.63 8.1a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.27 10.8h-2.94v-4.62c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.78 1.2-1.78 2.44v4.7H9.7V9.4h2.82v1.3h.04c.4-.75 1.36-1.54 2.8-1.54 2.99 0 3.54 1.97 3.54 4.53v5.21Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} UtilityHub</span>
          <span>Thoughtfully made for everyday productivity.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
