$(document).ready(function () {
    //Cargar todas las notas al cargar la página principal
    if (window.location.pathname === '/') {
        loadNotes();
    }

     //Manejar el envío del formulario para crear o actualizar una nota
    $('#note-form').submit(function (event) {
        event.preventDefault();

        const noteData = {
            title: $('#title').val(),
            content: $('#content').val(),
            tags: $('#tags').val().split(',').map(tag => tag.trim())
        };

        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('id');

        if (noteId) {
            $.ajax({
                url: `/api/notes/${noteId}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(noteData),
                success: function () {
                    window.location.href = '/';
                }
            });
        } else {
            $.post('/api/notes', noteData, function () {
                window.location.href = '/';
            });
        }
    });
});

//Función para cargar todas las notas y mostrarlas en la página principal
function loadNotes() {
    $.get('/api/notes', function (notes) {
        $('#note-list').empty();
        notes.forEach(note => {
            const noteElement = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${note.title}</h5>
                            <p class="card-text">${note.content}</p>
                            <p class="card-text"><small class="text-muted">Creado: ${new Date(note.createdAt).toLocaleString()}</small></p>
                            <p class="card-text"><small class="text-muted">Modificado: ${new Date(note.updatedAt).toLocaleString()}</small></p>
                            <a href="edit.html?id=${note.id}" class="btn btn-primary">Editar</a>
                        </div>
                    </div>
                </div>
            `;
            $('#note-list').append(noteElement);
        });
    });
}

// Función para eliminar una nota
function deleteNote(id) {
    $.ajax({
        url: `/api/notes/${id}`,
        method: 'DELETE',
        success: function () {
            window.location.href = '/';
        }
    });
}