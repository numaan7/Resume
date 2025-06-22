import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Education() {
  const { user } = useAuth();
  const [educations, setEducations] = useState([]);
  const [currentEducation, setCurrentEducation] = useState({
    instituteName: '',
    location: '',
    fromDate: '',
    toDate: '',
    grade: '',
    degree: '',
    fieldOfStudy: '',
    description: '',
    activities: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEducation();
    }
  }, [user]);

  const loadEducation = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().education) {
        setEducations(docSnap.data().education);
      }
    } catch (error) {
      console.error('Error loading education:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedEducations = [...educations];
      if (editingIndex >= 0) {
        updatedEducations[editingIndex] = currentEducation;
      } else {
        updatedEducations.push(currentEducation);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        education: updatedEducations
      }, { merge: true });
      
      setEducations(updatedEducations);
      setCurrentEducation({
        instituteName: '',
        location: '',
        fromDate: '',
        toDate: '',
        grade: '',
        degree: '',
        fieldOfStudy: '',
        description: '',
        activities: ''
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (index) => {
    setCurrentEducation(educations[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedEducations = educations.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        education: updatedEducations
      }, { merge: true });
      setEducations(updatedEducations);
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Education</Typography>
      
      {/* Education List */}
      {educations.map((edu, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{edu.instituteName}</Typography>
            <Typography color="textSecondary">{edu.degree} in {edu.fieldOfStudy}</Typography>
            <Typography>{edu.fromDate} - {edu.toDate}</Typography>
            <Typography>Grade: {edu.grade}</Typography>
            <Typography>Location: {edu.location}</Typography>
            <Typography>{edu.description}</Typography>
            <Typography>Activities: {edu.activities}</Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleEdit(index)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      {/* Education Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institute Name"
              name="instituteName"
              value={currentEducation.instituteName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={currentEducation.location}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              name="fromDate"
              value={currentEducation.fromDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              name="toDate"
              value={currentEducation.toDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Grade"
              name="grade"
              value={currentEducation.grade}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              value={currentEducation.degree}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Field of Study"
              name="fieldOfStudy"
              value={currentEducation.fieldOfStudy}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={currentEducation.description}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Activities"
              name="activities"
              value={currentEducation.activities}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Education' : 'Add Education'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
