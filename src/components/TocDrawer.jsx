import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

export default function TocDrawer({ open, onClose, toc = [] }) {
  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    onClose?.()
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <div style={{ width: 280, padding: 12 }} role="presentation">
        <Typography variant="h6" sx={{ mb: 1 }}>Table of Contents</Typography>
        <List>
          {toc.map((item, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemButton onClick={() => handleClick(item.id)} sx={{ pl: Math.min(4, (item.level - 1) * 2) }}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}
