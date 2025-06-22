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
  CardActions,
  Rating
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Skills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    rating: 3,
    yearsOfExperience: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSkills();
    }
  }, [user]);

  const loadSkills = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().skills) {
        setSkills(docSnap.data().skills);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedSkills = [...skills];
      if (editingIndex >= 0) {
        updatedSkills[editingIndex] = currentSkill;
      } else {
        updatedSkills.push(currentSkill);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        skills: updatedSkills
      }, { merge: true });
      
      setSkills(updatedSkills);
      setCurrentSkill({
        name: '',
        rating: 3,
        yearsOfExperience: ''
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (_, newValue) => {
    setCurrentSkill(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleEdit = (index) => {
    setCurrentSkill(skills[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedSkills = skills.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        skills: updatedSkills
      }, { merge: true });
      setSkills(updatedSkills);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Skills</Typography>
      
      {/* Skills List */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {skills.map((skill, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{skill.name}</Typography>
                <Rating value={skill.rating} readOnly />
                <Typography color="textSecondary">
                  {skill.yearsOfExperience} years of experience
                </Typography>
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
          </Grid>
        ))}
      </Grid>

      {/* Skill Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Skill Name"
              name="name"
              value={currentSkill.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="yearsOfExperience"
              type="number"
              value={currentSkill.yearsOfExperience}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="legend">Proficiency Level</Typography>
            <Rating
              name="rating"
              value={currentSkill.rating}
              onChange={handleRatingChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Skill' : 'Add Skill'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
