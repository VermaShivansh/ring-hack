import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import axios from "axios";
import { ReactComponent as RingoverLogo } from "./ringover_logo.svg";
import { app as firebaseApp, requestForToken } from "./firebase";

const App = () => {
  const [loading, setLoading] = useState({
    sms: false,
    email: false,
    call: false,
    tag: false,
  });
  const [type, setType] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [notifMsg, setNotifMsg] = useState("");

  // Handler for input changes
  const handleChange = (event) => {
    setNotifMsg(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading({
      sms: type === "sms" ? true : false,
      email: type === "email" ? true : false,
      call: type === "call" ? true : false,
      tag: type === "tag" ? true : false,
    });
    setResponse(null);
    setError("");
    setNotifMsg("");
    setType("");

    try {
      const res = await axios.post(
        "https://0b2f-103-234-156-55.ngrok-free.app/notification",
        {
          event: type,
          message: notifMsg,
        }
      );
      setResponse(res.data.message || "Success!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Notification.permission === "granted") {
      // You can show notifications
      console.log("notification permission given");
    } else if (Notification.permission !== "denied") {
      console.log("notif permission not given");
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission granted
        }
      });
    }
  }, []);

  useEffect(() => {
    // window.RingoverSDK.connect("https://0b2f-103-234-156-55.ngrok-free.app");
    requestForToken();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <RingoverLogo />
      <br />
      <Typography variant="h4" gutterBottom>
        Ringover Client
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 400,
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="event_msg">Event Message</InputLabel>
          <Input
            id="event_msg"
            value={notifMsg}
            onChange={handleChange}
            required
            placeholder="Enter the event message"
          />
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => setType("sms")}
          disabled={loading?.sms ?? false}
          type="submit"
        >
          {loading?.sms ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "SMS Event"
          )}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => setType("email")}
          type="submit"
          disabled={loading?.email ?? false}
        >
          {loading?.email ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Email Event"
          )}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => setType("call")}
          type="submit"
          disabled={loading?.call ?? false}
        >
          {loading?.call ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Call Event"
          )}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
          disabled={loading?.tag ?? false}
          onClick={() => setType("tag")}
          type="submit"
        >
          {loading?.tag ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Tag Event"
          )}
        </Button>
      </Box>
      {response && (
        <Alert severity="success" sx={{ mt: 2, width: 400 }}>
          {response}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: 400 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default App;
