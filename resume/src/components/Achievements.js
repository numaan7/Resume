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

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().achievements) {
        setAchievements(docSnap.data().achievements);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedAchievements = [...achievements];
      if (editingIndex >= 0) {
        updatedAchievements[editingIndex] = currentAchievement;
      } else {
        updatedAchievements.push(currentAchievement);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        achievements: updatedAchievements
      }, { merge: true });
      
      setAchievements(updatedAchievements);
      setCurrentAchievement({
        title: '',
        description: '',
        date: ''
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAchievement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (index) => {
    setCurrentAchievement(achievements[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedAchievements = achievements.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        achievements: updatedAchievements
      }, { merge: true });
      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Achievements</Typography>
      
      {/* Achievements List */}
      {achievements.map((achievement, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{achievement.title}</Typography>
            <Typography color="textSecondary">{achievement.date}</Typography>
            <Typography sx={{ mt: 1 }}>{achievement.description}</Typography>
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

      {/* Achievement Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Achievement Title"
              name="title"
              value={currentAchievement.title}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={currentAchievement.date}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={currentAchievement.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Achievement' : 'Add Achievement'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
