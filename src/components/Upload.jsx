import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CircularProgress from '@mui/material/CircularProgress'
import { processFile } from '../lib/markdown'

export default function Upload({ onProgress, onToc, onHtml }) {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setLoading(true)
    onProgress?.(0)
    // process file on main thread (streamed), using shared markdown processor
    await processFile(file, {
      onToc,
      onHtml,
      onProgress,
    })
    setLoading(false)
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
