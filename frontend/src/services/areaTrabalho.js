import { api } from './api';
export async function consultarAreaTrabalho(){const {data}=await api.get('/area-trabalho');return data;}
export async function consultarDashboardExecutivo(inicio,fim){const {data}=await api.get('/dashboards/executivo',{params:{inicio,fim}});return data;}
export async function consultarDashboardOperacao(){const {data}=await api.get('/dashboards/operacao');return data;}
export async function consultarDashboardEquipe(inicio,fim){const {data}=await api.get('/dashboards/equipe',{params:{inicio,fim}});return data;}
export async function consultarDashboardSla(){const {data}=await api.get('/dashboards/sla');return data;}
export async function consultarDashboardIntegracoes(){const {data}=await api.get('/dashboards/integracoes');return data;}
export async function consultarCatalogosOperacionais(){const {data}=await api.get('/catalogos/operacionais');return data;}
