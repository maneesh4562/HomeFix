import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  LocalPhone,
  CheckCircle,
  Security,
  Speed,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Speed />,
      title: 'Quick Response',
      description: 'Get connected with professionals within minutes',
    },
    {
      icon: <CheckCircle />,
      title: 'Verified Professionals',
      description: 'All service providers are thoroughly vetted',
    },
    {
      icon: <Security />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing',
    },
  ];

  const services = [
    {
      title: 'Plumbing',
      description: 'Expert plumbing services for your home',
      image: '/images/plumbing.jpg',
    },
    {
      title: 'Electrical',
      description: 'Professional electrical work and repairs',
      image: '/images/electrical.jpg',
    },
    {
      title: 'Cleaning',
      description: 'Thorough cleaning services for your home',
      image: '/images/cleaning.jpg',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Home Repair Services at Your Fingertips
          </Typography>
          <Typography variant="h5" paragraph>
            Find trusted professionals for all your home repair needs
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate('/services')}
            >
              Browse Services
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<LocalPhone />}
              onClick={() => navigate('/emergency')}
            >
              Emergency Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Services */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Popular Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate('/services')}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sign up now to access our network of trusted professionals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage; 