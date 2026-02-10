import { lazy, Suspense, useState } from 'react'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FileSelector from './components/FileSelector'
import ErrorMessageProvider from './components/ErrorMessageProvider'

const MarkdownViewer = lazy(() => import('./components/MarkdownViewer'))

export default function App() {
  const [content, setContent] = useState(null)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
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
          <MarkdownViewer content={content} />
        </Suspense>
      </Container>
    </>
  )
}
