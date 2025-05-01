import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Build,
  LocalPhone,
  Security,
  Payment,
  Schedule,
  Star,
} from '@mui/icons-material';

const AboutUsPage: React.FC = () => {
  const features = [
    {
      icon: <Build />,
      title: 'Professional Services',
      description: 'Access to verified and experienced service providers for all your home maintenance needs.',
    },
    {
      icon: <LocalPhone />,
      title: '24/7 Emergency Support',
      description: 'Round-the-clock assistance for urgent home repair situations.',
    },
    {
      icon: <Security />,
      title: 'Secure Payments',
      description: 'Safe and reliable payment processing with multiple payment options.',
    },
    {
      icon: <Schedule />,
      title: 'Flexible Scheduling',
      description: 'Book services at your convenience with our easy scheduling system.',
    },
    {
      icon: <Star />,
      title: 'Quality Assurance',
      description: 'Verified reviews and ratings to ensure you get the best service.',
    },
    {
      icon: <Payment />,
      title: 'Transparent Pricing',
      description: 'Clear and upfront pricing with no hidden charges.',
    },
  ];

  const services = [
    {
      title: 'Plumbing',
      description: 'Expert plumbing services for all your home needs.',
    },
    {
      title: 'Electrical',
      description: 'Professional electrical work and maintenance.',
    },
    {
      title: 'Cleaning',
      description: 'Thorough cleaning services for your home.',
    },
    {
      title: 'Carpentry',
      description: 'Skilled carpentry and woodwork services.',
    },
    {
      title: 'Painting',
      description: 'Professional painting and finishing work.',
    },
    {
      title: 'Pest Control',
      description: 'Effective pest control solutions.',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About HomePro
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your Trusted Partner in Home Maintenance
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          At HomePro, we are committed to providing reliable, professional, and affordable home maintenance services. 
          Our goal is to make home repairs and maintenance hassle-free for homeowners while creating opportunities 
          for skilled service providers.
        </Typography>
      </Box>

      {/* Features */}
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Why Choose HomePro?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.main',
                      margin: '0 auto 16px',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Services */}
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Our Services
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact CTA */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join thousands of satisfied customers who trust HomePro for their home maintenance needs.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage; 