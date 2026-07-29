import { useState } from 'react';
import { Navigate } from 'react-router';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function ChangePasswordPage() {
  const { isAuthenticated, user, changePassword } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!isAuthenticated) return <Navigate replace to="/login" />;

  const submit = async event => {
    event.preventDefault();
    setErro('');
    if (novaSenha !== confirmacao) {
      setErro('A confirmação não corresponde à nova senha.');
      return;
    }
    setSalvando(true);
    try {
      await changePassword(senhaAtual, novaSenha);
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível alterar a senha.');
    } finally {
      setSalvando(false);
    }
  };

  return <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center', p: 2 }}>
    <Paper component="form" onSubmit={submit} sx={{ width: '100%', maxWidth: 480, p: 4 }}>
      <Stack spacing={2.5}>
        <Typography variant="h4">Alterar senha</Typography>
        <Typography color="text.secondary">
          {user?.trocaSenhaObrigatoria
            ? 'A troca da senha inicial é obrigatória antes de acessar o sistema.'
            : 'Defina uma nova senha para sua conta.'}
        </Typography>
        {erro && <Alert severity="error">{erro}</Alert>}
        <TextField label="Senha atual" type="password" value={senhaAtual}
          onChange={event => setSenhaAtual(event.target.value)} required />
        <TextField label="Nova senha" type="password" value={novaSenha}
          onChange={event => setNovaSenha(event.target.value)} required
          helperText="12 a 72 caracteres, com maiúscula, minúscula, número e símbolo." />
        <TextField label="Confirmar nova senha" type="password" value={confirmacao}
          onChange={event => setConfirmacao(event.target.value)} required />
        <Button type="submit" variant="contained" disabled={salvando}>
          {salvando ? 'Alterando...' : 'Alterar senha'}
        </Button>
      </Stack>
    </Paper>
  </Box>;
}
