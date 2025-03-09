import { Box, Container, Typography } from '@mui/material';

function Dashboard() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your expense tracker dashboard!
        </Typography>
      </Box>
    </Container>
  );
}

export default Dashboard; 