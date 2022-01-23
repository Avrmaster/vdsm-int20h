import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
  InputAdornment,
  OutlinedInput,
  TextField,
  LinearProgress,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Jitsi from 'react-jitsi';
import useApi from './hooks/use-api'
import { useCallback } from 'react';
import { toast } from 'react-toastify'

function CircularIndeterminate() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3">Loading...</Typography>
      <CircularProgress />
    </Box>
  );
}

const Meeting = () => {
  const params = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const alias = params.alias ?? sessionStorage.getItem("meeting-alias");
  const [participants, setParticipants] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [jitsiMeetAPI, setJitsiMeetAPI] = useState(null);
  const [invite, setInvite] = useState(null);

  const isCreator = meetingInfo && meetingInfo.isCreator;

  useEffect(async () => {
    if (alias) {
      setMeetingInfo(await api.getInfoByAlias(alias));
    }
    else {
      toast.error('Can\'t join the meeting! Check the link or meeting id.');
      navigate('/');
    }
  }, [alias, setMeetingInfo, navigate, api]);
  const createInvite = async () => {
    setIsLoading(true);
    const response = await api.createInvite(meetingInfo.jwt);
    setInvite(window.location.origin + "/meeting/" + response.alias);
  };

  const addToClipBoard = () => {
    navigator.clipboard.writeText(invite).then(function () {
      toast.success('Copied the invitation to clipboard!')
    }, function (err) {
      toast.success('Could not copy');
    });
  };

  const kickParticipant = useCallback(
    (id) => {
      jitsiMeetAPI.executeCommand("kickParticipant", id);
    },
    [jitsiMeetAPI]
  );

  const hangUp = useCallback(() => {
    if (jitsiMeetAPI) jitsiMeetAPI.executeCommand("hangup");
    sessionStorage.removeItem("meeting-alias");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
  }, [jitsiMeetAPI, navigate]);

  useEffect(() => {
    if (!jitsiMeetAPI) return;

    const interval = setInterval(() => {
      const info = jitsiMeetAPI.getParticipantsInfo();
      setParticipants(info);
    }, 5000);

    return () => clearInterval(interval);
  }, [jitsiMeetAPI]);

  return (
    <Grid container component="main" sx={{ height: "100vh", display: "flex" }}>
      <Grid item xs={12} sm={8} md={9} sx={{ height: "100vh" }}>
        {meetingInfo ? (
          <Jitsi
            roomName={meetingInfo.roomName}
            jwt={meetingInfo.jwt}
            domain={"8x8.vc"}
            loadingComponent={CircularIndeterminate}
            containerStyle={{
              height: "100%",
              width: "100%",
            }}
            onAPILoad={(jitsiMeetAPI) => {
              jitsiMeetAPI.addListener("videoConferenceJoined", (profile) =>
                setMyProfile(profile)
              );
              setJitsiMeetAPI(jitsiMeetAPI);
            }}
            config={{
              userInfo: {
                email: "example@example.com",
                displayName: "John Doe",
              },
              requireDisplayName: true,
              prejoinPageEnabled: false,
              toolbarButtons: ["camera", "microphone", "desktop", "settings"],
            }}
          />
        ) : (
          <CircularIndeterminate />
        )}
      </Grid>
      {jitsiMeetAPI && (
        <Grid
          item
          xs={false}
          sm={4}
          md={3}
          component={Paper}
          elevation={3}
          square
        >
          <Box
            sx={{
              my: 0,
              mx: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
              Participants
            </Typography>
            <List
              dense
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {participants.map((participant) => (
                <ListItem
                  key={participant.participantId}
                  secondaryAction={
                    isCreator &&
                    !(
                      myProfile && myProfile.id === participant.participantId
                    ) ? (
                      <Tooltip title="Remove participant">
                        <IconButton
                          onClick={() =>
                            kickParticipant(participant.participantId)
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ backgroundColor: "black " }}
                      alt={`Avatar of ${participant.formattedDisplayName}`}
                      src={participant.avatarURL}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={participant.formattedDisplayName} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: "auto", mb: 2, width: "100%", textAlign: "center" }}>
              <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
                Options
              </Typography>
              <Stack direction="column">
                <TextField
                  id="outlined-name"
                  label="My name"
                  sx={{ m: 1 }}
                  value={myProfile?.displayName || ""}
                  onChange={(e) => {
                    if (jitsiMeetAPI) {
                      jitsiMeetAPI.executeCommand(
                        "displayName",
                        e.target.value
                      );
                    }
                    setMyProfile((p) => ({
                      ...p,
                      displayName: e.target.value,
                    }));
                  }}
                />
                {!invite && !isLoading && isCreator && (
                  <Button
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={createInvite}
                  >
                    Create invite link
                  </Button>
                )}
                {!invite && isLoading && isCreator && <LinearProgress />}
                {invite && (
                  <OutlinedInput
                    sx={{ m: 1 }}
                    type="text"
                    value={invite}
                    readOnly
                    disabled
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={addToClipBoard}>
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ m: 1 }}
                  onClick={hangUp}
                >
                  Leave meeting
                </Button>
              </Stack>
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Meeting;
