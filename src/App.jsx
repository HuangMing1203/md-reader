import { useState } from 'react'
import { useErrorMessage } from './components/ErrorMessageProvider'
import { processFile } from './utils/markdown'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import FileSelector from './components/FileSelector'
import MarkdownViewer from './components/MarkdownViewer'
import TocDrawer from './components/TocDrawer'
import ErrorMessageProvider from './components/ErrorMessageProvider'

function MarkdownFileSelector({ setToc, setHtml, setProgress }) {
  const setError = useErrorMessage()

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
      console.error(err)
      setError('Failed to process the markdown file.')
    }
  }

  return (
    <FileSelector
      placeholder="Markdown file URL or upload"
      accept="text/markdown,text/plain,.md,.markdown"
      onSubmit={handleFileSubmit}
    />
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState([])
  const [progress, setProgress] = useState(0)

  const handleToggleDrawer = () => setDrawerOpen((s) => !s)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleToggleDrawer}
            aria-label="menu"
            sx={{ ml: -1, mr: 1 }}
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
        <ErrorMessageProvider>
          <MarkdownFileSelector
            setHtml={setHtml}
            setToc={setToc}
            setProgress={setProgress}
          />
        </ErrorMessageProvider>

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
