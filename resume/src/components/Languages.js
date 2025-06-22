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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PROFICIENCY_LEVELS = [
  'Native/Bilingual',
  'Fluent',
  'Professional',
  'Intermediate',
  'Basic',
  'Beginner'
];

export default function Languages() {
  const { user } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: '',
    proficiency: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLanguages();
    }
  }, [user]);

  const loadLanguages = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().languages) {
        setLanguages(docSnap.data().languages);
      }
    } catch (error) {
      console.error('Error loading languages:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedLanguages = [...languages];
      if (editingIndex >= 0) {
        updatedLanguages[editingIndex] = currentLanguage;
      } else {
        updatedLanguages.push(currentLanguage);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        languages: updatedLanguages
      }, { merge: true });
      
      setLanguages(updatedLanguages);
      setCurrentLanguage({
        name: '',
        proficiency: ''
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLanguage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (index) => {
    setCurrentLanguage(languages[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedLanguages = languages.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        languages: updatedLanguages
      }, { merge: true });
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Languages</Typography>
      
      {/* Languages List */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {languages.map((lang, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{lang.name}</Typography>
                <Typography color="textSecondary">{lang.proficiency}</Typography>
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

      {/* Language Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Language Name"
              name="name"
              value={currentLanguage.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                name="proficiency"
                value={currentLanguage.proficiency}
                onChange={handleInputChange}
                label="Proficiency Level"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Language' : 'Add Language'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
