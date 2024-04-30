;(function(){
"use strict"

// armazenar o DOM em variáveis
const itemInput = document.getElementById("item-input")
const todoAddForm = document.getElementById("todo-add")
const ul = document.getElementById("todo-list")
const lis = ul.getElementsByTagName("li")
const itemHora = document.getElementById("item-hora")


////////////////////////////////////////////////////////////////
// recuperar os dados salvos  no LocalStore
let arrTasks = getSavedData()



 
// function addEventLi(li) {
//     li.addEventListener("click", function() {
//     console.log(this)
  
//    });
// }

////////////////////////////////////////////////////////////////////////
     //  função para recuperar os dados no |Local Storage

     function getSavedData() {
      let tasksData = localStorage.getItem("tasks")
     
      tasksData = JSON.parse(tasksData)
     
      return tasksData && tasksData.length ? tasksData : [
          {
              name: "nome 1",
              createAt: Date.now(),
              completed: false
          },
          {
              name: "nome 2",
              createAt: Date.now(),
              completed: false
          }
      ]


  }
  //função para gravar os dados no |Local Storage
  function setNewData() {
      localStorage.setItem("tasks", JSON.stringify(arrTasks))
  }

setNewData()
////////////////////////////////////////////////////////////////



function generateLiTask(obj){
  const li =document.createElement("li")
  const p = document.createElement("p")
  const checkButton = document.createElement("button")
  const editButton = document.createElement("i")       
  const deleteButton = document.createElement("i")
  const itemHora2  = document.createElement("text")

  li.className = "todo-item"
  p.className="task-name"
  p.textContent = obj.name


  itemHora2.className="item-hora"
  itemHora2.textContent = obj.time
    
  checkButton.className = "button-check"
  checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
  checkButton.setAttribute("data-action", "checkButton") 
  editButton.className= "fas fa-edit"
  editButton.setAttribute("data-action", "editButton")
  deleteButton.className ="fas fa-trash-alt"
  deleteButton.setAttribute("data-action", "deleteButton")

 //////////////////////////////////////////////////////////////
 //  alteração/exclusão
  const containerEdit = document.createElement("div")
  containerEdit.className ="editContainer"
  const inputEdit = document.createElement("input")
  inputEdit.setAttribute("type", "text")
  inputEdit.className = "editInput"
  inputEdit.value = obj.name

  containerEdit.appendChild(inputEdit)
   ///  incluir alteração da hora
   
   const horaEdit =document.createElement('input')
   horaEdit.className ="editHora"
   horaEdit.setAttribute("type","text")
   horaEdit.value=obj.time

   containerEdit.appendChild(horaEdit)
   
   //-----------------------------------------



  const containerEditButton = document.createElement("button")
  containerEditButton.className = "editButton"
  containerEditButton.textContent = "Edit"
  containerEditButton.setAttribute("data-action", "containerEditButton")
  containerEdit.appendChild(containerEditButton)

  const containerCancelButton = document.createElement("button")
  containerCancelButton.className ="cancelButton"
  containerCancelButton.textContent ="Cancel"
  containerCancelButton.setAttribute("data-action", "containerCancelButton")

  containerEdit.appendChild(containerCancelButton)

  li.appendChild(containerEdit)

/////////////////////////////////////////////////////////////////////

  

  //console.log("ihora=", ihora)

  li.appendChild(checkButton)
  li.appendChild(p)
  li.appendChild(itemHora2)
  li.appendChild(editButton)
  li.appendChild(deleteButton)
  
  //ul.appendChild(li)

  //addEventLi(li)
  
  return li
}

function renderTasks() {
  ul.innerHTML=""
  arrTasks.forEach(taskObj => {
    ul.appendChild(generateLiTask(taskObj))
  });
}

function addTask(task, ihora) {

   arrTasks.push( { 
     name : task,
     time : ihora,
     createAt : Date.now(),
     completed: false
   })

   setNewData()
}
///////////////////////////////////////////////////////////////////
// pegar o objeto que recebeu o click. Programar o que acontece 
function clickedUl(e) {
  const dataAction = e.target.getAttribute("data-action")

  if(!dataAction) return

  //----------------------------------------------------------
  // achar a li clicada
  let currentLi = e.target
  while (currentLi.nodeName !== "LI") {
    currentLi = currentLi.parentElement
  }
  console.log(currentLi)   // sempre será li

  const currentLiIndex = [...lis].indexOf(currentLi)
  //----------------------------------------------------------

  const actions = {
    editButton: function() {
      const editContainer=currentLi.querySelector(".editContainer");
      [...ul.querySelectorAll(".editContainer")].forEach( container =>{
         container.removeAttribute("style")
      })
     
      editContainer.style.display="flex";
    },
    deleteButton: function() {
       arrTasks.splice(currentLiIndex, 1)
       renderTasks()
       setNewData()
       //currentLi.remove()
    },
  
    // botão Edit
    containerEditButton: function() {
      const val = currentLi.querySelector(".editInput").value
      const valHora = currentLi.querySelector(".editHora").value
      arrTasks[currentLiIndex].name = val
      arrTasks[currentLiIndex].time = valHora

      renderTasks()
      setNewData()

    },
    // cotão Cancel 
    containerCancelButton: function() {
      currentLi.querySelector(".editContainer").removeAttribute("style")
      // excluir a digitação. Não seria lbrigatório
      currentLi.querySelector(".editInput").value =  arrTasks[currentLiIndex].name   
      currentLi.querySelector(".editHora").value =  arrTasks[currentLiIndex].time   
    },

     checkButton: function() {
        arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed 
        renderTasks()  
        setNewData()  

        // if(arrTasks[currentLiIndex].completed) {
        //   currentLi.querySelector(".fa-check").classList.remove("displayNone")
        // } else {
        //   currentLi.querySelector(".fa-check").classList.add("displayNone") 
        // }
     }
   }

    if (actions[dataAction]) {
      actions[dataAction]()
    }
}



/////////////////////////////////////////////////////////////////////
  todoAddForm.addEventListener("submit", function(e) {
    e.preventDefault()
    console.log(itemInput.value)
    console.log("hora:",itemHora.value)

    addTask(itemInput.value, itemHora.value)
    renderTasks()

    itemInput.value =""
    itemHora.value=""
    itemInput.focus()
  });

  ul.addEventListener("click", clickedUl)
       
    renderTasks()

   
}) ()