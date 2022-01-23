import React from "react";
import { useParams } from "react-router-dom";
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
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Jitsi from 'react-jitsi';

function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center"}}>
      <CircularProgress />
    </Box>
  );
}


const Meeting = props => {
  const params = useParams();
  const jwt = sessionStorage.getItem('jwt')
  let jitsiMeetAPI;
  const configure = (jitsiMeetAPIInstance) => {
    jitsiMeetAPI = jitsiMeetAPIInstance;
  };
  return (
    <Grid container component="main" sx={{ height: '100vh', display: 'flex' }}>
      <Grid item xs={12} sm={8} md={9} sx={{ height: '100vh'}}
      >
        <Jitsi
          roomName={decodeURIComponent(params.roomName)}
          jwt={jwt} domain={'8x8.vc'}
          loadingComponent={CircularIndeterminate}
          containerStyle={{
            height: '100%',
            width: '100%'
          }}
          onAPILoad={jitsiMeetAPI=> configure(jitsiMeetAPI)}
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
            {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem
                  key={value}
                  secondaryAction={
                    <Tooltip title="Remove participant">
                      <IconButton>
                        <CancelIcon/>
                      </IconButton>
                    </Tooltip>
                  }
                  // sx={{mx: 1}}
                  // disablePadding
                >
                  
                    <ListItemAvatar>
                      <Avatar>JD</Avatar>
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={`John Doe`} />
                    
                </ListItem>
              );
            })}
          </List>

          <Box sx={{mt: 'auto', mb: 2, width: '100%', textAlign: 'center'}}>
          <Typography sx={{ mt: 2, mb: 1 }} variant="h6" component="div">
            Options
          </Typography>
          <Stack direction='column'>
            <Button variant="outlined" sx={{m: 1}}>Invite</Button>
            <Button variant="outlined" color='error' sx={{m: 1}}>End call for me</Button>
            <Button variant="outlined" color='error' sx={{m: 1}}>End call for all</Button>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Meeting;
