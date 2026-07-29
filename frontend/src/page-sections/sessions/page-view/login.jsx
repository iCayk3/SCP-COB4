import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// CUSTOM DEFINED HOOK
import { useAuth } from '@/hooks/useAuth';
// CUSTOM LAYOUT COMPONENT
import Layout from '../Layout';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
// CUSTOM ICON COMPONENTS
const validationSchema = Yup.object().shape({
  email: Yup.string().max(80).required('Informe o usuario'),
  password: Yup.string().min(8, 'A senha deve ter ao menos 8 caracteres').required('Informe a senha'),
  remember: Yup.boolean().default(true)
});
export default function LoginPageView() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    signInWithEmail
  } = useAuth();
  const initialValues = {
    email: 'administrador',
    password: '',
    remember: true
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting,
      isValid
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      await signInWithEmail(values.email, values.password);
    } catch (error) {
      console.log(error);
    }
  });
  return <Layout login>
      <Box maxWidth={550} p={4}>
        <Typography variant="h4" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Entrar no SCP-COB4
        </Typography>

        <Typography variant="body2" fontWeight={500} mt={1} mb={6} color="text.secondary">
          Use seu identificador e senha cadastrados pelo administrador.
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" fontSize={16} mb={1.5}>
                Usuario
              </Typography>

              <TextField fullWidth name="email" placeholder="Informe seu identificador" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth placeholder="Senha" type={showPassword ? 'text' : 'password'} name="password" slotProps={{
              input: {
                endAdornment: <ButtonBase disableRipple disableTouchRipple onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </ButtonBase>
              }
            }} />

              <FlexBetween my={1}>
                <FlexBox alignItems="center" gap={1}>
                  <Checkbox sx={{
                  p: 0
                }} name="remember" checked={watch('remember')} onChange={e => setValue('remember', e.target.checked)} />
                  <Typography variant="body2" fontWeight={500}>
                    Manter conectado
                  </Typography>
                </FlexBox>

              </FlexBetween>
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                Entrar
              </Button>
            </Grid>
          </Grid>
        </FormProvider>

      </Box>
    </Layout>;
}
