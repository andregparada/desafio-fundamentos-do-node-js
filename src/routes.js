import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database

export const routes = [
    { // POST
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const date = new Date()

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: date,
                updated_at: date
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    { // GET
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    { // PUT
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            let title, description

            function checkIfPropExists (req, prop) {
                if (req.body[prop] === null) {
                    return prop = null
                } else {
                    return prop = req.body[prop]
                }
            }

            title = checkIfPropExists(req, "title")
            description = checkIfPropExists(req, "description")

            const date = new Date()

            database.update('tasks', id, {
                title,
                description,
                date
            })

            return res.writeHead(204).end()
        },
    },
    { // DELETE
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },
    { // PATCH
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const date = new Date()

            database.modify('tasks', id, date)

            return res.writeHead(204).end()
        },
    }
]