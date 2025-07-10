const columns = ['todo', 'inprogress', 'done'];

columns.forEach(id => {
  new Sortable(document.getElementById(id), {
    group: 'shared',
    animation: 150
  });
});
