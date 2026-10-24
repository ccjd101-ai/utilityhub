import { useEffect, useMemo, useState } from 'react'
import { Download, ImageDown, Upload } from 'lucide-react'
import ToolLayout from '../components/layout/ToolLayout'
import ActionButton from '../components/ui/ActionButton'
import { formatBytes, outputFileName, resizedDimensions, type ImageOutputType } from '../tools/imageProcessing'

const supportedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 20 * 1024 * 1024

function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [maxEdge, setMaxEdge] = useState(1600)
  const [quality, setQuality] = useState(0.82)
  const [outputType, setOutputType] = useState<ImageOutputType>('image/webp')
  const [result, setResult] = useState<Blob | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [message, setMessage] = useState('Choose an image to get started. Files are processed locally in your browser.')
  const [error, setError] = useState(false)

  const sourceUrl = useMemo(() => file ? URL.createObjectURL(file) : '', [file])
  const resultUrl = useMemo(() => result ? URL.createObjectURL(result) : '', [result])
  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl) }, [sourceUrl])
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl) }, [resultUrl])

  function chooseFile(nextFile?: File) {
    setResult(null); setDimensions(null); setError(false)
    if (!nextFile) return
    if (!supportedTypes.includes(nextFile.type)) {
      setFile(null); setError(true); setMessage('Choose a PNG, JPEG, or WebP image.')
      return
    }
    if (nextFile.size > maxFileSize) {
      setFile(null); setError(true); setMessage('Choose an image smaller than 20 MB.')
      return
    }
    setFile(nextFile); setMessage('Image loaded. Adjust the options and optimize it when ready.')
  }

  async function optimize() {
    if (!file) return
    setError(false); setMessage('Optimizing image…')
    try {
      const bitmap = await createImageBitmap(file)
      const outputSize = resizedDimensions(bitmap.width, bitmap.height, maxEdge)
      const canvas = document.createElement('canvas')
      canvas.width = outputSize.width; canvas.height = outputSize.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Your browser could not prepare the image canvas.')
      if (outputType === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      bitmap.close()
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((output) => output ? resolve(output) : reject(new Error('Image encoding failed. Try another format.')), outputType, outputType === 'image/png' ? undefined : quality)
      })
      if (blob.type !== outputType) throw new Error(`This browser cannot export ${outputType.replace('image/', '').toUpperCase()}. Try PNG or JPEG.`)
      setResult(blob); setDimensions(outputSize)
      const change = file.size > 0 ? Math.round((1 - blob.size / file.size) * 100) : 0
      setMessage(`${formatBytes(file.size)} → ${formatBytes(blob.size)} (${change >= 0 ? `${change}% smaller` : `${Math.abs(change)}% larger`}).`)
    } catch (reason) {
      setError(true); setMessage(reason instanceof Error ? reason.message : 'Unable to process this image.')
    }
  }

  function download() {
    if (!result || !file) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = outputFileName(file.name, outputType)
    link.click()
  }

  return <ToolLayout title="Image Compressor & Resizer" description="Resize and compress PNG, JPEG, or WebP images locally in your browser. Your images are never uploaded.">
    <div className="data-tool image-compressor-tool">
      <label className="image-upload" htmlFor="image-compressor-file">
        <Upload size={25} aria-hidden="true" />
        <strong>{file ? file.name : 'Choose an image'}</strong>
        <span>PNG, JPEG, or WebP · up to 20 MB</span>
        <input id="image-compressor-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} />
      </label>

      <div className="image-options">
        <label htmlFor="image-max-edge">Maximum dimension <strong>{maxEdge}px</strong>
          <input id="image-max-edge" type="range" min="320" max="4096" step="160" value={maxEdge} onChange={(event) => setMaxEdge(Number(event.target.value))} />
        </label>
        <label htmlFor="image-format">Output format
          <select id="image-format" value={outputType} onChange={(event) => setOutputType(event.target.value as ImageOutputType)}>
            <option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option>
          </select>
        </label>
        <label htmlFor="image-quality">Quality <strong>{Math.round(quality * 100)}%</strong>
          <input id="image-quality" type="range" min="0.4" max="1" step="0.01" value={quality} disabled={outputType === 'image/png'} onChange={(event) => setQuality(Number(event.target.value))} />
        </label>
      </div>

      <div className="data-tool-actions">
        <ActionButton variant="primary" onClick={() => void optimize()} disabled={!file}><ImageDown size={16} aria-hidden="true" />Optimize image</ActionButton>
        <ActionButton onClick={download} disabled={!result}><Download size={16} aria-hidden="true" />Download optimized image</ActionButton>
      </div>
      <p className={`data-tool-status${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'}>{message}</p>

      {file && <div className="image-previews">
        <figure><figcaption>Original · {formatBytes(file.size)}</figcaption><img src={sourceUrl} alt={`Original image: ${file.name}`} /></figure>
        {result && dimensions && <figure><figcaption>Optimized · {dimensions.width} × {dimensions.height} · {formatBytes(result.size)}</figcaption><img src={resultUrl} alt={`Optimized image: ${file.name}`} /></figure>}
      </div>}
      {outputType === 'image/jpeg' && <p className="data-tool-status">JPEG does not support transparency; transparent areas will be filled with white.</p>}
    </div>
  </ToolLayout>
}

export default ImageCompressorPage
