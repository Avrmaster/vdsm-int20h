import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Jitsi from 'react-jitsi';
import useApi from './hooks/use-api'
import { useCallback } from 'react';

function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h3">Loading...</Typography>
      <CircularProgress />
    </Box>
  );
}


const Meeting = () => {
  const params = useParams();
  const api = useApi();
  const [searchParams] = useSearchParams();
  const jwt = searchParams.jwt ?? sessionStorage.getItem('jwt')
  const [participants, setParticipants] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [jitsiMeetAPI, setJitsiMeetAPI] = useState(null);
  const [invite, setInvite] = useState(null);

  const createInvite = async () => {
    const response = await api.createInvite(jwt);
    setInvite(window.location.origin + '/meeting/' + encodeURIComponent(response.roomName) + '?jwt=' + response.jwt)
  }

  const addToClipBoard = () => {
    navigator.clipboard.writeText(invite).then(function () {
      console.log('Copying to clipboard was successful!');
    }, function (err) {
      console.error('Could not copy text: ', err);
    });
  }

  const kickParticipant = useCallback((id) => {
    jitsiMeetAPI.executeCommand('kickParticipant', id)
  }, [jitsiMeetAPI]);

  const hangUp = useCallback(() => {
    if (jitsiMeetAPI)
      jitsiMeetAPI.executeCommand('hangup');
  }, [jitsiMeetAPI]);

  useEffect(() => {
    if (!jitsiMeetAPI)
      return;

    const interval = setInterval(() => {
      const info = jitsiMeetAPI.getParticipantsInfo();
      setParticipants(info)
    }, 5000);

    return () => clearInterval(interval)
  }, [jitsiMeetAPI]);

  return (
    <Grid container component="main" sx={{ height: '100vh', display: 'flex' }}>
      <Grid item xs={12} sm={8} md={9} sx={{ height: '100vh' }}
      >
        <Jitsi
          roomName={decodeURIComponent(params.roomName)}
          jwt={jwt} domain={'8x8.vc'}
          loadingComponent={CircularIndeterminate}
          containerStyle={{
            height: '100%',
            width: '100%'
          }}
          onAPILoad={jitsiMeetAPI => {
            jitsiMeetAPI.addListener('videoConferenceJoined', (profile) => setMyProfile(profile));
            setJitsiMeetAPI(jitsiMeetAPI);
          }}
          config={
            {
              userInfo: {
                email: "example@example.com",
                displayName: "John Doe"
              },
              requireDisplayName: true,
              prejoinPageEnabled: false,
              toolbarButtons: [
                'camera',
                'microphone',
                'desktop',
                'settings',
              ]
            }
          }
        />
      </Grid>
      {jitsiMeetAPI &&
        <Grid item xs={false} sm={4} md={3} component={Paper} elevation={3} square>
          <Box
            sx={{
              my: 0,
              mx: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
              Participants
            </Typography>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {participants.map((participant) => (
                <ListItem
                  key={participant.participantId}
                  secondaryAction={
                    !(myProfile && myProfile.id === participant.participantId) ?
                      <Tooltip title="Remove participant">
                        <IconButton onClick={() => kickParticipant(participant.participantId)}>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                      : <></>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ backgroundColor: 'black ' }}
                      alt={`Avatar of ${participant.formattedDisplayName}`}
                      src={participant.avatarURL}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={participant.formattedDisplayName} />
                </ListItem>
              )
              )}
            </List>

            <Box sx={{ mt: 'auto', mb: 2, width: '100%', textAlign: 'center' }}>
              <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
                Options
              </Typography>
              <Stack direction='column'>
                {!invite && <Button variant="outlined" sx={{ m: 1 }} onClick={createInvite}>Create invite link</Button>}
                {invite &&
                  <OutlinedInput
                    sx={{ m: 1 }}
                    type='text'
                    value={invite}
                    readOnly
                    disabled
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={addToClipBoard}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />}
                <Button variant="outlined" color='error' sx={{ m: 1 }} onClick={hangUp}>End call for me</Button>
                <Button variant="outlined" color='error' sx={{ m: 1 }}>End call for all</Button>
              </Stack>
            </Box>
          </Box>
        </Grid>}
    </Grid>
  )
}

export default Meeting;
