import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { getServices } from '../store/slices/serviceSlice';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalPhone } from '@mui/icons-material';

const EmergencyServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { services, loading } = useAppSelector((state) => state.services);

  useEffect(() => {
    dispatch(getServices({ isEmergency: true }));
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Emergency Services
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Available 24/7 for urgent home repair needs
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              {service.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${service.basePrice}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<LocalPhone />}
                    onClick={() => navigate(`/services/${service._id}`)}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EmergencyServicesPage; 