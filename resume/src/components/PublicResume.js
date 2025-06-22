import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
          setResumeData(resumeSnap.data());
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, fontFamily: 'Calibri, sans-serif' }}>
        {/* Personal Info */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {resumeData.personalInfo.name}
          </Typography>
          <Typography>{resumeData.personalInfo.email}</Typography>
          <Typography>{resumeData.personalInfo.phone}</Typography>
          <Typography>{resumeData.personalInfo.location}</Typography>
          {resumeData.personalInfo.githubUrl && (
            <Typography><a href={resumeData.personalInfo.githubUrl} target="_blank" rel="noopener noreferrer">GitHub Profile</a></Typography>
          )}
          {resumeData.personalInfo.websiteUrl && (
            <Typography><a href={resumeData.personalInfo.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a></Typography>
          )}
        </Box>

        {resumeData.personalInfo.professionalSummary && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Professional Summary
            </Typography>
            <Typography>{resumeData.personalInfo.professionalSummary}</Typography>
          </Box>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Experience
            </Typography>
            {resumeData.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">{exp.company}</Typography>
                <Typography variant="subtitle1">{exp.position}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </Typography>
                <Typography>{exp.description}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Education
            </Typography>
            {resumeData.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">{edu.instituteName}</Typography>
                <Typography variant="subtitle1">{edu.degree} in {edu.fieldOfStudy}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {edu.fromDate} - {edu.toDate || 'Present'}
                </Typography>
                {edu.description && <Typography>{edu.description}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={`${skill.name} (${skill.yearsOfExperience} years)`} 
                  sx={{ m: 0.5 }} 
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Certifications
            </Typography>
            {resumeData.certifications.map((cert, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">{cert.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {cert.organization} • Issued: {cert.issueDate}
                  {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                </Typography>
                {cert.credentialId && (
                  <Typography variant="body2">Credential ID: {cert.credentialId}</Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Languages
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.languages.map((lang, index) => (
                <Chip 
                  key={index} 
                  label={`${lang.name} - ${lang.proficiency}`}
                  sx={{ m: 0.5 }} 
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Achievements */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ borderBottom: '2px solid #1976d2' }}>
              Achievements
            </Typography>
            {resumeData.achievements.map((achievement, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1">{achievement.title}</Typography>
                <Typography variant="body2" color="textSecondary">{achievement.date}</Typography>
                <Typography>{achievement.description}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default PublicResume;
