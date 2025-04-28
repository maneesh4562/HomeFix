import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { getServiceById } from '../store/slices/serviceSlice';
import { services, bookings, payments } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const validationSchema = yup.object({
  date: yup.date().required('Date is required'),
  time: yup.date().required('Time is required'),
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
});

const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedService } = useAppSelector((state) => state.services);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      dispatch(getServiceById(serviceId));
    }
  }, [dispatch, serviceId]);

  const formik = useFormik({
    initialValues: {
      date: null as Date | null,
      time: null as Date | null,
      address: user?.address || '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const bookingData = {
          service: serviceId!,
          date: values.date!.toISOString(),
          time: values.time!.toISOString(),
          address: values.address,
          description: values.description,
          totalAmount: selectedService?.basePrice || 0,
        };

        const bookingResponse = await bookings.create(bookingData);
        if (!bookingResponse?.data?._id) {
          throw new Error('Failed to create booking');
        }

        const paymentResponse = await payments.createPaymentIntent(bookingResponse.data._id);
        if (!paymentResponse?.data?.sessionId) {
          throw new Error('Failed to create payment session');
        }

        const stripe = await stripePromise;
        const { error: stripeError } = await stripe!.redirectToCheckout({
          sessionId: paymentResponse.data.sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create booking');
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Service
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {selectedService?.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedService?.description}
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(value) => formik.setFieldValue('date', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={formik.values.time}
                  onChange={(value) => formik.setFieldValue('time', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.time && Boolean(formik.errors.time),
                      helperText: formik.touched.time && formik.errors.time,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total: ${selectedService?.basePrice}
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingPage; 