/* globals fetch, moment */

const url = 'http://localhost:3000/notes/'
const form = document.querySelector('#notes-form')
const notesList = document.querySelector('#notes-list')


// Here I am having my form element listen for a submit event
// Once that event is triggered it will render my newly created
// note item on the DOM
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
  // this will clear my input after submitting a note
form.reset()
})



// Here I am removing a note item from the DOM
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

/* DOM manipulation */

// This function will handle grabing my list of todos
// and rendering them to the page with DOM manipulation
function renderNotesItem (noteObj) {
const itemEl = document.createElement('li')
itemEl.id = noteObj.id
itemEl.classList.add(
    // These strings are TACHYONS class names
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


/* CRUD Functions */

// GET request
function listNotes () {
  // I am making a GET request to localhost:3000/todos
fetch('http://localhost:3000/notes/')
  // My first promise is returning the response from my request in JSON format
    .then((response) => response.json())
  // Now I am extrapolating the data that I need from the response object
  // in the second response
    .then((data) => {
      // here is where I am going to loop through my array
      // of note objects.
    for (const note of data) {
        console.log(note)
        renderNotesItem(note)
        }
    })
}

// POST request
function createNote (notesInfo) {
  // I am making a POST request so that I can add
  // a new note to my database.
    fetch(url, {
    // I need to send some extra information with this request
    // specifically i am sending the value of my input on the DOM
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: notesInfo.title,
            body: notesInfo.body,
      // here I am creating a new key and using moment().format()
      // to create a time string that captures when the new note was created
            created_at: moment().format()
    })
})
    .then(response => response.json())
    .then(() => renderNotesItem(notesInfo))
}

// DELETE request
function deleteNote (element) {
  // I need to find the note item that I want to remove from the DOM
  // and delete from the database by grabbing on to the note's id
    const noteId = element.parentElement.id
  // This request url is slightly different than your GET request url
  // I am taking my base url localhost:3000/notes and adding
  // /${todoId} where noteId equals the id of todoId element
    fetch(url + '/' + `${noteId}`, {
    // I need to send some information with this request
    // I am telling the API that the request method is DELETE
    method: 'DELETE'
    // here is where I am moving the note from the DOM
    // so we don't see it on our page anymore
}).then(() => element.parentElement.remove())
}

// UPDATE note
function updateNote (element) {
    const noteId = element.parentElement.id
    const notesText = document.querySelector('#notes-text')
    fetch(url + '/' + `${noteId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
            title: notesText,
            body: notesText ,
            updated_at: moment().format()
        })
        .then((response) => {
        return response.json()
        })
        .then(data => {
            renderNotesItem(element.parentElement, data)
        })
        
    }

    )}

listNotes()
