import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CircularProgress from '@mui/material/CircularProgress'

export default function Upload({ worker, onProgress }) {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setLoading(true)
    onProgress?.(0)

    // stream file to the worker to avoid blocking main thread
    const reader = file.stream().getReader()
    const decoder = new TextDecoder()
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      received += value.length
      const pct = Math.min(100, Math.round((received / file.size) * 100))
      onProgress?.(pct)
      worker?.postMessage({ type: 'chunk', text: chunk })
    }

    worker?.postMessage({ type: 'done' })
    setLoading(false)
    onProgress?.(100)
  }

  const onSelect = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".md,text/markdown,text/plain"
        style={{ display: 'none' }}
        onChange={onSelect}
      />
      <Button
        color="inherit"
        startIcon={<CloudUploadIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        Upload
      </Button>
      {loading && <CircularProgress color="inherit" size={20} sx={{ ml: 1 }} />}
    </div>
  )
}
