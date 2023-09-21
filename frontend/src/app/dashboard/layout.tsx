'use client';

import { useToggle } from '@/hooks/useToggle';

import Menu from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';

import { ContainerWrapper, MainWrapper, Navigation, Toggle, TopBar } from './layoutStyle';
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from '@mui/material';
import { useState } from 'react';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [toggle, setToggle] = useToggle(false);

    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <ContainerWrapper>
            <Navigation $toggle={toggle}>
                {/* <ul> */}
                {/* {navlist.map(({ id, title, icon, url }) => (
                        <NavList key={id}>
                            <NavItemLink href={`${url}`}>
                                <NavIconLine>{icon}</NavIconLine>
                                <Title>{title}</Title>
                            </NavItemLink>
                        </NavList>
                    ))} */}
                <List
                    sx={{ width: '100%', maxWidth: 360 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader
                            sx={{
                                bgcolor: '#363636',
                                ':hover': {
                                    bgcolor: '#fff',
                                    color: 'black',
                                },
                                color: 'white',
                            }}
                            component="div"
                            id="nested-list-subheader"
                        >
                            로고
                        </ListSubheader>
                    }
                >
                    <ListItemButton
                        sx={{
                            bgcolor: '#363636',
                            ':hover': {
                                bgcolor: '#fff',
                                color: 'black',
                            },
                            color: 'white',
                        }}
                    >
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sent mail" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{
                            bgcolor: '#363636',
                            ':hover': {
                                bgcolor: '#fff',
                                color: 'black',
                            },
                            color: 'white',
                        }}
                    >
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>
                    <ListItemButton
                        sx={{
                            bgcolor: '#363636',
                            ':hover': {
                                bgcolor: '#fff',
                                color: 'black',
                            },
                            color: 'white',
                        }}
                        onClick={handleClick}
                    >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    bgcolor: '#363636',
                                    ':hover': {
                                        bgcolor: '#fff',
                                        color: 'black',
                                    },
                                    color: 'white',
                                    pl: 4,
                                }}
                            >
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                {/* </ul> */}
            </Navigation>
            <MainWrapper $toggle={toggle}>
                <TopBar>
                    <Toggle onClick={setToggle} $toggle={toggle}>
                        <Menu />
                    </Toggle>
                </TopBar>
                <main style={{ margin: 30 }}>{children}</main>
            </MainWrapper>
        </ContainerWrapper>
    );
}
