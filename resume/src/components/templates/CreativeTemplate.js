import React from 'react';
import { Paper, Typography, Box, Grid, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const styles = {
  container: {
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: 4,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
    },
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  name: {
    fontWeight: 700,
    fontSize: '2.5rem',
    marginBottom: 1,
    fontFamily: '"Playfair Display", serif',
  },
  subtitle: {
    opacity: 0.9,
    marginBottom: 2,
    fontSize: '1.1rem',
  },
  section: {
    padding: 4,
    position: 'relative',
  },
  sectionTitle: {
    position: 'relative',
    fontFamily: '"Playfair Display", serif',
    marginBottom: 3,
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
  },
  experienceCard: {
    padding: 2,
    marginBottom: 2,
    borderRadius: '8px',
    background: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  skillChip: {
    margin: 0.5,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    fontWeight: 500,
    '&:hover': {
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    },
  },
};

const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  marginBottom: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid #ffffff',
    boxShadow: '0 0 0 3px rgba(102,126,234,0.2)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '5px',
    top: '12px',
    bottom: '-12px',
    width: '2px',
    background: '#e2e8f0',
  },
  '&:last-child::after': {
    display: 'none',
  },
}));

const CreativeTemplate = React.forwardRef(({ resumeData, user }, ref) => {
  if (!resumeData) return null;

  return (
    <Paper ref={ref} sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={styles.headerContent}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Avatar
                src={user.photoURL}
                sx={{
                  width: 150,
                  height: 150,
                  margin: '0 auto',
                  border: '4px solid rgba(255,255,255,0.2)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h1" sx={styles.name}>
                {resumeData.fullname || user.displayName}
              </Typography>
              <Typography variant="h6" sx={styles.subtitle}>
                {resumeData.professionalSummary}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ opacity: 0.9 }}>
                  {user.email} • {resumeData.phone}
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                  {resumeData.address}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={styles.section}>
        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={styles.sectionTitle}>
              Experience
            </Typography>
            {resumeData.experience
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((exp, index) => (
                <TimelineItem key={index}>
                  <Box sx={styles.experienceCard}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                      {exp.position} at {exp.company}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#718096', mb: 1 }}>
                      {exp.startDate} - {exp.endDate || 'Present'} | {exp.location}
                    </Typography>
                    <Typography sx={{ color: '#4a5568', mb: 2 }}>
                      {exp.description}
                    </Typography>
                    <Box>
                      {exp.skills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          size="small"
                          sx={styles.skillChip}
                        />
                      ))}
                    </Box>
                  </Box>
                </TimelineItem>
              ))}
          </Box>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={styles.sectionTitle}>
                  Education
                </Typography>
                {resumeData.education
                  .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                  .map((edu, index) => (
                    <TimelineItem key={index}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                        {edu.degree} in {edu.fieldOfStudy}
                      </Typography>
                      <Typography sx={{ color: '#4a5568' }}>
                        {edu.instituteName}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                        {edu.fromDate} - {edu.toDate || 'Present'}
                      </Typography>
                      {edu.description && (
                        <Typography sx={{ color: '#4a5568', mt: 1 }}>
                          {edu.description}
                        </Typography>
                      )}
                    </TimelineItem>
                  ))}
              </Box>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={styles.sectionTitle}>
                  Skills
                </Typography>
              
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={styles.sectionTitle}>
                  Certifications
                </Typography>
                {resumeData.certifications.map((cert, index) => (
                  <Box key={index} sx={styles.experienceCard}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                      {cert.name}
                    </Typography>
                    <Typography sx={{ color: '#4a5568' }}>
                      {cert.organization}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                      Issued: {cert.issueDate}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={styles.sectionTitle}>
                  Languages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.languages.map((lang, index) => (
                    <Chip
                      key={index}
                      label={`${lang.name} - ${lang.proficiency}`}
                      sx={styles.skillChip}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Achievements */}
            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <Box>
                <Typography variant="h4" sx={styles.sectionTitle}>
                  Achievements
                </Typography>
                {resumeData.achievements
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((achievement, index) => (
                    <Box key={index} sx={styles.experienceCard}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                        {achievement.date}
                      </Typography>
                      <Typography sx={{ color: '#4a5568', mt: 1 }}>
                        {achievement.description}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
});

export default CreativeTemplate;
