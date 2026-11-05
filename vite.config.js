import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Serves /api/academy/assessment during `npm run dev`.
 *
 * In production Vercel runs api/academy/[action].js as a function. Vite's
 * dev server does not, which would leave the assessment step dead locally and
 * push someone toward "just grade it in the browser" — which would put the
 * answer key in the bundle.
 *
 * This mounts the SAME grading module as the deployed function, so local and
 * production behaviour cannot drift.
 */
function academyApi() {
  return {
    name: 'academy-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/academy/assessment', async (req, res) => {
        const respond = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        try {
          const { serveQuestions, gradeSubmission, parseSeed } =
            await server.ssrLoadModule('/lib/academy/grade.js')

          if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost')
            const lessonId = url.searchParams.get('lessonId')
            if (!lessonId) return respond(400, { error: 'lessonId is required' })

            const assessment = serveQuestions(
              lessonId,
              parseSeed(url.searchParams.get('seed'))
            )
            return assessment
              ? respond(200, assessment)
              : respond(404, { error: 'No assessment for that lesson' })
          }

          if (req.method === 'POST') {
            let raw = ''
            for await (const chunk of req) raw += chunk
            const { lessonId, answers } = JSON.parse(raw || '{}')
            if (!lessonId) return respond(400, { error: 'lessonId is required' })

            const result = gradeSubmission(lessonId, answers || {})
            return result
              ? respond(200, result)
              : respond(404, { error: 'No assessment for that lesson' })
          }

          respond(405, { error: 'Method not allowed' })
        } catch (err) {
          respond(500, { error: err.message })
        }
      })

      // Final certification exam. Reuses the production handler verbatim by
      // adapting the dev request to the req/res shape it expects, so the two
      // environments cannot drift apart.
      server.middlewares.use('/api/academy/final-exam', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule(
            '/lib/academy/api/finalExam.js'
          )
          const url = new URL(req.url, 'http://localhost')
          const query = Object.fromEntries(url.searchParams.entries())

          let body = {}
          if (req.method === 'POST') {
            let raw = ''
            for await (const chunk of req) raw += chunk
            body = JSON.parse(raw || '{}')
          }

          const shim = {
            status(code) {
              res.statusCode = code
              return shim
            },
            json(payload) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
              return shim
            },
            setHeader: (k, v) => res.setHeader(k, v),
          }
          await mod.default({ method: req.method, query, body }, shim)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      // Job recommendations, same handler shape as production
      server.middlewares.use('/api/academy/jobs', async (req, res) => {
        const respond = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        try {
          const { recommendJobs } = await server.ssrLoadModule(
            '/lib/academy/jobs/index.js'
          )
          const url = new URL(req.url, 'http://localhost')
          const list = (k) =>
            (url.searchParams.get(k) || '').split(',').filter(Boolean)

          const result = await recommendJobs(
            {
              completedModuleIds: list('completed'),
              inProgressModuleIds: list('inProgress'),
              level: Number(url.searchParams.get('level')) || 1,
            },
            { query: url.searchParams.get('query') || 'data analyst' }
          )
          respond(200, result)
        } catch (err) {
          respond(502, { error: 'Could not reach the job sources', detail: err.message })
        }
      })

      // Memotify. The production handlers on an in-memory backend, so the whole
      // product runs locally without a service account. See devBackend.mjs.
      server.middlewares.use('/api/memotify', async (req, res) => {
        try {
          const { install } = await server.ssrLoadModule('/lib/memotify/devBackend.mjs')
          const { routes } = await server.ssrLoadModule('/lib/memotify/handlers.js')
          install()
          const url = new URL(req.url, 'http://localhost')
          const action = url.pathname.split('/').filter(Boolean)[0] || url.searchParams.get('action')
          const route = routes[action]

          let body = {}
          if (req.method === 'POST') {
            let raw = ''
            for await (const chunk of req) raw += chunk
            body = JSON.parse(raw || '{}')
          }

          const shim = {
            status(code) {
              res.statusCode = code
              return shim
            },
            json(payload) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
              return shim
            },
            setHeader: (k, v) => res.setHeader(k, v),
            write: (chunk) => res.write(chunk),
            end: () => res.end(),
          }
          if (!route) return shim.status(404).json({ error: 'Unknown Memotify route' })
          const query = Object.fromEntries(url.searchParams.entries())
          await route({ method: req.method, query, body, headers: req.headers }, shim)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      // Mathematics. Reuses the production handler verbatim through the same
      // req/res shim the final exam uses, so the dev server and Vercel cannot
      // drift apart on the one endpoint that holds every maths answer.
      server.middlewares.use('/api/academy/maths', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/lib/academy/maths/api/maths.js')
          const url = new URL(req.url, 'http://localhost')
          const query = Object.fromEntries(url.searchParams.entries())

          let body = {}
          if (req.method === 'POST') {
            let raw = ''
            for await (const chunk of req) raw += chunk
            body = JSON.parse(raw || '{}')
          }

          const shim = {
            status(code) {
              res.statusCode = code
              return shim
            },
            json(payload) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
              return shim
            },
            setHeader: (k, v) => res.setHeader(k, v),
          }
          await mod.default({ method: req.method, query, body }, shim)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

/**
 * Lets the lab previews load their runtimes during `npm run dev`.
 *
 * A lab preview is a sandboxed iframe (no allow-same-origin), so its origin
 * is "null" and its <script src="/lab/…"> requests are cross-site no-cors
 * requests. Vite's dev server answers those with a script that throws
 * ("Cross-origin requests for classic scripts must be made with CORS mode
 * enabled"), so the practice phone and the React runtime never boot. The
 * /lab/ files are public, prebuilt bundles (the same files production serves
 * to anyone), so the check is lifted for them alone. Vite installs that check
 * before plugin middleware, hence the unshift.
 */
function labRuntimes() {
  return {
    name: 'academy-lab-runtimes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.stack.unshift({
        route: '',
        handle(req, _res, next) {
          if (req.url?.startsWith('/lab/') && req.headers['sec-fetch-dest'] === 'script') {
            delete req.headers['sec-fetch-mode']
          }
          next()
        },
      })
    },
  }
}

/**
 * The Academy's lessons, as the browser loads them (see src/academy/data/lessonIndex.js).
 *
 *   virtual:academy-lesson-index    a light index of every lesson: titles,
 *                                   modules, minutes, atom counts. No content.
 *   virtual:academy-modules         loadModule(slug, moduleId), resolving to
 *                                   that one module's full lessons.
 *
 * In a build both are computed here, in Node, from the same registry the
 * graders use, and every module becomes its own small chunk: opening a lesson
 * downloads its module (median ~30 KB) instead of its whole course (up to
 * 1.8 MB). Lessons are plain data, so they ship as JSON.
 *
 * In dev both read the full registry in the browser instead, so editing a
 * lesson file shows up on the next reload with nothing to regenerate.
 */
function academyLessons() {
  const INDEX = 'virtual:academy-lesson-index'
  const MODULES = 'virtual:academy-modules'
  const MODULE_PREFIX = 'virtual:academy-module/'
  const REGISTRY = '/src/academy/data/lessons/index.js'
  let command = 'build'
  let registry = null

  const loadRegistry = async () => {
    if (!registry) {
      const root = new URL('./src/academy/data/lessons/', import.meta.url)
      const [index, build] = await Promise.all([
        import(new URL('index.js', root).href),
        import(new URL('build.js', root).href),
      ])
      registry = { ...index, indexEntry: build.indexEntry }
    }
    return registry
  }

  return {
    name: 'academy-lessons',
    configResolved(config) {
      command = config.command
    },
    resolveId(id) {
      if (id === INDEX || id === MODULES || id.startsWith(MODULE_PREFIX)) return '\0' + id
    },
    async load(id) {
      if (!id.startsWith('\0virtual:academy-')) return
      const name = id.slice(1)

      if (command === 'serve') {
        if (name === INDEX) {
          return [
            `import * as registry from '${REGISTRY}'`,
            `import { indexEntry } from '/src/academy/data/lessons/build.js'`,
            `export default Object.fromEntries(registry.COURSE_SLUGS.map((slug) => [slug, registry.getCourseLessons(slug).map(indexEntry)]))`,
          ].join('\n')
        }
        if (name === MODULES) {
          return `export const loadModule = (slug, moduleId) => import('${REGISTRY}').then((r) => r.getModuleLessons(slug)[moduleId] || [])`
        }
        return
      }

      const r = await loadRegistry()

      if (name === INDEX) {
        const index = Object.fromEntries(
          r.COURSE_SLUGS.map((slug) => [slug, r.getCourseLessons(slug).map(r.indexEntry)])
        )
        return `export default ${JSON.stringify(index)}`
      }

      if (name === MODULES) {
        const entries = r.COURSE_SLUGS.flatMap((slug) =>
          Object.keys(r.getModuleLessons(slug)).map((moduleId) => {
            const key = `${slug}/${moduleId}`
            return `  ${JSON.stringify(key)}: () => import(${JSON.stringify(MODULE_PREFIX + key)}),`
          })
        )
        return [
          `const LOADERS = {`,
          ...entries,
          `}`,
          `export const loadModule = (slug, moduleId) => {`,
          `  const load = LOADERS[slug + '/' + moduleId]`,
          `  return load ? load().then((m) => m.default) : Promise.resolve([])`,
          `}`,
        ].join('\n')
      }

      const [slug, moduleId] = name.slice(MODULE_PREFIX.length).split('/')
      const lessons = r.getModuleLessons(slug)[moduleId] || []
      // JSON.parse of a string literal parses faster than the same object
      // written as a JavaScript literal, and these are the big chunks.
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(lessons))})`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), academyApi(), labRuntimes(), academyLessons()],
  // PGlite (PostgreSQL in WebAssembly, the SQL labs' server) loads its .wasm
  // and data files relative to its own module, which the dev pre-bundler
  // would break. The production build bundles it, worker and assets, as-is.
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
  worker: { format: 'es' },
  // dist/.vite/manifest.json, read by scripts/prerenderMeta.mjs to preload
  // each route's page chunk from that route's HTML.
  build: {
    manifest: true,
    rolldownOptions: {
      output: {
        // Name lesson chunks after their module (lesson-be-w7-express-…js)
        // rather than the virtual id, so they read sensibly in the network tab.
        chunkFileNames: (chunk) =>
          chunk.facadeModuleId?.includes('virtual:academy-module/')
            ? `assets/lesson-${chunk.facadeModuleId.split('/').pop()}-[hash].js`
            : 'assets/[name]-[hash].js',
      },
    },
  },
})
