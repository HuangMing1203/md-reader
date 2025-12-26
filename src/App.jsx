import { lazy, Suspense, useState } from 'react'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import FileSelector from './components/FileSelector'
import ErrorMessageProvider from './components/ErrorMessageProvider'

const MarkdownViewer = lazy(() => import('./components/MarkdownViewer'))

export default function App() {
  const [content, setContent] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
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
          <FileSelector
            placeholder="Markdown file URL or upload"
            accept="text/markdown,text/plain,.md,.markdown"
            onSubmit={(blob) => setContent(blob)}
          />
        </ErrorMessageProvider>

        <Suspense>
          <MarkdownViewer
            content={content}
            drawerOpen={drawerOpen}
            onDrawerClose={() => setDrawerOpen(false)}
          />
        </Suspense>
      </Container>
    </>
  )
}
