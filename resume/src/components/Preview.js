import { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, Divider, Chip, Button, Snackbar } from '@mui/material';
import { PictureAsPdf as PdfIcon, Share as ShareIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import html2pdf from 'html2pdf.js';

const sectionStyle = {
  marginBottom: 3,
};

const headingStyle = {
  fontFamily: 'Calibri, sans-serif',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: 1,
};

const subHeadingStyle = {
  fontFamily: 'Calibri, sans-serif',
  fontWeight: 'bold',
  color: '#34495e',
};

const textStyle = {
  fontFamily: 'Calibri, sans-serif',
};

const dateStyle = {
  fontFamily: 'Calibri, sans-serif',
  color: '#7f8c8d',
  fontStyle: 'italic',
};

export default function Preview() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadResumeData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
      }
      setLoading(false);
    };

    loadResumeData();
  }, [user]);

  const handleSharePublicly = async () => {
    try {
      const publicId = `${user.uid}-${Date.now()}`;
      const publicResumeRef = doc(db, 'public_resumes', publicId);
      
      // Structure the data in the format expected by PublicResume
      const publicData = {
        userId: user.uid,
        personalInfo: {
          name: user.displayName,
          email: user.email,
          phone: resumeData.phone || '',
          location: resumeData.address || '',
          professionalSummary: resumeData.professionalSummary || '',
          githubUrl: resumeData.githubUrl || '',
          websiteUrl: resumeData.websiteUrl || ''
        },
        education: resumeData.education || [],
        experience: resumeData.experience || [],
        skills: resumeData.skills || [],
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        achievements: resumeData.achievements || [],
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(publicResumeRef, publicData);

      // Create and copy the public URL
      const publicUrl = `${window.location.origin}/resume/${publicId}`;
      await navigator.clipboard.writeText(publicUrl);
      
      setSnackbarMessage('Public resume link copied to clipboard!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sharing resume:', error);
      setSnackbarMessage('Error sharing resume. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 1,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading || !resumeData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShareIcon />}
          onClick={handleSharePublicly}
        >
          Share Publicly
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PdfIcon />}
          onClick={handleDownloadPDF}
        >
          Download PDF
        </Button>
      </Box>
      <Paper ref={resumeRef} sx={{ p: 4, fontFamily: 'Calibri, sans-serif' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={headingStyle}>
            {user.displayName}
          </Typography>
          <Typography sx={textStyle}>
            {resumeData.phone} • {resumeData.address}
          </Typography>
          <Typography sx={textStyle}>
            {user.email} • {resumeData.githubUrl} • {resumeData.websiteUrl}
          </Typography>
        </Box>

        {/* Professional Summary */}
        {resumeData.professionalSummary && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Professional Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography sx={textStyle}>{resumeData.professionalSummary}</Typography>
          </Box>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Professional Experience
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resumeData.experience
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={subHeadingStyle}>
                    {exp.position} - {exp.company}
                  </Typography>
                  <Typography sx={dateStyle}>
                    {exp.startDate} - {exp.endDate || 'Present'} | {exp.location} ({exp.locationType})
                  </Typography>
                  <Typography sx={textStyle}>{exp.description}</Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    {exp.skills.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5, fontFamily: 'Calibri, sans-serif' }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
          </Box>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Education
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resumeData.education
              .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
              .map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={subHeadingStyle}>
                    {edu.degree} in {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={subHeadingStyle}>
                    {edu.instituteName} - {edu.location}
                  </Typography>
                  <Typography sx={dateStyle}>
                    {edu.fromDate} - {edu.toDate || 'Present'} | Grade: {edu.grade}
                  </Typography>
                  {edu.description && (
                    <Typography sx={textStyle}>{edu.description}</Typography>
                  )}
                  {edu.activities && (
                    <Typography sx={textStyle}>Activities: {edu.activities}</Typography>
                  )}
                </Box>
              ))}
          </Box>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Technical Skills
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.skills
                .sort((a, b) => b.rating - a.rating)
                .map((skill, index) => (
                  <Chip
                    key={index}
                    label={`${skill.name} (${skill.yearsOfExperience} years)`}
                    sx={{ fontFamily: 'Calibri, sans-serif' }}
                  />
                ))}
            </Box>
          </Box>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Certifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resumeData.certifications.map((cert, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography sx={subHeadingStyle}>
                  {cert.name} - {cert.organization}
                </Typography>
                <Typography sx={dateStyle}>
                  Issued: {cert.issueDate} | Expires: {cert.expiryDate || 'No Expiration'}
                </Typography>
                <Typography sx={textStyle}>Credential ID: {cert.credentialId}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Languages
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.languages.map((lang, index) => (
                <Chip
                  key={index}
                  label={`${lang.name} - ${lang.proficiency}`}
                  sx={{ fontFamily: 'Calibri, sans-serif' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Achievements */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <Box sx={sectionStyle}>
            <Typography variant="h5" sx={headingStyle}>
              Achievements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {resumeData.achievements
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((achievement, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography sx={subHeadingStyle}>{achievement.title}</Typography>
                  <Typography sx={dateStyle}>{achievement.date}</Typography>
                  <Typography sx={textStyle}>{achievement.description}</Typography>
                </Box>
              ))}
          </Box>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}
