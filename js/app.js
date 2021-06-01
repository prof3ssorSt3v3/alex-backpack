document.addEventListener('DOMContentLoaded', () => {
  //init
  let page = document.body.id;

  //set up side menu
  let sideElems = document.querySelectorAll('.sidenav');
  let sideNavInstances = M.Sidenav.init(sideElems);

  let modalElems = document.querySelectorAll('.modal');
  let modalInstances = M.Modal.init(modalElems);
  // console.log('working on', page);

  switch (page) {
    case 'meals-per-day':
      //clear out localStorage
      localStorage.removeItem('BackPack-meal-template');
      localStorage.removeItem('BackPack-meal-days');
      setUpPerDayDragging();
      //handle continue button
      let btn = document.getElementById('btnSaveLabels');
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        //ask for the number of days for the trip
        let m = modalInstances[0];
        m.open();
      });
      let btn2 = document.querySelector('#length-modal a');
      btn2.addEventListener('click', saveLabelsAndContinue);
      break;
    case 'meals-plan':
      // console.log('add meal slots table');
      setUpMealPlanDragging();
      let btn3 = document.getElementById('btnSaveMeals');
      btn3.addEventListener('click', (ev) => {
        ev.preventDefault();
        //confirm the leaving of empty slots
        let empty = document.querySelectorAll('td:not(.filled)').length;
        console.log(`There are ${empty} empty slots`);
        if (empty !== 0) {
          let answer = confirm(`There are ${empty} empty slots. Continue?`);
          if (answer) {
            let m = modalInstances[0];
            m.open();
          }
        }
      });

      let btn4 = document.querySelector('#length-modal a');
      btn4.addEventListener('click', saveMealsAndContinue);
      break;
    case 'recipes':
      break;
  }
});
function setUpMealPlanDragging() {
  //build the table for the meal plan days
  buildTableOfMealSlots();

  //drag recipes on to meal plan
  let draggables = document.querySelectorAll('.draggable');
  if (draggables) {
    // console.log('found some draggables');
    draggables.forEach((item) => {
      item.addEventListener('dragstart', dragRecipe);
    });
  }
  let droppables = document.querySelectorAll('.droppable');
  if (droppables) {
    droppables.forEach((td) => {
      //listen for dragover and drop
      td.addEventListener('dragover', dragoverRecipe);
      td.addEventListener('drop', dropRecipe);
      td.addEventListener('dragleave', dragleaveRecipe);
    });
  }
}
function dragoverRecipe(ev) {
  ev.preventDefault();
  ev.target.style.outline = '1px solid orange';
}
function dragleaveRecipe(ev) {
  ev.preventDefault();
  ev.target.style.outline = 'none';
}
function dropRecipe(ev) {
  ev.preventDefault();
  let txt = ev.dataTransfer.getData('text/plain');
  let td = ev.target;
  td.textContent = txt;
  td.style.outline = 'none';
  td.className = 'white light-green-text darken-4-text filled';
  td.removeEventListener('drop', dropRecipe);
  td.removeEventListener('drop', dragoverRecipe);
  td.removeEventListener('drop', dragleaveRecipe);
}
function buildTableOfMealSlots() {
  let days = localStorage.getItem('BackPack-meal-days');
  let template = JSON.parse(localStorage.getItem('BackPack-meal-template'));
  let table = document.getElementById('meal-plans');
  table.classList.add(`days-${days}`);
  let tr = document.createElement('tr');
  for (let col = 0; col < days; col++) {
    let th = document.createElement('th');
    th.className = 'white light-green-text darken-4-text';
    th.textContent = `Day ${col + 1}`;
    tr.append(th);
  }
  table.append(tr);
  template.forEach((mealslot) => {
    let tr = document.createElement('tr');
    for (let col = 0; col < days; col++) {
      //add each day
      let td = document.createElement('td');
      td.setAttribute('data-day', col);
      td.setAttribute('data-label', mealslot.toLowerCase());
      td.className = 'droppable';
      td.textContent = mealslot;
      tr.append(td);
    }
    table.append(tr);
  });
}
function dragRecipe(ev) {
  //dragging a recipe to a mealslot
  // console.log('start dragging recipe', ev.target.textContent);
  ev.dataTransfer.dropEffect = 'copy';
  ev.dataTransfer.setData('text/plain', ev.target.textContent);
}
function setUpPerDayDragging() {
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
}
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
  addToTemplate(label.trim());
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
function addToTemplate(label) {
  let list = [];
  let store = localStorage.getItem('BackPack-meal-template');
  if (store) {
    list = JSON.parse(store);
  }
  list.push(label);
  localStorage.setItem('BackPack-meal-template', JSON.stringify(list));
}
function saveMealsAndContinue(ev) {
  ev.preventDefault();

  //TODO: add the ability to just type something in a meal slot
  //show modal to give trip a name
  //gather the reference ids for meal-slots and recipes
  //TODO: confirm format of data to send to the server
  //need to send this data to the server to be saved
}
function saveLabelsAndContinue(ev) {
  ev.preventDefault();
  //save the number of days
  let days = document.getElementById('days').value;
  if (isNaN(days)) {
    //bad user
    alert('This must be a number');
    return;
  }
  days = parseInt(days);
  localStorage.setItem('BackPack-meal-days', days);
  //navigate to the page to show the days with the labels displayed
  //which will let the user drag the recipes on to the meal slots
  location.href = './mealplan.html';
}
