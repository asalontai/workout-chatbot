"use client"

import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      color={"white"}
    >
      <Navbar />

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={4}
        textAlign="center"
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            Welcome to WorkoutAI
          </Typography>
          <Typography variant="h5" paragraph>
            Your personal fitness coach, available 24/7. Get workout tips, diet advice, and motivation to achieve your fitness goals.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleSignUp}
            sx={{ 
              marginTop: 2,
              bgcolor: "#007BFF",
              '&:hover': {
                    backgroundColor: '#66B2FF',
              }, 
            }}
          >
            Sign Up
          </Button>
        </Container>

        <Box
          marginTop={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h6" gutterBottom>
            Key Features:
          </Typography>
          <Typography variant="body1" paragraph>
            - Personalized workout plans
          </Typography>
          <Typography variant="body1" paragraph>
            - Nutritional advice tailored to your needs
          </Typography>
          <Typography variant="body1" paragraph>
            - 24/7 support and motivation
          </Typography>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
