const notesRouter = require('express').Router()
const Note = require('../models/note')
const userExtractor = require('../utils/middleware').userExtractor

notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
	response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
	const note = await Note.findById(request.params.id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})

/* function getTokenFrom(request) {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
} */

notesRouter.post('/', userExtractor, async (request, response) => {
	const body = request.body
	// eslint-disable-next-line no-undef

	const user = request.user

	const note = new Note({
		content: body.content,
		important: body.important || false,
		user: user._id
	})

	const savedNote = await note.save()
	user.notes = user.notes.concat(savedNote._id)
	await user.save()
	
	response.status(201).json(savedNote)
})

notesRouter.delete('/:id', userExtractor, async (request, response) => {
	await Note.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

notesRouter.put('/:id', userExtractor, async (request, response) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
	response.json(updatedNote)
})

module.exports = notesRouter