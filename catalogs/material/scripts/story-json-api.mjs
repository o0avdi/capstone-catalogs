import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const storiesRoot = resolve(projectRoot, 'src', 'stories');

function toPosixPath(path) {
  return path.split(sep).join('/');
}

function toDisplayName(exportName) {
  return exportName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function toId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function findStoryFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);

      if (entry.isDirectory()) return findStoryFiles(path);
      if (/\.stories\.tsx?$/.test(entry.name)) return [path];

      return [];
    }),
  );

  return files.flat().sort();
}

export function parseStoryFile(source, filePath) {
  const relativePath = toPosixPath(relative(projectRoot, filePath));
  const fallbackTitle = relativePath
    .replace(/^src\/stories\//, '')
    .replace(/\.stories\.tsx?$/, '')
    .split('/')
    .map(toDisplayName)
    .join('/');
  const metaStart = source.search(/\bconst\s+meta\b/);
  const metaSource = metaStart >= 0 ? source.slice(metaStart) : source;
  const title = metaSource.match(/\btitle\s*:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? fallbackTitle;
  const framework =
    source.includes('@storybook/react') || extname(filePath) === '.tsx' ? 'react' : 'angular';
  const exports = [...source.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=/g)];
  const stories = exports.map((match) => {
    const exportName = match[1];
    const name = toDisplayName(exportName);

    return {
      id: `${toId(title)}--${toId(exportName)}`,
      exportName,
      name,
    };
  });

  return {
    id: toId(relativePath),
    file: relativePath,
    title,
    framework,
    stories,
  };
}

export async function collectStoryCatalog({ includeSource = false } = {}) {
  const paths = await findStoryFiles(storiesRoot);
  const files = await Promise.all(
    paths.map(async (path) => {
      const source = await readFile(path, 'utf8');
      const parsed = parseStoryFile(source, path);

      return includeSource ? { ...parsed, source } : parsed;
    }),
  );

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    totalStories: files.reduce((total, file) => total + file.stories.length, 0),
    files,
  };
}

function toShadcnComponent(file) {
  const component = toId(file.title.replace(/^Shadcn\//, ''));

  return {
    component,
    title: file.title,
    file: file.file,
    framework: file.framework,
    storyCount: file.stories.length,
    stories: file.stories,
    source: file.source,
  };
}

async function collectShadcnCatalog() {
  const catalog = await collectStoryCatalog({ includeSource: true });
  const components = catalog.files
    .filter((file) => file.title.startsWith('Shadcn/'))
    .map(toShadcnComponent);

  return {
    schemaVersion: 1,
    generatedAt: catalog.generatedAt,
    totalComponents: components.length,
    totalStories: components.reduce((total, component) => total + component.storyCount, 0),
    components,
  };
}

function sendJson(response, status, body, extraHeaders = {}) {
  response.writeHead(status, {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}

export function createStoryApiServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method === 'OPTIONS') {
        response.writeHead(204, {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Origin': '*',
        });
        response.end();
        return;
      }

      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Method not allowed' }, { Allow: 'GET, OPTIONS' });
        return;
      }

      const url = new URL(request.url ?? '/', 'http://localhost');

      if (url.pathname === '/api/health') {
        sendJson(response, 200, { status: 'ok' });
        return;
      }

      if (url.pathname === '/api' || url.pathname === '/api/') {
        const catalog = await collectShadcnCatalog();
        sendJson(response, 200, {
          message: 'Use /api/:component to view one Shadcn component as JSON.',
          allComponents: '/api/shadcn',
          totalComponents: catalog.totalComponents,
          components: catalog.components.map((component) => ({
            component: component.component,
            title: component.title,
            url: `/api/${component.component}`,
            storyCount: component.storyCount,
          })),
        });
        return;
      }

      if (url.pathname === '/api/shadcn') {
        sendJson(response, 200, await collectShadcnCatalog());
        return;
      }

      if (url.pathname === '/api/stories') {
        sendJson(response, 200, await collectStoryCatalog());
        return;
      }

      const componentMatch = url.pathname.match(/^\/api\/([^/]+)\/?$/);

      if (componentMatch) {
        const requestedComponent = toId(decodeURIComponent(componentMatch[1]));
        const catalog = await collectShadcnCatalog();
        const component = catalog.components.find(
          (entry) => entry.component === requestedComponent,
        );

        if (component) {
          sendJson(response, 200, component);
          return;
        }

        sendJson(response, 404, {
          error: 'Shadcn component not found',
          component: requestedComponent,
          availableComponents: catalog.components.map((entry) => entry.component),
        });
        return;
      }

      sendJson(response, 404, {
        error: 'Not found',
        endpoints: ['/api', '/api/health', '/api/shadcn', '/api/:component', '/api/stories'],
      });
    } catch (error) {
      console.error(error);
      sendJson(response, 500, { error: 'Unable to build the story catalog' });
    }
  });
}

async function main() {
  const command = process.argv[2] ?? 'serve';

  if (command !== 'serve') {
    throw new Error(`Unknown command: ${command}. Use "serve".`);
  }

  const port = Number.parseInt(process.env.PORT ?? '6011', 10);
  const host = process.env.HOST ?? '127.0.0.1';

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }

  const server = createStoryApiServer();
  server.listen(port, host, () => {
    console.log(`Story JSON API listening on http://${host}:${port}`);
    console.log(`Components: http://${host}:${port}/api`);
    console.log(`Accordion: http://${host}:${port}/api/accordion`);
    console.log(`All Shadcn: http://${host}:${port}/api/shadcn`);
  });
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
