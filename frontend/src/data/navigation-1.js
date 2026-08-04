import duotone from '@/icons/duotone';

export const navigations = [{
  type: 'label',
  label: 'Sistema de cobranca'
}, {
  name: 'Operacao SGC',
  icon: duotone.Invoice,
  children: [{
    name: 'Area de trabalho',
    path: '/dashboard'
  }, {
    name: 'Acompanhamento de processos',
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
  icon: duotone.Settings,
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
  icon: duotone.ProjectChart,
  children: [{
    name: 'Metricas mensais',
    path: '/dashboard/planejamento/metricas'
  }, {
    name: 'Backlog priorizado',
    path: '/dashboard/planejamento/backlog'
  }]
}];
