const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(PUBLIC));

// almacenamento de notas
let notes = [];
let currentId = 1;

// página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
});

// pagina de editar y crear las notas 
app.get('/edit', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'edit.html'));
});

// crea nueva nota
app.post('/api/notes', (req, res) => {
    const { title, content, tags } = req.body;
    if (!title || !content) {
        return res.status(400).send('Título y contenido son obligatorios');
    }

    const newNote = {
        id: currentId++,
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: tags || []
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

// actualizador de notas
app.put('/api/notes/:id', (req, res) => {
    const { title, content, tags } = req.body;
    const note = notes.find(n => n.id === parseInt(req.params.id));

    if (note) {
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.updatedAt = new Date();
        res.json(note);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

// obtener todas las notas
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// elimina nota
app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(n => n.id !== parseInt(req.params.id));
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`🥑Server is running on port ${PORT}`);
});