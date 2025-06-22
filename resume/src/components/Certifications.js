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
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Certifications() {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    organization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertifications();
    }
  }, [user]);

  const loadCertifications = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().certifications) {
        setCertifications(docSnap.data().certifications);
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedCertifications = [...certifications];
      if (editingIndex >= 0) {
        updatedCertifications[editingIndex] = currentCertification;
      } else {
        updatedCertifications.push(currentCertification);
      }
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        certifications: updatedCertifications
      }, { merge: true });
      
      setCertifications(updatedCertifications);
      setCurrentCertification({
        name: '',
        organization: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        skills: []
      });
      setEditingIndex(-1);
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCertification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentCertification.skills.includes(skillInput.trim())) {
      setCurrentCertification(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentCertification(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleEdit = (index) => {
    setCurrentCertification(certifications[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedCertifications = certifications.filter((_, i) => i !== index);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        certifications: updatedCertifications
      }, { merge: true });
      setCertifications(updatedCertifications);
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, my: 2 }}>
      <Typography variant="h5" gutterBottom>Certifications</Typography>
      
      {/* Certifications List */}
      {certifications.map((cert, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{cert.name}</Typography>
            <Typography color="textSecondary">{cert.organization}</Typography>
            <Typography>Issued: {cert.issueDate}</Typography>
            {cert.expiryDate && (
              <Typography>Expires: {cert.expiryDate}</Typography>
            )}
            <Typography>
              Credential ID: {cert.credentialId}
              {cert.credentialUrl && (
                <Button
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Verify
                </Button>
              )}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography component="div">Skills:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cert.skills.map((skill, i) => (
                  <Chip key={i} label={skill} />
                ))}
              </Box>
            </Box>
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

      {/* Certification Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Certification Name"
              name="name"
              value={currentCertification.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Issuing Organization"
              name="organization"
              value={currentCertification.organization}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Issue Date"
              type="date"
              name="issueDate"
              value={currentCertification.issueDate}
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
              label="Expiry Date"
              type="date"
              name="expiryDate"
              value={currentCertification.expiryDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Credential ID"
              name="credentialId"
              value={currentCertification.credentialId}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Credential URL"
              name="credentialUrl"
              value={currentCertification.credentialUrl}
              onChange={handleInputChange}
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
              {currentCertification.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingIndex >= 0 ? 'Update Certification' : 'Add Certification'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
