import React from 'react';
import { Paper, Typography, Box, Grid, Chip, Divider } from '@mui/material';

const styles = {
  container: {
    background: '#ffffff',
    position: 'relative',
  },
  header: {
    padding: 4,
    borderBottom: '2px solid #2c3e50',
  },
  headerName: {
    fontFamily: '"Georgia", serif',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: 1,
  },
  headerContact: {
    color: '#34495e',
    fontSize: '0.95rem',
  },
  section: {
    padding: '24px 32px',
  },
  sectionTitle: {
    fontFamily: '"Georgia", serif',
    color: '#2c3e50',
    position: 'relative',
    paddingBottom: '8px',
    marginBottom: '24px',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '32px',
      height: '3px',
      background: '#2c3e50',
    },
  },
  experienceItem: {
    marginBottom: 3,
  },
  companyName: {
    fontWeight: 600,
    color: '#2c3e50',
  },
  dateLocation: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  description: {
    color: '#34495e',
    marginTop: 1,
    lineHeight: 1.6,
  },
  chip: {
    margin: '4px',
    backgroundColor: '#f5f6fa',
    color: '#2c3e50',
    border: '1px solid #e1e8ed',
    '&:hover': {
      backgroundColor: '#e1e8ed',
    },
  },
  education: {
    marginBottom: 2,
  },
  skillSection: {
    background: '#f8fafc',
    padding: 3,
    borderRadius: 1,
  },
};

const ProfessionalTemplate = React.forwardRef(({ resumeData, user }, ref) => {
  if (!resumeData) return null;

  return (
    <Paper ref={ref} sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h3" sx={styles.headerName}>
          {resumeData.fullName || user.displayName }
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography sx={styles.headerContact}>
              {user.email} • {resumeData.phone} • {resumeData.address}{resumeData.githubUrl && (
                <Box component="span" sx={{ }}>• {resumeData.githubUrl}
                </Box>
              )} {resumeData.websiteUrl && (
                <Box component="span" sx={{ }}>• {resumeData.websiteUrl}
                </Box>
              )} </Typography>
          </Grid>
        
        </Grid>
      </Box>

      <Box sx={styles.section}>
        {/* Professional Summary */}
        {resumeData.professionalSummary && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={styles.sectionTitle}>
              Professional Summary
            </Typography>
            <Typography sx={styles.description}>
              {resumeData.professionalSummary}
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={styles.sectionTitle}>
              Professional Experience
            </Typography>
            {resumeData.experience
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((exp, index) => (
                <Box key={index} sx={styles.experienceItem}>
                  <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" sx={styles.companyName}>
                        {exp.position}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {exp.company}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                      <Typography sx={styles.dateLocation}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </Typography>
                      <Typography sx={styles.dateLocation}>
                        {exp.location} ({exp.locationType})
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography sx={styles.description}>
                    {exp.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {exp.skills.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        size="small"
                        sx={styles.chip}
                      />
                    ))}
                  </Box>
                  {index < resumeData.experience.length - 1 && (
                    <Divider sx={{ my: 3 }} />
                  )}
                </Box>
              ))}
          </Box>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={styles.sectionTitle}>
                  Education
                </Typography>
                {resumeData.education
                  .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                  .map((edu, index) => (
                    <Box key={index} sx={styles.education}>
                      <Typography variant="h6" sx={styles.companyName}>
                        {edu.degree} in {edu.fieldOfStudy}
                      </Typography>
                      <Typography color="primary">
                        {edu.instituteName}
                      </Typography>
                      <Typography sx={styles.dateLocation}>
                        {edu.fromDate} - {edu.toDate || 'Present'} | Grade: {edu.grade}
                      </Typography>
                      {edu.description && (
                        <Typography sx={styles.description}>
                          {edu.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
              </Box>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={styles.sectionTitle}>
                  Languages
                </Typography>
                <Box sx={styles.skillSection}>
                  {resumeData.languages.map((lang, index) => (
                    <Chip
                      key={index}
                      label={`${lang.name} - ${lang.proficiency}`}
                      sx={styles.chip}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={styles.sectionTitle}>
                  Technical Skills
                </Typography>
                <Box sx={styles.skillSection}>
                  {resumeData.skills
                    .sort((a, b) => b.yearsOfExperience - a.yearsOfExperience)
                    .map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.name}`}
                        sx={{
                          ...styles.chip,
                          '& .MuiChip-label': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }
                        }}
                      >
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box component="span" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            {skill.yearsOfExperience}y
                          </Box>
                          <Box 
                            component="span" 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              color: '#f1c40f',
                              fontSize: '0.9rem',
                              letterSpacing: '-1px',
                              '& .star': {
                                transition: 'all 0.2s ease',
                              },
                              '& .star.filled': {
                                opacity: 1
                              },
                              '& .star.empty': {
                                opacity: 0.3
                              }
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`star ${i < skill.rating ? 'filled' : 'empty'}`}
                              >
                                ★
                              </span>
                            ))}
                          </Box>
                        </Box>
                      </Chip>
                    ))}
                </Box>
              </Box>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={styles.sectionTitle}>
                  Certifications
                </Typography>
                {resumeData.certifications.map((cert, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography sx={styles.companyName}>
                      {cert.name}
                    </Typography>
                    <Typography color="primary">
                      {cert.organization}
                    </Typography>
                    <Typography sx={styles.dateLocation}>
                      Issued: {cert.issueDate}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Credential ID: {cert.credentialId}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Achievements */}
            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <Box>
                <Typography variant="h5" sx={styles.sectionTitle}>
                  Achievements
                </Typography>
                {resumeData.achievements
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((achievement, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography sx={styles.companyName}>
                        {achievement.title}
                      </Typography>
                      <Typography sx={styles.dateLocation}>
                        {achievement.date}
                      </Typography>
                      <Typography sx={styles.description}>
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

export default ProfessionalTemplate;
