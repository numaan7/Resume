import { Box, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Made with {'❤️'} by{' '}
        <Link
          href="https://in.linkedin.com/in/mohammed-numaan"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'inherit',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          Mohammed Numaan
        </Link>
      </Typography>
    </Box>
  );
}
