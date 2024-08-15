import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Logo from "../../public/Logo.png"
import Image from 'next/image';

const NavbarLanding = ({ show }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#2D2D2D',
        boxShadow: 'none', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1201,
        opacity: 0.8,
        transition: 'transform 0.3s ease', 
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <Toolbar>
        <Image 
            src={Logo}
            width={200}
            alt="HeadStarter Logo"
            className="pointer"
        />
        <Button color="inherit" href='/'>Home</Button>
        <Button color="inherit">About Us</Button>
        <Button color="inherit" href='/sign-in'>Login</Button>
        <Button color="inherit" href='/sign-up'>Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarLanding;
