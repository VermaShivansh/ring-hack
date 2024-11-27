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
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { ReactComponent as RingoverLogo } from "./ringover_logo.svg";
import { app as firebaseApp, requestForToken } from "./firebase";
import { useTheme } from "@mui/material/styles";

import {
  PLATFORMS,
  NOTIFICATION_TYPES_LABEL,
  PLATFORMS_LABEL,
} from "./utils/enums";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Disabled fields permanently
const permanentlyDisabledFields = ["desktop_mac", "desktop_win", "push_ios"];
const permanentlyDisabledPlatform = [
  "empower",
  "web_app",
  "android_app",
  "ios_app",
];

function getStyles(platform, platformTypes, theme) {
  return {
    fontWeight: platformTypes.includes(platform)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

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
  const theme = useTheme();
  const [platformTypes, setPlatformTypes] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);

  const handleChangePlatform = (event) => {
    const value = event.target.value;
    if (value.includes("all")) {
      setPlatformTypes(["all"]);
    } else {
      setPlatformTypes(value.filter((v) => v !== "all"));
    }
  };

  const handleChangeNotificationTypes = (event) => {
    const value = event.target.value;
    if (value.includes("all")) {
      setNotificationTypes(["all"]);
    } else {
      setNotificationTypes(value.filter((v) => v !== "all"));
    }
  };

  // Check if a field should be disabled
  const isFieldDisabledPlatform = (field) => {
    if (permanentlyDisabledPlatform.includes(field)) return true;
    if (platformTypes.includes("all") && field !== "all") return true;
    return false;
  };

  const isFieldDisabledNotification = (field) => {
    if (permanentlyDisabledFields.includes(field)) return true;
    if (notificationTypes.includes("all") && field !== "all") return true;
    return false;
  };

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
    setPlatformTypes([]);
    setNotificationTypes([]);

    const reqBody = {
      event: type,
      message: notifMsg,
      platforms: platformTypes,
      notification_types: notificationTypes,
    };
    console.log("reqBody-->", reqBody);
    try {
      const res = await axios.post(
        "https://bb8c-103-62-93-142.ngrok-free.app/notification",
        reqBody
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
    // window.RingoverSDK.connect("https://bb8c-103-62-93-142.ngrok-free.app");
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
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="multiple-chip-label">Platform</InputLabel>
          <Select
            labelId="multiple-chip-label"
            id="multiple-chip"
            multiple
            value={platformTypes}
            onChange={handleChangePlatform}
            input={<OutlinedInput id="select-multiple-chip" label="Platform" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={PLATFORMS_LABEL[value]} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(PLATFORMS_LABEL).map(([key, label]) => (
              <MenuItem
                key={key}
                value={key}
                style={getStyles(key, platformTypes, theme)}
                disabled={isFieldDisabledPlatform(key)}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <InputLabel id="notification-label">Notification Types</InputLabel>
          <Select
            labelId="notification-label"
            id="notification"
            multiple
            value={notificationTypes}
            onChange={handleChangeNotificationTypes}
            input={
              <OutlinedInput id="notification" label="Notification Types" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={NOTIFICATION_TYPES_LABEL[value]} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(NOTIFICATION_TYPES_LABEL).map(([key, label]) => (
              <MenuItem
                key={key}
                value={key}
                style={getStyles(key, notificationTypes, theme)}
                disabled={isFieldDisabledNotification(key)}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
