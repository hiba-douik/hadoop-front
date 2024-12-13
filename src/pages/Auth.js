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

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin && (!email || !password)) {
      alert('Veuillez remplir tous les champs requis pour la connexion.');
      return;
    }

    if (!isLogin && (!userId || !username || !email || !password)) {
      alert('Veuillez remplir tous les champs requis pour l’inscription.');
      return;
    }

    try {
      const userData = { userId, username, email, password };
      const response = isLogin
          ? await axios.post('http://localhost:3000/api/login', { email, password })
          : await axios.post('http://localhost:3000/users', userData);

      if (isLogin) {
        sessionStorage.setItem('authenticatedUser', JSON.stringify(response.data));
        navigate('/RecetteForm');
      } else {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // Retourne à l'écran de connexion
      }
    } catch (error) {
      alert('Une erreur s\'est produite. Veuillez réessayer.');
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
                  <>
                    <Grid item xs={12}>
                      <TextField
                          label="Identifiant (userId)"
                          fullWidth
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          label="Nom complet (username)"
                          fullWidth
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                    </Grid>
                  </>
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
                  {isLogin ? 'Connexion' : 'S’inscrire'}
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
