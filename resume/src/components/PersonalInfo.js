import { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Avatar, Box, Grid, Paper, Typography, Tooltip, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
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
  const [editingName, setEditingName] = useState(false);

  const loadPersonalInfo = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          dateOfBirth: data.dateOfBirth || '',
          phone: data.phone || '',
          address: data.address || '',
          professionalSummary: data.professionalSummary || '',
          githubUrl: data.githubUrl || '',
          websiteUrl: data.websiteUrl || ''
        }));
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      loadPersonalInfo();
    }
  }, [user, loadPersonalInfo]);

  const savePersonalInfo = async (data) => {
    if (!user?.uid) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, data, { merge: true });
      console.log('Saved data:', data); // Add logging to verify data
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    await savePersonalInfo(formData);
  };

  const handleNameSave = async () => {
    const dataToSave = {
      ...formData,
      fullName: formData.fullName || user?.displayName || '' // Ensure we have a name to save
    };
    await savePersonalInfo(dataToSave);
    setEditingName(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If editing name, immediately update the fullName
    if (name === 'fullName' && editingName) {
      setFormData(prev => ({
        ...prev,
        fullName: value || user?.displayName || ''
      }));
    }
  };

  // If not logged in, show message
  if (!user) {
    return (
      <Paper sx={{ p: 3, my: 2 }}>
        <Typography>Please sign in to manage your personal information.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Personal Information</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              src={user?.photoURL || ''}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
          </Grid>
        <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={user?.displayName || ''}
              disabled
              helperText="Full Name is synchronized with your Google account"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Email is synchronized with your Google account"
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
