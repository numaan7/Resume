import React from 'react';
import { Paper, Typography, Box, Divider, Chip } from '@mui/material';

const styles = {
  section: {
   
  },
  heading: {
    fontFamily: 'Calibri, sans-serif',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 1,
  },
  subHeading: {
    fontFamily: 'Calibri, sans-serif',
    fontWeight: 'bold',
    color: '#34495e',
  },
  text: {
    fontFamily: 'Calibri, sans-serif',
  },
  date: {
    fontFamily: 'Calibri, sans-serif',
    color: '#7f8c8d',
    fontStyle: 'italic',
  }
};

const DefaultTemplate = React.forwardRef(({ resumeData, user }, ref) => {
  if (!resumeData) return null;

  // Create safe user object with fallbacks
  const safeUser = {
    displayName: user?.displayName || '',
    email: user?.email || ''
  };

  return (
    <Paper ref={ref} sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={styles.heading}>
          {resumeData.fullName || safeUser.displayName}
        </Typography>
        <Typography sx={styles.text}>
          {resumeData.phone && resumeData.address ? `${resumeData.phone} • ${resumeData.address}` : ''}
        </Typography>
        <Typography sx={styles.text}>
          {[safeUser.email, resumeData.githubUrl, resumeData.websiteUrl]
            .filter(Boolean)
            .join(' • ')}
        </Typography>
      </Box>

      {/* Professional Summary */}
      {resumeData.professionalSummary && (
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
            Professional Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={styles.text}>{resumeData.professionalSummary}</Typography>
        </Box>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
            Professional Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {resumeData.experience
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={styles.subHeading}>
                  {exp.position} - {exp.company}
                </Typography>
                <Typography sx={styles.date}>
                  {exp.startDate} - {exp.endDate || 'Present'} | {exp.location} ({exp.locationType})
                </Typography>
                <Typography sx={styles.text}>{exp.description}</Typography>
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

    

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
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
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {resumeData.certifications.map((cert, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography sx={styles.subHeading}>
                {cert.name} - {cert.organization}
              </Typography>
              <Typography sx={styles.date}>
                Issued: {cert.issueDate} | Expires: {cert.expiryDate || 'No Expiration'}
              </Typography>
              <Typography sx={styles.text}>Credential ID: {cert.credentialId}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Languages */}
      {resumeData.languages && resumeData.languages.length > 0 && (
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
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
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
            Achievements
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {resumeData.achievements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((achievement, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography sx={styles.subHeading}>{achievement.title}</Typography>
                <Typography sx={styles.date}>{achievement.date}</Typography>
                <Typography sx={styles.text}>{achievement.description}</Typography>
              </Box>
            ))}
        </Box>
      )}

        {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <Box sx={styles.section}>
          <Typography variant="h5" sx={styles.heading}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {resumeData.education
            .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
            .map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={styles.subHeading}>
                  {edu.degree} in {edu.fieldOfStudy}
                </Typography>
                <Typography sx={styles.subHeading}>
                  {edu.instituteName} - {edu.location}
                </Typography>
                <Typography sx={styles.date}>
                  {edu.fromDate} - {edu.toDate || 'Present'} | Grade: {edu.grade}
                </Typography>
                {edu.description && (
                  <Typography sx={styles.text}>{edu.description}</Typography>
                )}
                {edu.activities && (
                  <Typography sx={styles.text}>Activities: {edu.activities}</Typography>
                )}
              </Box>
            ))}
        </Box>
      )}
    </Paper>
  );
});

export default DefaultTemplate;
