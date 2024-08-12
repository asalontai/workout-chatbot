"use client"

import React, { useState, useEffect, } from 'react';
import { auth } from "@/firebase";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { marked } from 'marked';
import Navbar from '../components/Navbar';
import FacebookCircularProgress from '../components/FacebookCircularProgress';
import Footer from '../components/Footer';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `
        <p>Hello!</p>
        <p>I'm your dedicated fitness coach, here to help you crush your fitness goals.</p>
        <p>Whether you're looking for workout tips, diet advice, or just some motivation, I'm here to guide you.</p>
        <p>How can we kickstart your fitness journey today?</p>
      `,
  }]);

  console.log(messages);

  const [message, setMessage] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') {
      return; 
    }

    const newMessage = { role: "user", content: message };

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);

    setMessage("");
    setIsLoading(true)

    const response = await fetch('http://localhost:8080/api/generate', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, newMessage]),
    });

    setIsLoading(false);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let accumulatedText = '';
    const processText = async ({ done, value }) => {
      if (done) {
        const formattedResponse = marked(accumulatedText); 
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: formattedResponse,
            },
          ];
        });
        return;
      }
      accumulatedText += decoder.decode(value, { stream: true });
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: marked(accumulatedText),
          },
        ];
      });
      reader.read().then(processText);
    };

    reader.read().then(processText);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <Navbar />
      <Box 
        width={"100vw"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={4}
      >
        <Stack
          direction={"column"}
          width={"1000px"}
          height={"670px"}
          spacing={3}
          bgcolor={"#212122"}
          color={"white"}
          borderRadius={"8px 8px 8px 8px"}
          sx={{
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
          }}
        >
          <Box
            height={"60px"}
            display={"flex"}
            alignItems={"center"}
            bgcolor={"#007BFF"}
            justifyContent={"center"}
            borderRadius={"6px 6px 0 0"}
          >
            <Typography variant='h4' sx={{ fontWeight: "bold" }}>
              WorkoutAI Bot
            </Typography>
          </Box>
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            maxHeight={"475px"}
            sx={{
              '& .message': {
                marginBottom: '16px',
                borderRadius: '8px',
                wordBreak: 'break-word'
              }
            }}
          >
            {
              messages.map((msg, index) => (
                <Box key={index} display={"flex"} justifyContent={
                  msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                }>
                  <Box
                    bgcolor={
                      msg.role === 'assistant' ? '#007BFF' : '#5A9BD4'
                    }
                    color={"white"}
                    borderRadius={6}
                    maxWidth={"575px"}
                    p={2}
                    marginRight={"25px"}
                    marginLeft={"25px"}
                    sx={{
                      '& ol': {
                        marginLeft: '5px',
                        marginTop: '10px',
                        marginBottom: '10px'
                      },
                      '& li': {
                        marginBottom: '10px',
                        marginTop: '10px',
                        marginLeft: "28px"
                      },
                      '& p': {
                        marginBottom: '10px',
                        marginTop: '10px',
                        marginLeft: "10px",
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    {index === messages.length - 1 && isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <FacebookCircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ '& br': { marginTop: "10px", marginBottom: "10px" }}} dangerouslySetInnerHTML={{ __html: msg.content }} />
                    )}
                  </Box>
                </Box>
              ))
            }
          </Stack>
          <Stack 
            direction={"row"} 
            spacing={2}
            padding={2}
            bgcolor={"#2D2D2D"}
          >
            <TextField
              label="Message"
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                    color: "white",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "white",
                    },
                    "&:hover fieldset": {
                        borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "white",
                    },
                    "& input": {
                        color: "white",
                    },
                },
                "& .MuiInputLabel-outlined": {
                    color: "white",
                    "&.Mui-focused": {
                        color: "white",
                    },
                },
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              sx={{
                width: "90px",
                bgcolor: "#007BFF",
                '&:hover': {
                    backgroundColor: '#66B2FF',
                },
                
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
}
