import duotone from '@/icons/duotone';

export const navigation = [{
  name: 'Operação SGC',
  Icon: duotone.Invoice,
  children: [{
    name: 'Visão geral',
    path: '/dashboard/verificacao'
  }, {
    name: 'Processos e cobranças',
    path: '/dashboard/cobrancas'
  }, {
    name: 'Chats',
    path: '/dashboard/chat'
  }, {
    name: 'Regras de negócio',
    path: '/dashboard/verificacao/regras'
  }, {
    name: 'Timeline e logs',
    path: '/dashboard/verificacao/timeline'
  }]
}, {
  name: 'Configurações SGC',
  Icon: duotone.Settings,
  children: [{
    name: 'Visão geral',
    path: '/dashboard/configuracoes'
  }, {
    name: 'Sincronização RBX',
    path: '/dashboard/configuracoes/sincronizacao-rbx'
  }, {
    name: 'Fluxos de cobrança',
    path: '/dashboard/configuracoes/fluxos'
  }, {
    name: 'Faixas de atraso',
    path: '/dashboard/configuracoes/faixas-atraso'
  }, {
    name: 'Catálogos de motivos',
    path: '/dashboard/configuracoes/catalogos-motivos'
  }, {
    name: 'LGPD e retenção',
    path: '/dashboard/configuracoes/lgpd'
  }]
}, {
  name: 'Planejamento SGC',
  Icon: duotone.ProjectChart,
  children: [{
    name: 'Métricas mensais',
    path: '/dashboard/planejamento/metricas'
  }, {
    name: 'Backlog priorizado',
    path: '/dashboard/planejamento/backlog'
  }]
}];
