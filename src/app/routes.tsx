import { lazy, Suspense } from 'react'
import { Link, Navigate, useLocation, useRoutes } from 'react-router'
import { getToolByPath, tools } from '../tools/registry'
import ToolLayout from '../components/layout/ToolLayout'
import NotFoundPage from '../pages/NotFoundPage'
import App from '../App'
import GuidGeneratorPage from '../pages/GuidGeneratorPage'
import JsonDiffPage from '../pages/JsonDiffPage'
import JsonFormatterPage from '../pages/JsonFormatterPage'
import TextFormatterPage from '../pages/TextFormatterPage'

const Base64Page = lazy(() => import('../pages/Base64Page'))
const CsvJsonPage = lazy(() => import('../pages/CsvJsonPage'))
const JwtDecoderPage = lazy(() => import('../pages/JwtDecoderPage'))
const RegexTesterPage = lazy(() => import('../pages/RegexTesterPage'))
const SqlFormatterPage = lazy(() => import('../pages/SqlFormatterPage'))
const UrlCodecPage = lazy(() => import('../pages/UrlCodecPage'))
const YamlJsonPage = lazy(() => import('../pages/YamlJsonPage'))
const TextCounterPage = lazy(() => import('../pages/TextCounterPage'))
const PlainTextDiffPage = lazy(() => import('../pages/PlainTextDiffPage'))
const MarkdownPreviewPage = lazy(() => import('../pages/MarkdownPreviewPage'))
const SlugGeneratorPage = lazy(() => import('../pages/SlugGeneratorPage'))
const LineToolsPage = lazy(() => import('../pages/LineToolsPage'))
const UnixTimestampPage = lazy(() => import('../pages/UnixTimestampPage'))
const TimeZoneConverterPage = lazy(() => import('../pages/TimeZoneConverterPage'))
const DateDifferencePage = lazy(() => import('../pages/DateDifferencePage'))
const DateTimeFormatPage = lazy(() => import('../pages/DateTimeFormatPage'))
const PasswordGeneratorPage = lazy(() => import('../pages/PasswordGeneratorPage'))
const Sha256Page = lazy(() => import('../pages/Sha256Page'))
const UuidValidatorPage = lazy(() => import('../pages/UuidValidatorPage'))
const ColorConverterPage = lazy(() => import('../pages/ColorConverterPage'))
const ContrastCheckerPage = lazy(() => import('../pages/ContrastCheckerPage'))
const QrCodeGeneratorPage = lazy(() => import('../pages/QrCodeGeneratorPage'))
const ImageCompressorPage = lazy(() => import('../pages/ImageCompressorPage'))
const PercentageCalculatorPage = lazy(() => import('../pages/PercentageCalculatorPage'))
const UnitConverterPage = lazy(() => import('../pages/UnitConverterPage'))
const TipCalculatorPage = lazy(() => import('../pages/TipCalculatorPage'))

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
      element:
        tool.href === '/tools/base64' ? (
          <Base64Page />
        ) : tool.href === '/tools/url-codec' ? (
          <UrlCodecPage />
        ) : tool.href === '/tools/jwt-decoder' ? (
          <JwtDecoderPage />
        ) : tool.href === '/tools/regex-tester' ? (
          <RegexTesterPage />
        ) : tool.href === '/tools/sql-formatter' ? (
          <SqlFormatterPage />
        ) : tool.href === '/tools/csv-json' ? (
          <CsvJsonPage />
        ) : tool.href === '/tools/yaml-json' ? (
          <YamlJsonPage />
        ) : tool.href === '/tools/text-counter' ? (
          <TextCounterPage />
        ) : tool.href === '/tools/plain-text-diff' ? (
          <PlainTextDiffPage />
        ) : tool.href === '/tools/markdown-preview' ? (
          <MarkdownPreviewPage />
        ) : tool.href === '/tools/slug-generator' ? (
          <SlugGeneratorPage />
        ) : tool.href === '/tools/line-tools' ? (
          <LineToolsPage />
        ) : tool.href === '/tools/unix-timestamp' ? (
          <UnixTimestampPage />
        ) : tool.href === '/tools/time-zone-converter' ? (
          <TimeZoneConverterPage />
        ) : tool.href === '/tools/date-difference' ? (
          <DateDifferencePage />
        ) : tool.href === '/tools/datetime-format' ? (
          <DateTimeFormatPage />
        ) : tool.href === '/tools/password-generator' ? (
          <PasswordGeneratorPage />
        ) : tool.href === '/tools/sha256' ? (
          <Sha256Page />
        ) : tool.href === '/tools/uuid-validator' ? (
          <UuidValidatorPage />
        ) : tool.href === '/tools/text-formatter' ? (
          <TextFormatterPage />
        ) : tool.href === '/tools/json-diff' ? (
          <JsonDiffPage />
        ) : tool.href === '/tools/json-formatter' ? (
          <JsonFormatterPage />
        ) : tool.href === '/tools/guid-generator' ? (
          <GuidGeneratorPage />
        ) : tool.href === '/tools/color-converter' ? (
          <ColorConverterPage />
        ) : tool.href === '/tools/contrast-checker' ? (
          <ContrastCheckerPage />
        ) : tool.href === '/tools/qr-code-generator' ? (
          <QrCodeGeneratorPage />
        ) : tool.href === '/tools/image-compressor' ? (
          <ImageCompressorPage />
        ) : tool.href === '/tools/percentage-calculator' ? (
          <PercentageCalculatorPage />
        ) : tool.href === '/tools/unit-converter' ? (
          <UnitConverterPage />
        ) : tool.href === '/tools/tip-calculator' ? (
          <TipCalculatorPage />
        ) : (
          <ToolPlaceholder />
        ),
    })),
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ])

  return (
    <Suspense
      fallback={
        <div className="tool-loading" role="status" aria-live="polite">
          Loading utility…
        </div>
      }
    >
      {routes ?? <Navigate to="/" replace />}
    </Suspense>
  )
}

export default AppRoutes
