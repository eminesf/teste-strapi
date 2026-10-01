import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Disponibiliza o painel em português (o usuário escolhe em Perfil > Idioma da interface)
    locales: ['pt-BR'],
  },
  bootstrap(_app: StrapiApp) {},
};
