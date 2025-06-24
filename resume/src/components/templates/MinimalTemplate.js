import React from 'react';
import { Paper, Typography, Box, Grid, Chip, Link } from '@mui/material';
import { GitHub as GitHubIcon, Language as WebsiteIcon } from '@mui/icons-material';

const styles = {
  container: {
    padding: 4,
    background: '#ffffff',
  },
  header: {
    borderBottom: '2px solid #000',
    paddingBottom: 2,
    marginBottom: 4,
  },
  name: {
    fontSize: '2rem',
    fontWeight: '300',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 2,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -4,
      left: 0,
      width: '2rem',
      height: '2px',
      background: '#000',
    }
  },
  itemTitle: {
    fontWeight: '500',
  },
  date: {
    color: '#666',
    fontSize: '0.9rem',
  },
  text: {
    lineHeight: 1.6,
  },
  contactInfo: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    color: '#444',
    marginTop: 1,
  },
  socialLinks: {
    display: 'flex',
    gap: 1,
    marginTop: 1,
    '& .icon': {
      fontSize: '1.2rem',
      color: '#666',
      transition: 'color 0.2s',
      '&:hover': {
        color: '#000',
      }
    }
  },
  skillChip: {
    margin: '4px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #eee',
    borderRadius: '4px',
    '& .MuiChip-label': {
      fontSize: '0.85rem',
    }
  },
  experienceBox: {
    borderLeft: '2px solid #eee',
    paddingLeft: 2,
    marginBottom: 3,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -0.5,
      top: 0,
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#000',
    },
    '&:hover': {
      borderLeft: '2px solid #000',
    }
  },
  languageBar: {
    width: '100px',
    height: '4px',
    backgroundColor: '#eee',
    marginLeft: 1,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#000',
    }
  },
  certificationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 2,
  }
};

const getProficiencyWidth = (level) => {
  const levels = {
    'Native': '100%',
    'Fluent': '90%',
    'Advanced': '80%',
    'Intermediate': '60%',
    'Basic': '40%',
    'Beginner': '20%'
  };
  return levels[level] || '50%';
};

const MinimalTemplate = React.forwardRef(({ resumeData, user }, ref) => {
  if (!resumeData) return null;

  return (
    <Paper ref={ref} sx={{ maxWidth: '800px', margin: '0 auto' }}>
      <Box sx={styles.container}>
        {/* Header */}
        <Box sx={styles.header}>
          <Typography sx={styles.name}>{resumeData.fullName || user.displayName }</Typography>
          <Box sx={styles.contactInfo}>
            <Typography>{user.email}</Typography>
            {resumeData.phone && (
              <Typography>• {resumeData.phone}</Typography>
            )}
            {resumeData.address && (
              <Typography>• {resumeData.address}</Typography>
            )}
          </Box>
          <Box sx={styles.socialLinks}>
            {resumeData.githubUrl && (
              <Link href={resumeData.githubUrl} target="_blank">
                <GitHubIcon className="icon" />
              </Link>
            )}
            {resumeData.websiteUrl && (
              <Link href={resumeData.websiteUrl} target="_blank">
                <WebsiteIcon className="icon" />
              </Link>
            )}
          </Box>
        </Box>

        {/* Professional Summary */}
        {resumeData.professionalSummary && (
          <Box sx={styles.section}>
            <Typography sx={styles.text}>
              {resumeData.professionalSummary}
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Experience</Typography>
            {resumeData.experience
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((exp, index) => (
                <Box key={index} sx={styles.experienceBox}>
                  <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                      <Typography sx={styles.itemTitle}>
                        {exp.position} | {exp.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.location} • {exp.locationType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography sx={styles.date}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography sx={{ ...styles.text, mt: 1 }}>{exp.description}</Typography>
                  {exp.skills && exp.skills.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {exp.skills.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          size="small"
                          sx={styles.skillChip}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        )}

     

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resumeData.skills
                .sort((a, b) => b.rating - a.rating)
                .map((skill, index) => (
                  <Chip
                    key={index}
                    label={`${skill.name} ${skill.yearsOfExperience ? `(${skill.yearsOfExperience}y)` : ''}`}
                    sx={{
                      ...styles.skillChip,
                      backgroundColor: `rgba(0, 0, 0, ${skill.rating * 0.1})`,
                      color: skill.rating > 3 ? '#fff' : '#000',
                    }}
                  />
                ))}
            </Box>
          </Box>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Languages</Typography>
            <Grid container spacing={2}>
              {resumeData.languages.map((lang, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ flex: 1 }}>{lang.name}</Typography>
                    <Box 
                      sx={{
                        ...styles.languageBar,
                        '&::after': {
                          width: getProficiencyWidth(lang.proficiency)
                        }
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Certifications</Typography>
            <Box sx={styles.certificationGrid}>
              {resumeData.certifications.map((cert, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: 1,
                    '&:hover': {
                      borderColor: '#000'
                    }
                  }}
                >
                  <Typography sx={styles.itemTitle}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2">{cert.organization}</Typography>
                  <Typography sx={styles.date}>
                    {cert.issueDate}{cert.expiryDate && ` - ${cert.expiryDate}`}
                  </Typography>
                  {cert.credentialId && (
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 0.5, color: '#666' }}>
                      ID: {cert.credentialId}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Achievements */}
        {resumeData.achievements && resumeData.achievements.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Achievements</Typography>
            {resumeData.achievements
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((achievement, index) => (
                <Box key={index} sx={styles.experienceBox}>
                  <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                      <Typography sx={styles.itemTitle}>{achievement.title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography sx={styles.date}>{achievement.date}</Typography>
                    </Grid>
                  </Grid>
                  <Typography sx={{ ...styles.text, mt: 1 }}>
                    {achievement.description}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
           {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionTitle}>Education</Typography>
            {resumeData.education
              .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
              .map((edu, index) => (
                <Box key={index} sx={styles.experienceBox}>
                  <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                      <Typography sx={styles.itemTitle}>
                        {edu.degree} in {edu.fieldOfStudy}
                      </Typography>
                      <Typography>{edu.instituteName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Grade: {edu.grade}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography sx={styles.date}>
                        {edu.fromDate} - {edu.toDate || 'Present'}
                      </Typography>
                    </Grid>
                  </Grid>
                  {edu.description && (
                    <Typography sx={{ ...styles.text, mt: 1 }}>{edu.description}</Typography>
                  )}
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
});

export default MinimalTemplate;
