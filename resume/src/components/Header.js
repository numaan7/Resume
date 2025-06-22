import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const sections = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'preview', label: 'Resume Preview' },
];

export default function Header({ activeSection, onSectionChange }) {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Resume Builder
        </Typography>
        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%',
                    marginRight: 8 
                  }} 
                />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {user.displayName}
                </Typography>
              </Box>
              <Button color="inherit" onClick={signOut}>Sign Out</Button>
            </Box>
          </>
        ) : (
          <Button color="inherit" onClick={signInWithGoogle}>Sign In with Google</Button>
        )}
      </Toolbar>
      {user && (
        <Box sx={{ bgcolor: 'primary.dark' }}>
          <Tabs
            value={activeSection}
            onChange={(_, newValue) => onSectionChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="inherit"
            sx={{ '& .MuiTab-root': { color: 'white' } }}
          >
            {sections.map((section) => (
              <Tab
                key={section.id}
                label={section.label}
                value={section.id}
              />
            ))}
          </Tabs>
        </Box>
      )}
    </AppBar>
  );
}
