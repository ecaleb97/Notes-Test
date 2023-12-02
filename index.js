const express = require('express')
const app = express()
const cors = require('cors')

app.disable('x-powered-by')
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
]

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

/* Generate id */
function generateId() {
  const ids = notes.map(note => note.id)
  const maxId = notes.length > 0
    ? Math.max(...ids)
    : 0

  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const note = request.body
  
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }

  const newNote = {
    id: generateId(),
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
  }

  notes = [...notes, newNote]

  console.log(notes)

  response.status(201).json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})