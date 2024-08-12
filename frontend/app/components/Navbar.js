"use client"

import { auth } from "@/firebase";
import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WorkoutAI from "@/public/WorkoutAI Logo.png"
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth).then(() => {
      router.push("/");
    });
  };

  const handleMain = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <AppBar position="static">
      <Toolbar 
        sx={{
            backgroundColor: "#007BFF",
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
            height: "40px"
        }}
      >
        <Image 
            src={WorkoutAI}
            width={200}
            alt="HeadStarter Logo"
            className="pointer"
            onClick={handleMain}
        />
        {user ? (
          <Box
            display={"flex"}
            gap={3}
            marginLeft={"auto"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="p">{user.email}</Typography>
            <Button variant="contained" onClick={handleSignOut} sx={{ bgcolor: "white", color: "black", '&:hover': { bgcolor: "#d3d3d3" } }}>
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box
            display={"flex"}
            gap={3}
            marginLeft={"auto"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Button variant="contained" onClick={handleSignIn} sx={{ bgcolor: "white", color: "black", '&:hover': { bgcolor: "#d3d3d3" } }}>
              Sign In
            </Button>
            <Button variant="contained" onClick={handleSignUp} sx={{ bgcolor: "white", color: "black", '&:hover': { bgcolor: "#d3d3d3" } }}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
