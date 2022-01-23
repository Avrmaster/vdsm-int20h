import React, {useCallback} from "react";
import {useNavigate} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Stack,
} from '@mui/material'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import useAPI from './hooks/use-api'

const Home = props => {
  const navigate = useNavigate();
  const jitsiApi = useAPI()
  const handleJoin = useCallback(() => {
    const link = prompt('Enter meeting id');
    navigate(`/meeting/${link}`);
  }, [navigate]);

  const handleCreate = useCallback(async() => {
    const meetingInfo = await jitsiApi.createMeeting();
    sessionStorage.setItem('jwt', meetingInfo.jwt);
    navigate(`/meeting/${encodeURIComponent(meetingInfo.roomName)}`);
  }, [navigate, jitsiApi]);

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <VideoCameraFrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            VDSMeet
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Meet easily
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Create a meeting or join another in just a second!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={handleCreate}>Create meeting</Button>
              <Button variant="outlined" onClick={handleJoin}>Join with link</Button>
            </Stack>
          </Container>
        </Box>
      </main>
    </>
  )
}

export default Home;
