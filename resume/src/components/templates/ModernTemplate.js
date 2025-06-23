import React from 'react';
import { Paper, Typography, Box, Chip, Link } from '@mui/material';
import { GitHub as GitHubIcon, Language as WebsiteIcon, LinkedIn as LinkedInIcon, LocationOn, Phone, Email } from '@mui/icons-material';

const styles = {
  container: {
    background: '#ffffff',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100%',
  },
  sidebar: {
    background: '#2c3e50',
    color: '#ffffff',
    padding: 3,
    flex: { xs: '1', md: '0 0 300px' },
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  main: {
    padding: 3,
    flex: '1',
    backgroundColor: '#ffffff',
  },
  heading: {
    color: '#2c3e50',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    marginBottom: 2,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '40px',
      height: '3px',
      background: '#3498db',
      borderRadius: '2px',
    },
  },
  sidebarHeading: {
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    marginBottom: 2,
    fontSize: '1.1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  text: {
    marginBottom: 1,
    lineHeight: 1.6,
  },
  sidebarText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 0.5,
  },
  section: {
    marginBottom: 4,
  },
  chip: {
    margin: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  profile: {
    textAlign: 'center',
    marginBottom: 4,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: '50%',
    border: '4px solid rgba(255, 255, 255, 0.2)',
    marginBottom: 2,
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  skillRating: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '& .rating': {
      display: 'flex',
      gap: 0.5,
    },
    '& .star': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.8rem',
    },
    '& .years': {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.7)',
      marginLeft: 'auto',
    }
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    marginBottom: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    '& .icon': {
      fontSize: '1.2rem',
      opacity: 0.8,
    },
  },
  experienceBox: {
    borderLeft: '2px solid #3498db',
    paddingLeft: 2,
    marginBottom: 3,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -1,
      top: 0,
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#3498db',
    },
    '&:hover': {
      borderLeft: '2px solid #2980b9',
    }
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    marginTop: 2,
    '& .icon': {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.5rem',
      transition: 'all 0.2s ease',
      '&:hover': {
        color: 'rgba(255, 255, 255, 1)',
        transform: 'scale(1.1)',
      }
    }
  },
  languageLevel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  progressBar: {
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    flex: '1',
    marginLeft: 2,
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 'inherit',
    }
  }
};

const getLevelWidth = (proficiency) => {
  const levels = {
    'Native': '100%',
    'Fluent': '90%',
    'Advanced': '80%',
    'Intermediate': '60%',
    'Basic': '40%',
    'Beginner': '20%'
  };
  return levels[proficiency] || '50%';
};

const ModernTemplate = React.forwardRef(({ resumeData, user }, ref) => {
  if (!resumeData) return null;

  return (
    <Paper ref={ref} sx={{ maxWidth: '1000px', margin: '0 auto', overflow: 'hidden' }}>
      <Box sx={styles.container}>
       
          <Box sx={styles.sidebar}>
            <Box sx={styles.profile}>
              <Box
                component="img"
                src={user.photoURL}
                alt={resumeData.fullName || user.displayName}
                sx={styles.profileImage}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                  {resumeData.fullName || user.displayName }
              </Typography>
              {/* Social Links */}
            <Box sx={styles.socialLinks}>
              {resumeData.githubUrl && (
                <Link href={resumeData.githubUrl} target="_blank" sx={{ color: 'inherit' }}>
                  <GitHubIcon className="icon" />
                </Link>
              )}
              {resumeData.websiteUrl && (
                <Link href={resumeData.websiteUrl} target="_blank" sx={{ color: 'inherit' }}>
                  <WebsiteIcon className="icon" />
                </Link>
              )}
            </Box>
          </Box>

          {/* Contact Information */}
          <Box>
            <Typography variant="h6" sx={styles.sidebarHeading}>
              Contact
            </Typography>
            <Box sx={styles.contactItem}>
              <Email className="icon" />
              <Typography>{user.email}</Typography>
            </Box>
            {resumeData.phone && (
              <Box sx={styles.contactItem}>
                <Phone className="icon" />
                <Typography>{resumeData.phone}</Typography>
              </Box>
            )}
            {resumeData.address && (
              <Box sx={styles.contactItem}>
                <LocationOn className="icon" />
                <Typography>{resumeData.address}</Typography>
              </Box>
            )}
          </Box>

          {/* Skills with Ratings */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <Box>
              <Typography variant="h6" sx={styles.sidebarHeading}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {resumeData.skills.map((skill, index) => (
                  <Box key={index} sx={styles.skillRating}>
                    <Typography sx={{ flex: 1 }}>{skill.name}</Typography>
                    <Box className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="star">
                          {i < skill.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </Box>
                    {skill.yearsOfExperience && (
                      <Typography className="years">
                        {skill.yearsOfExperience}y
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Languages with Progress Bars */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <Box>
              <Typography variant="h6" sx={styles.sidebarHeading}>
                Languages
              </Typography>
              {resumeData.languages.map((lang, index) => (
                <Box key={index} sx={styles.languageLevel}>
                  <Typography sx={styles.sidebarText}>
                    {lang.name}
                  </Typography>
                  <Box 
                    sx={{
                      ...styles.progressBar,
                      '&::after': {
                        width: getLevelWidth(lang.proficiency)
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Box sx={styles.main}>
          {/* Professional Summary */}
          {resumeData.professionalSummary && (
            <Box sx={styles.section}>
              <Typography variant="h6" sx={styles.heading}>
                Professional Summary
              </Typography>
              <Typography sx={styles.text}>
                {resumeData.professionalSummary}
              </Typography>
            </Box>
          )}

          {/* Experience with Timeline */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <Box sx={styles.section}>
              <Typography variant="h6" sx={styles.heading}>
                Experience
              </Typography>
              {resumeData.experience
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((exp, index) => (
                  <Box key={index} sx={styles.experienceBox}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {exp.position}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#3498db' }}>
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>
                      {exp.startDate} - {exp.endDate || 'Present'} | {exp.location} | {exp.locationType}
                    </Typography>
                    <Typography sx={styles.text}>{exp.description}</Typography>
                    {exp.skills && exp.skills.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {exp.skills.map((skill, i) => (
                          <Chip
                            key={i}
                            label={skill}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(52, 152, 219, 0.1)',
                              color: '#2c3e50',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
            </Box>
          )}

       

          {/* Enhanced Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <Box sx={styles.section}>
              <Typography variant="h6" sx={styles.heading}>
                Certifications
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                {resumeData.certifications.map((cert, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(52, 152, 219, 0.05)',
                      border: '1px solid rgba(52, 152, 219, 0.1)',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {cert.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#3498db' }}>
                      {cert.organization}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {cert.issueDate}
                      {cert.expiryDate && ` - ${cert.expiryDate}`}
                    </Typography>
                    {cert.credentialId && (
                      <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.75rem', mt: 0.5 }}>
                        ID: {cert.credentialId}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Achievements with Timeline */}
          {resumeData.achievements && resumeData.achievements.length > 0 && (
            <Box sx={styles.section}>
              <Typography variant="h6" sx={styles.heading}>
                Achievements
              </Typography>
              {resumeData.achievements
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((achievement, index) => (
                  <Box key={index} sx={styles.experienceBox}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {achievement.date}
                    </Typography>
                    <Typography sx={styles.text}>
                      {achievement.description}
                    </Typography>
                  </Box>
                ))}
            </Box>
          )}

             {/* Education with Details */}
          {resumeData.education && resumeData.education.length > 0 && (
            <Box sx={styles.section}>
              <Typography variant="h6" sx={styles.heading}>
                Education
              </Typography>
              {resumeData.education
                .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                .map((edu, index) => (
                  <Box key={index} sx={styles.experienceBox}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {edu.degree} in {edu.fieldOfStudy}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#3498db' }}>
                      {edu.instituteName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {edu.fromDate} - {edu.toDate || 'Present'} | Grade: {edu.grade}
                    </Typography>
                    {edu.description && (
                      <Typography sx={styles.text}>{edu.description}</Typography>
                    )}
                  </Box>
                ))}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
});

export default ModernTemplate;
