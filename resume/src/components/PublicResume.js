import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { templates, getTemplateById } from './templates';

function PublicResume({ publicId }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const resumeRef = doc(db, 'public_resumes', publicId);
        const resumeSnap = await getDoc(resumeRef);
        
        if (resumeSnap.exists()) {
          const data = resumeSnap.data();
          // Ensure we have a valid template ID
          if (!templates.some(t => t.id === data.templateId)) {
            data.templateId = 'default';
          }
          setResumeData(data);
        } else {
          setError('Resume not found');
        }
      } catch (err) {
        setError('Error loading resume');
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [publicId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Get the template component using the same system as Preview
  const templateData = getTemplateById(resumeData.templateId);
  const Template = templateData.component;

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Show template info */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resume Template: {templateData.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {templateData.description}
        </Typography>
      </Paper>

      {/* Render the template */}
      <Template
        resumeData={{
          ...resumeData,
          phone: resumeData.personalInfo?.phone,
          address: resumeData.personalInfo?.location,
          professionalSummary: resumeData.personalInfo?.professionalSummary,
          githubUrl: resumeData.personalInfo?.githubUrl,
          websiteUrl: resumeData.personalInfo?.websiteUrl,
        }}
        user={{
          displayName: resumeData.personalInfo.name,
          email: resumeData.personalInfo.email,
          photoURL: resumeData.personalInfo.photoURL
        }}
      />
    </Box>
  );
}

export default PublicResume;
