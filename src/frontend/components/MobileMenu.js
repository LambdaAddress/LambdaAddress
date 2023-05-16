import styled from '@emotion/styled'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

const MENU_ITEMS = [
    { name: 'Home', link: '#/'},
    { name: 'Mint', link: '#/mint'},
    { name: 'My Addresses', link: '#/addresses'}
]

export default function MobileMenu({ isOpen, onClose }) {
    return (
        <Main
            anchor='right'
            open={isOpen}
            onClose={onClose}
            onOpen={() => {}}
        >
            <List>
                {MENU_ITEMS.map((menuItem,i) => (
                <ListItem key={i} disablePadding>
                    <ListItemButton component="a" href={menuItem.link}>
                    <ListItemText primary={menuItem.name} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Main>
    )
}

const Main = styled(SwipeableDrawer)({
    '.MuiPaper-root': {
        minWidth: 280,
        color: 'white',
        textAlign: 'left',
        backgroundColor: `rgba(48,39,84,0.6)`,
        paddingTop: 18,
        paddingLeft: 18
    }
})