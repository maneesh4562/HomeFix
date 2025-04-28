import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getBookings } from '../store/slices/bookingSlice';
import { CircularProgress, Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector((state:any) => state.booking);
  const { user } = useAppSelector((state:any) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getBookings({}));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          My Bookings
        </Typography>
        {bookings.length === 0 ? (
          <Typography>No bookings found</Typography>
        ) : (
          <List>
            {bookings.map((booking:any) => (
              <React.Fragment key={booking._id}>
                <ListItem>
                  <ListItemText
                    primary={booking.service?.title || 'Service'}
                    secondary={`Date: ${new Date(booking.date).toLocaleDateString()} - Status: ${booking.status}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage; 