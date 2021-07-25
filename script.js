/* globals fetch, moment */

const url = 'http://localhost:3000/notes'
const form = document.querySelector('#notes-form')
const notesList = document.querySelector('#notes-list')


form.addEventListener('submit', function (e) {
    e.preventDefault()
    let notesText = document.getElementById('notes-text').value
    let notesTitle = document.getElementById('notes-title').value
    let notesInfo = {
        body: notesText,
        title: notesTitle,
    }
    console.log(notesInfo)
    createNote(notesInfo)

form.reset()
})



// Removing
notesList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
    deleteNote(e.target)
}

if (e.target.classList.contains('edit')) {
    updateNote(e.target)
}

// notesList.addEventListener('click', function (e){
//     if(e.target.classList.contains('edit'))
//     const editForm = document.createElement('form')
//     editForm. id = "edit-form"
//     const editInput = document.createElement('input')
//     e.target.parentElement.appendChild(form)
//     e.target.parentElement.appendChild(editInput)
//     console.log('edit note')
//     // updateNote(e.target)
// } )

// if (e.target.classList.contains('edit')) {
//     updateNote(e.target)
// }
})

function renderNotesItem (noteObj) {
const itemEl = document.createElement('li')
itemEl.id = noteObj.id
itemEl.classList.add(
    'lh-copy',
    'pv3',
    'ba',
    'bl-0',
    'bt-0',
    'br-0',
    'b--dotted',
    'b--black-3')

renderNotesText(itemEl, noteObj)
console.log(itemEl)
notesList.appendChild(itemEl)
}

// This function is taking two arguments: a note <li> a note object.
function renderNotesText (notesListItem, notesObj) {
notesListItem.innerHTML = `<span class="dib w-60">${notesObj.body}</span><i class="ml2 dark-red fas fa-times delete"></i><i class="ml3 fas fa-edit edit"></i>`
}

// Helper function to delete content of list
function clearList() {
    notesList.innerHTML = '';    
}

// CRUD Functions 

// GET request
function listNotes () {
    // Delete current list
    clearList();
    // TODO remove later
    console.log(`Cleared list...`);
    fetch('http://localhost:3000/notes')
        .then((response) => response.json())
        .then((data) => {
        for (const note of data) {
            console.log(note)
            renderNotesItem(note)
            }
        })
}

// POST request
function createNote (notesInfo) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: notesInfo.title,
            body: notesInfo.body,
            created_at: moment().format()
    })
})
    .then(response => response.json())
    .then(() => renderNotesItem(notesInfo))
}

// DELETE request
function deleteNote (element) {
    const noteId = element.parentElement.id
    fetch(url + '/' + `${noteId}`, {
    method: 'DELETE'
}).then(() => element.parentElement.remove())
}

// UPDATE note
function updateNote (element) {
    const noteId = element.parentElement.id
    const notesText = document.querySelector('#notes-text').value
    // TODO Remove later
    console.log(`noteId ${noteId}`);
    console.log(`notesText ${notesText}`);
    fetch(url + '/' + `${noteId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
            title: notesText,
            body: notesText ,
            updated_at: moment().format()
        })
        })
        .then((response) => {
            return response.json()
        })
        .then(data => {
            // TODO Remove later
            console.log(`data ${data}`);
            listNotes();
            form.reset();
        }).catch((error) => {
            console.log(`==> error: ${error}`);
          })
        
    }

listNotes()
