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
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), academyApi()],
})
