import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

export default function TocDrawer({ open, onClose, toc = [], width = 280 }) {
  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (onClose) onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width,
        '& .MuiDrawer-paper': { width },
      }}
    >
      <Typography variant="h6" sx={{ mx: 2, my: 1 }}>
        Table of Contents
      </Typography>
      <List>
        {toc.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton
              onClick={() => handleClick(item.id)}
              sx={{ pl: Math.min(4, item.level) * 2 }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
