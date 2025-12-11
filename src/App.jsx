import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Alert,
  IconButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import FileSelector from './components/FileSelector'
import MarkdownViewer from './components/MarkdownViewer'
import TocDrawer from './components/TocDrawer'
import { processFile } from './lib/markdown'

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleToggleDrawer = () => setDrawerOpen((s) => !s)

  const handleFileSubmit = async (blob, url, source) => {
    setError('')
    setHtml('')
    setToc([])
    setProgress(0)
    try {
      await processFile(blob, {
        onProgress: setProgress,
        onToc: setToc,
        onHtml: ({ html, toc }) => {
          setHtml(html)
          setToc(toc)
        },
      })
    } catch (err) {
      setError('Failed to process the markdown file.')
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleToggleDrawer}
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MD Reader
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ my: 4, display: 'flex', flexFlow: 'nowrap column', gap: 3 }}
      >
        <FileSelector
          placeholder="Markdown file URL or upload"
          accept="text/markdown,text/plain,.md,.markdown"
          onSubmit={handleFileSubmit}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <MarkdownViewer html={html} progress={progress} />

        <TocDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          toc={toc}
        />
      </Container>
    </>
  )
}
