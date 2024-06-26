import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { stringify } from 'node:querystring'

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

            const idIsPresent = database.update('tasks', id, {
                title,
                description,
                date
            })

            if(idIsPresent) {
                return res.writeHead(204).end()
            } else {
                return res.writeHead(404).end('{Message: "Tarefa não encontrada."}')
            }
        },
    },
    { // DELETE
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const idIsPresent = database.delete('tasks', id)

            if(idIsPresent) {
                return res.writeHead(204).end()
            } else {
                return res.writeHead(404).end('{Message: "Tarefa não encontrada."}')
            }
        },
    },
    { // PATCH
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const date = new Date()

            const idIsPresent = database.modify('tasks', id, date)

            if(idIsPresent) {
                return res.writeHead(204).end()
            } else {
                return res.writeHead(404).end('{Message: "Tarefa não encontrada."}')
            }
        },
    }
]