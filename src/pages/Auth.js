import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
} from '@mui/material';

const API_BASE_URL = 'http://localhost:5000/api/users';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (isLogin && (!email || !password)) {
      alert("Veuillez remplir tous les champs requis pour la connexion.");
      return;
    }
  
    if (!isLogin && (!username || !email || !password)) {
      alert("Veuillez remplir tous les champs requis pour l'inscription.");
      return;
    }
  
    try {
      const userData = { username, email, password };
      const response = isLogin
        ? await axios.post(`${API_BASE_URL}/login`, { email, password })
        : await axios.post(`${API_BASE_URL}/register`, userData);
  
      if (response.data && response.data.email) {
        const userDataToStore = {
          email: response.data.email,
          username: response.data.username,
          accessToken: response.data.accessToken,
          userId: response.data.userId  // Utilisation du userId généré par le backend
        };
        sessionStorage.setItem('authenticatedUser', JSON.stringify(userDataToStore));
        navigate('/RecetteForm');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      alert("Une erreur s'est produite. Veuillez réessayer.");
      console.error('Error:', error);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
        <Box textAlign="center" marginBottom={3}>
          <Typography variant="h4">{isLogin ? 'Se connecter' : 'Inscription'}</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  label="Nom d'utilisateur"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isLogin ? 'Connexion' : "S'inscrire"}
              </Button>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="body2">
                {isLogin ? (
                  <>
                    Pas de compte ?{' '}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(false);
                      }}
                    >
                      Inscrivez-vous
                    </Link>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{' '}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(true);
                      }}
                    >
                      Connectez-vous
                    </Link>
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

