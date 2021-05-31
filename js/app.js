document.addEventListener('DOMContentLoaded', () => {
  //init
  let draggables = document.querySelectorAll('.meal-cols .draggable');
  if (draggables) {
    console.log('found some draggables');
    draggables.forEach((item) => {
      item.addEventListener('dragstart', dragMealLabel);
    });
  }
  let droppable = document.getElementById('meal-scaffold');
  droppable.addEventListener('drop', dropMealLabel);
  droppable.addEventListener('dragover', dragoverMealLabel);
  droppable.addEventListener('click', removeLabel);
});

function dragMealLabel(ev) {
  console.log('Start dragging', ev.target.textContent);
  ev.dataTransfer.setData('text/plain', ev.target.textContent);
  ev.dataTransfer.dropEffect = 'copy';
  // document.querySelector('.drop-target').style.backgroundColor = 'white';
}
function dropMealLabel(ev) {
  ev.preventDefault(); //so we can control the action
  let label = ev.dataTransfer.getData('text/plain');
  let ul = ev.target.closest('ul.collection');
  let li = `<li class="collection-item grey-text text-darken-4"><div>${label}
    <a href="#" class="secondary-content"><i class="material-icons">delete</i></a></div></li>`;
  ul.innerHTML += li;
  //append method is failing with the DOMStrings here... something to do with the drag?
  ul.style.outline = 'none';
}
function dragoverMealLabel(ev) {
  ev.preventDefault(); //so we can control the action
  let ul = ev.target.closest('ul.collection');
  ul.style.outline = '2px solid red';
}
function removeLabel(ev) {
  let li = ev.target.closest('.collection-item');
  let a = ev.target.closest('.secondary-content');
  console.log(li, a);
  if (li && a) {
    li.remove();
  }
}
