// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Get saved theme from local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

// Switch theme and save it to local storage
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  themeToggle.textContent = isDarkMode ?  '🌙': '☀️';
});

// Notes functionality
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');
const restoreBtn = document.getElementById('restore-btn');
const colorBtns = document.querySelectorAll('.color-btn');

let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
let deletedNote = null; // Store the deleted note for potential restoration

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to calculate brightness of the color
function getBrightness(color) {
  color = color.slice(1); // Remove the '#' from the color string

  // Extract RGB values
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  // Using the luminance formula to calculate brightness
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return brightness;
}

// Load and render saved notes
function renderNotes() {
  notesContainer.innerHTML = '';
  savedNotes.forEach((note, index) => {
    const noteElement = createNoteElement(note.content, note.color, index);
    notesContainer.appendChild(noteElement);
  });
}

// Create a new note element
function createNoteElement(content = '', color = '', index = null) {
  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');
  
  
  // If no color is provided, generate a random color
  if (!color) {
    color = getRandomColor();
  }

  noteDiv.style.backgroundColor = color;
  
  // Calculate brightness of background color and set appropriate text color
  const brightness = getBrightness(color);
  const textColor = brightness > 128 ? '#000000' : '#FFFFFF'; // Dark text for light background, light text for dark background
  noteDiv.style.color = textColor;


  if (body.classList.contains('dark-mode')) noteDiv.classList.add('dark-mode');

  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.addEventListener('input', () => saveNoteContent(index, textarea.value));

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(index);
    }
  });

  noteDiv.appendChild(textarea);
  noteDiv.appendChild(deleteBtn);

  return noteDiv;
}

// Save note content
function saveNoteContent(index, content) {
  savedNotes[index].content = content;
  localStorage.setItem('notes', JSON.stringify(savedNotes));
}

// Delete a note
function deleteNote(index) {
  deletedNote = savedNotes.splice(index, 1)[0]; // Remove and store the deleted note
  localStorage.setItem('notes', JSON.stringify(savedNotes));
  renderNotes();
  showRestoreButton();
}

// Show restore button
function showRestoreButton() {
  restoreBtn.style.display = 'block';
}

// Restore the deleted note
function restoreDeletedNote() {
  if (deletedNote) {
    savedNotes.push(deletedNote);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    renderNotes();
    restoreBtn.style.display = 'none';
    deletedNote = null;
  }
}

// Color coding functionality
colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.getAttribute('data-color');
    const newNote = {
      content: '',
      color: color
    };
    savedNotes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    renderNotes();
  });
});

// Restore deleted note functionality
restoreBtn.addEventListener('click', restoreDeletedNote);

// Add new note functionality
addNoteBtn.addEventListener('click', () => {
  savedNotes.push({ content: '', color: '' });
  localStorage.setItem('notes', JSON.stringify(savedNotes));
  renderNotes();
});

renderNotes(); // Initial render
