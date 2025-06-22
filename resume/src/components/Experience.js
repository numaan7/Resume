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
  MenuItem,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Experience() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [currentExperience, setCurrentExperience] = useState({
    company: '',
    position: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    location: '',
    locationType: 'hybrid',
    skills: [],
    role: '',
    description: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadExperience();
    }
  }, [user]);

  const loadExperience = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().experience) {
        setExperiences(docSnap.data().experience);
      }
    } catch (error) {
      console.error('Error loading experience:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedExperiences = [...experiences];
      if (editingIndex >= 0) {
        updatedExperiences[editingIndex] = currentExperience;
      } else {
        updatedExperiences.push(currentExperience);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        experience: updatedExperiences
      }, { merge: true });
      
      setExperiences(updatedExperiences);
      setCurrentExperience({
        company: '',
        position: '',
        employmentType: '',
        startDate: '',
        endDate: '',
        location: '',
        locationType: 'hybrid',
        skills: [],
        role: '',
        description: ''
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentExperience.skills.includes(skillInput.trim())) {
      setCurrentExperience(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentExperience(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleEdit = (index) => {
    setCurrentExperience(experiences[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        experience: updatedExperiences
      }, { merge: true });
      setExperiences(updatedExperiences);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Work Experience</Typography>
      
      {/* Experience List */}
      {experiences.map((exp, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{exp.position}</Typography>
            <Typography color="textSecondary">{exp.company}</Typography>
            <Typography>{exp.startDate} - {exp.endDate || 'Present'}</Typography>
            <Typography>{exp.location} ({exp.locationType})</Typography>
            <Typography>Employment Type: {exp.employmentType}</Typography>
            <Typography sx={{ mt: 1 }}>Skills:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exp.skills.map((skill, i) => (
                <Chip key={i} label={skill} />
              ))}
            </Box>
            <Typography sx={{ mt: 2 }}>{exp.description}</Typography>
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

      {/* Experience Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={currentExperience.company}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={currentExperience.position}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                name="employmentType"
                value={currentExperience.employmentType}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Location Type</InputLabel>
              <Select
                name="locationType"
                value={currentExperience.locationType}
                onChange={handleInputChange}
              >
                <MenuItem value="onsite">On-site</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              name="startDate"
              value={currentExperience.startDate}
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
              label="End Date"
              type="date"
              name="endDate"
              value={currentExperience.endDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={currentExperience.location}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                sx={{ flexGrow: 1 }}
                label="Add Skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                sx={{ mt: 1 }}
              >
                Add Skill
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {currentExperience.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role Description"
              name="description"
              value={currentExperience.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Experience' : 'Add Experience'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
