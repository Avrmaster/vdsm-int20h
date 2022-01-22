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

const Meeting = props => {
  const params = useParams();
  console.log('MEETING ID', params.meetingId);

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* jitsi iFrame */}
      <Grid item xs={12} sm={8} md={9}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Participants list */}
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
            <Button variant="outlined" color='error' sx={{m: 1}}>End for all</Button>
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Meeting;
