import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Core } from '@strapi/strapi';

/**
 * Libera leitura pública (sem login) das APIs usadas pelo site
 * e popula o CMS com conteúdo de exemplo na primeira execução.
 */

const PUBLIC_ACTIONS = [
  'api::pagina-inicial.pagina-inicial.find',
  'api::servico.servico.find',
  'api::servico.servico.findOne',
  'api::noticia.noticia.find',
  'api::noticia.noticia.findOne',
];

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_ACTIONS) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!exists) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });
    }
  }
}

async function uploadRemoteImage(strapi: Core.Strapi, seed: string, name: string) {
  try {
    const res = await fetch(`https://picsum.photos/seed/${seed}/1600/1000`);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    const filepath = path.join(os.tmpdir(), `${seed}-${Date.now()}.jpg`);
    fs.writeFileSync(filepath, buffer);

    const [file] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: { fileInfo: { name, alternativeText: name, caption: name } },
        files: {
          filepath,
          originalFilename: `${seed}.jpg`,
          mimetype: 'image/jpeg',
          size: buffer.length,
        },
      });

    fs.rmSync(filepath, { force: true });
    return file?.id ?? null;
  } catch (err) {
    strapi.log.warn(`[seed] Não foi possível baixar imagem de exemplo (${seed}): ${err}`);
    return null;
  }
}

const p = (text: string) => ({ type: 'paragraph', children: [{ type: 'text', text }] });
const h2 = (text: string) => ({ type: 'heading', level: 2, children: [{ type: 'text', text }] });
const quote = (text: string) => ({ type: 'quote', children: [{ type: 'text', text }] });
const list = (items: string[]) => ({
  type: 'list',
  format: 'unordered',
  children: items.map((text) => ({ type: 'list-item', children: [{ type: 'text', text }] })),
});

const SERVICOS = [
  {
    titulo: 'Estratégia Digital',
    descricao:
      'Diagnóstico completo da sua presença online e um plano de ação claro para crescer com consistência.',
    icone: 'grafico',
    ordem: 1,
  },
  {
    titulo: 'Desenvolvimento Web',
    descricao:
      'Sites e sistemas rápidos, seguros e fáceis de atualizar — construídos com as tecnologias mais modernas.',
    icone: 'codigo',
    ordem: 2,
  },
  {
    titulo: 'Design & Marca',
    descricao:
      'Identidade visual que comunica quem você é e cria conexão real com o seu público.',
    icone: 'pincel',
    ordem: 3,
  },
  {
    titulo: 'Infraestrutura em Nuvem',
    descricao:
      'Hospedagem escalável e monitorada 24/7 para o seu negócio nunca sair do ar.',
    icone: 'nuvem',
    ordem: 4,
  },
  {
    titulo: 'Segurança',
    descricao: 'Boas práticas, backups automáticos e proteção de dados em conformidade com a LGPD.',
    icone: 'escudo',
    ordem: 5,
  },
  {
    titulo: 'Suporte Dedicado',
    descricao: 'Um time próximo, que responde rápido e acompanha cada etapa do seu projeto.',
    icone: 'suporte',
    ordem: 6,
  },
];

const NOTICIAS = [
  {
    titulo: 'Inauguramos nosso novo escritório no centro da cidade',
    resumo:
      'Um espaço pensado para colaboração, criatividade e para receber nossos clientes de portas abertas.',
    categoria: 'Empresa',
    autor: 'Mariana Costa',
    seed: 'escritorio',
    conteudo: [
      p('Depois de meses de planejamento, temos o prazer de anunciar a inauguração do nosso novo escritório. O espaço foi projetado para estimular a colaboração entre os times e oferecer uma experiência acolhedora para quem nos visita.'),
      h2('Um ambiente feito para pessoas'),
      p('Com áreas abertas, salas de reunião equipadas e um café sempre fresco, o novo espaço reflete a forma como trabalhamos: com proximidade, transparência e muita troca de ideias.'),
      quote('Queríamos um lugar onde nossos clientes se sentissem parte do time. — Mariana Costa, diretora'),
      p('Venha nos visitar! Basta agendar um horário pela página de contato.'),
    ],
  },
  {
    titulo: '5 tendências de tecnologia que vão transformar pequenos negócios',
    resumo:
      'Inteligência artificial, automação e experiências mobile estão mais acessíveis do que nunca. Veja como aproveitar.',
    categoria: 'Tecnologia',
    autor: 'Rafael Lima',
    seed: 'tecnologia',
    conteudo: [
      p('A tecnologia deixou de ser um privilégio das grandes empresas. Hoje, ferramentas poderosas estão ao alcance de qualquer negócio — e quem sai na frente colhe os resultados.'),
      h2('As principais tendências'),
      list([
        'Assistentes com inteligência artificial no atendimento',
        'Automação de tarefas repetitivas',
        'Sites gerenciáveis por CMS, sem depender de programador',
        'Pagamentos instantâneos integrados',
        'Análise de dados em tempo real',
      ]),
      p('O mais importante é começar pequeno, medir os resultados e evoluir aos poucos.'),
    ],
  },
  {
    titulo: 'Como um CMS headless dá autonomia para o seu time de marketing',
    resumo:
      'Atualizar textos, imagens e notícias do site sem abrir um chamado técnico: entenda como funciona na prática.',
    categoria: 'Dicas',
    autor: 'Equipe de Comunicação',
    seed: 'cms',
    conteudo: [
      p('Com um CMS headless como o Strapi, o conteúdo fica separado do visual do site. Isso significa que o time de marketing pode publicar novidades a qualquer momento, enquanto o site continua rápido e bonito.'),
      h2('Na prática'),
      list([
        'Acesse o painel administrativo com seu usuário',
        'Crie ou edite um conteúdo (como esta notícia!)',
        'Clique em Publicar — pronto, já aparece no site',
      ]),
      quote('Esta própria notícia foi cadastrada pelo painel do Strapi.'),
    ],
  },
  {
    titulo: 'Participamos do maior evento de inovação do ano',
    resumo:
      'Nosso time esteve presente com palestras e um estande interativo que recebeu mais de 2 mil visitantes.',
    categoria: 'Eventos',
    autor: 'Juliana Rocha',
    seed: 'evento',
    conteudo: [
      p('Foram três dias intensos de conteúdo, networking e muitas conversas inspiradoras. Nosso estande interativo apresentou cases reais de transformação digital.'),
      p('Agradecemos a todos que passaram por lá. Em breve publicaremos o material das palestras aqui no site.'),
    ],
  },
  {
    titulo: 'Mercado digital cresce 18% e abre novas oportunidades',
    resumo:
      'Pesquisa recente mostra que empresas com presença online sólida cresceram quase o dobro das demais.',
    categoria: 'Mercado',
    autor: 'Rafael Lima',
    seed: 'mercado',
    conteudo: [
      p('Os números confirmam o que já percebíamos no dia a dia: investir em presença digital deixou de ser opcional.'),
      h2('O que isso significa para você'),
      p('Empresas que contam com site profissional, conteúdo atualizado e bons canais de atendimento estão conquistando mais clientes — e fidelizando melhor os que já têm.'),
    ],
  },
];

export async function seed(strapi: Core.Strapi) {
  await setPublicPermissions(strapi);

  const store = strapi.store({ type: 'plugin', name: 'demo-seed' });
  if (await store.get({ key: 'done' })) return;

  strapi.log.info('[seed] Populando conteúdo de exemplo...');

  const heroImagem = await uploadRemoteImage(strapi, 'hero-equipe', 'Equipe trabalhando');
  await strapi.documents('api::pagina-inicial.pagina-inicial').create({
    data: {
      heroEtiqueta: 'Nova experiência digital',
      heroTitulo: 'Transformamos ideias em experiências digitais memoráveis',
      heroSubtitulo:
        'Estratégia, design e tecnologia trabalhando juntos para levar a sua empresa ao próximo nível. Todo este texto é editável pelo painel do Strapi.',
      heroImagem,
      botaoTexto: 'Fale com a gente',
      secaoTitulo: 'Soluções completas para o seu negócio',
      secaoSubtitulo:
        'Cada card abaixo é um item da coleção "Serviço" no Strapi. Adicione, edite ou reordene quando quiser.',
    } as any,
    status: 'published',
  });

  for (const servico of SERVICOS) {
    await strapi.documents('api::servico.servico').create({
      data: servico as any,
      status: 'published',
    });
  }

  for (const [i, { seed: imgSeed, ...noticia }] of NOTICIAS.entries()) {
    const capa = await uploadRemoteImage(strapi, imgSeed, noticia.titulo);
    const slug = noticia.titulo
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // espaça as datas para a listagem ficar natural
    const publishedAt = new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString();

    await strapi.documents('api::noticia.noticia').create({
      data: { ...noticia, slug, capa, publishedAt } as any,
      status: 'published',
    });
  }

  await store.set({ key: 'done', value: true });
  strapi.log.info('[seed] Conteúdo de exemplo criado com sucesso.');
}
