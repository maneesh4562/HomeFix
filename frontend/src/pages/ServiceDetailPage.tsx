import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Avatar,
  Chip,
  Rating,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store';
import { getServiceById } from '../store/slices/serviceSlice';
import { services } from '../services/api';
import { Service } from '../types';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedService, loading, error } = useAppSelector((state) => state.services);

  useEffect(() => {
    if (id) {
      dispatch(getServiceById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !selectedService) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Service not found'}</Alert>
      </Container>
    );
  }

  const handleBookNow = () => {
    navigate(`/booking/${selectedService._id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {selectedService.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={selectedService.rating} readOnly sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              ({selectedService.reviews?.length || 0} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {selectedService.description}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Days:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    {selectedService.availability.days.join(', ')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  {selectedService.availability.startTime} - {selectedService.availability.endTime}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Emergency Service:
                  </Typography>
                  <Chip
                    label={selectedService.isEmergency ? 'Available' : 'Not Available'}
                    color={selectedService.isEmergency ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Service Provider
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.main',
                }}
              >
                {selectedService.provider?.firstName?.charAt(0) || 'P'}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">
                  {selectedService.provider?.firstName} {selectedService.provider?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedService.provider?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" gutterBottom>
              ${selectedService.basePrice}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Base price for standard service
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceDetailPage; 