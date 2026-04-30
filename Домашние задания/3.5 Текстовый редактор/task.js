const editor = document.getElementById('editor');
const storageKey = 'editorText';

editor.value = localStorage.getItem(storageKey) || '';

editor.addEventListener('input', () => {
  localStorage.setItem(storageKey, editor.value);
});
