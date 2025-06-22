import { useState } from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import PersonalInfo from './components/PersonalInfo';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Languages from './components/Languages';
import Achievements from './components/Achievements';
import Preview from './components/Preview';
import PublicResume from './components/PublicResume';

const theme = createTheme({
  typography: {
    fontFamily: 'Calibri, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [activeSection, setActiveSection] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    languages: [],
    achievements: [],
  });

  // Check if we're viewing a public resume
  const path = window.location.pathname;
  const isPublicResume = path.startsWith('/resume/');
  const publicId = isPublicResume ? path.split('/resume/')[1] : null;

  if (isPublicResume) {
    return (
      <>
        <CssBaseline />
        <Container maxWidth="md">
          <PublicResume publicId={publicId} />
        </Container>
      </>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfo
          data={resumeData.personalInfo}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, personalInfo: data })
          } />;
      case 'education':
        return <Education
          data={resumeData.education}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, education: data })
          } />;
      case 'experience':
        return <Experience
          data={resumeData.experience}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, experience: data })
          } />;
      case 'skills':
        return <Skills
          data={resumeData.skills}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, skills: data })
          } />;
      case 'certifications':
        return <Certifications
          data={resumeData.certifications}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, certifications: data })
          } />;
      case 'languages':
        return <Languages
          data={resumeData.languages}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, languages: data })
          } />;
      case 'achievements':
        return <Achievements
          data={resumeData.achievements}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, achievements: data })
          } />;
      case 'preview':
        return <Preview {...resumeData} />;
      default:
        return <PersonalInfo
          data={resumeData.personalInfo}
          onUpdate={(data) =>
            setResumeData({ ...resumeData, personalInfo: data })
          } />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {renderSection()}
        </Container>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
