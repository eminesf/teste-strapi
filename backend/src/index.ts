import type { Core } from '@strapi/strapi';
import { seed } from './seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * Libera as permissões públicas de leitura e cria conteúdo de exemplo
   * na primeira vez que o servidor sobe.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await seed(strapi);
    } catch (err) {
      strapi.log.error(`[seed] Falha ao popular conteúdo: ${err}`);
    }
  },
};
