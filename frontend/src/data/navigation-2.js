import duotone from '@/icons/duotone';

export const navigation = [{
  name: 'Operacao SGC',
  Icon: duotone.Invoice,
  children: [{
    name: 'Visao geral',
    path: '/dashboard/verificacao'
  }, {
    name: 'Processos e cobrancas',
    path: '/dashboard/cobrancas'
  }, {
    name: 'Chats',
    path: '/dashboard/chat'
  }, {
    name: 'Regras de negocio',
    path: '/dashboard/verificacao/regras'
  }, {
    name: 'Timeline e logs',
    path: '/dashboard/verificacao/timeline'
  }]
}, {
  name: 'Configuracoes SGC',
  Icon: duotone.Settings,
  children: [{
    name: 'Visao geral',
    path: '/dashboard/configuracoes'
  }, {
    name: 'Gestao de usuarios',
    path: '/dashboard/configuracoes/usuarios',
    access: 'administrator'
  }, {
    name: 'Sincronizacao automatica RBX',
    path: '/dashboard/configuracoes/sincronizacao-rbx'
  }, {
    name: 'Fluxos de cobranca',
    path: '/dashboard/configuracoes/fluxos'
  }, {
    name: 'Faixas de atraso',
    path: '/dashboard/configuracoes/faixas-atraso'
  }, {
    name: 'Catalogos de motivos',
    path: '/dashboard/configuracoes/catalogos-motivos'
  }, {
    name: 'LGPD e retencao',
    path: '/dashboard/configuracoes/lgpd'
  }]
}, {
  name: 'Planejamento SGC',
  Icon: duotone.ProjectChart,
  children: [{
    name: 'Metricas mensais',
    path: '/dashboard/planejamento/metricas'
  }, {
    name: 'Backlog priorizado',
    path: '/dashboard/planejamento/backlog'
  }]
}];
