import { useState, useEffect } from 'react';
import { TextField, Button, Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PersonalInfo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    professionalSummary: '',
    githubUrl: '',
    websiteUrl: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPersonalInfo();
    }
  }, [user]);

  const loadPersonalInfo = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(prev => ({
          ...docSnap.data(),
          fullName: user.displayName // Always use Google profile name
        }));
      } else {
        // Set default values from Google profile
        setFormData(prev => ({
          ...prev,
          fullName: user.displayName || ''
        }));
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...formData,
        fullName: user.displayName // Ensure we always use Google profile name
      }, { merge: true });
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Personal Information</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              src={user.photoURL}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={user.displayName}
              disabled
              helperText="Name is synchronized with your Google account"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Summary"
              name="professionalSummary"
              value={formData.professionalSummary}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub Profile URL"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website URL"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Personal Information
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
