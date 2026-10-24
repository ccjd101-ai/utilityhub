import { useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'

function QrCodeGeneratorPage() {
  const [value, setValue] = useState('https://utilityhub.app')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  async function generate() {
    if (!value.trim()) { setError(true); setMessage('Enter text or a URL to create a QR code.'); return }
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      await QRCode.toCanvas(canvas, value.trim(), { width: 280, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#ffffff' } })
      setError(false); setMessage('QR code generated. You can download the PNG below.')
    } catch {
      setError(true); setMessage('Could not generate a QR code. Try shorter text.')
    }
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'utilityhub-qr-code.png'
    link.click()
    setMessage('QR code downloaded as PNG.')
  }

  return <ToolLayout title="QR Code Generator" description="Generate a downloadable QR code from a URL or plain text. Your content is encoded locally in your browser.">
    <div className="data-tool qr-tool">
      <label className="qr-input-label" htmlFor="qr-content">Text or URL</label>
      <textarea id="qr-content" className="tool-textarea" value={value} onChange={(event) => { setValue(event.target.value); setMessage('') }} placeholder="Enter a URL or text…" rows={4} maxLength={2000} />
      <div className="qr-character-count">{value.length} / 2,000 characters</div>
      <div className="data-tool-actions"><ActionButton variant="primary" onClick={() => void generate()}><QrCode size={16} aria-hidden="true" />Generate QR code</ActionButton><ActionButton onClick={download} disabled={!message.startsWith('QR code generated')}><Download size={16} aria-hidden="true" />Download PNG</ActionButton></div>
      <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>
      <div className="qr-canvas-wrap" aria-label="Generated QR code preview">{!message.startsWith('QR code generated') && <span className="qr-empty"><QrCode size={30} aria-hidden="true" />Your QR code preview will appear here.</span>}<canvas ref={canvasRef} className={message.startsWith('QR code generated') ? 'is-visible' : ''} aria-label="Generated QR code" />
      </div>
    </div>
  </ToolLayout>
}

export default QrCodeGeneratorPage
