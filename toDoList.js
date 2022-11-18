const alert = document.querySelector(".alert")
const input = document.getElementById("myInput")
const submitBtn = document.querySelector(".submit-btn")
const form = document.querySelector(".my-form")
const list = document.querySelector(".my-list")
const container = document.querySelector(".list-container")
const clearBtn = document.querySelector(".clear-btn")

window.addEventListener("DOMContentLoaded", () => {
    let storedList = getLocalStorage()
    if(storedList.length > 0){
        storedList.forEach((item) => {
         createItem(item.id, item.value, item.status)
        })
    }
    
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const value = input.value
    const id = new Date().getTime().toString()
    let status = "undone"

    if(value) {
        createItem(id, value, status)
        displayAlert(`LIST ITEM ADDED`, "succeeded-alert")
        addToLocalStorage(id, value, status)
        input.value = ""

    }else {
        displayAlert(`EMPTY VALUE`, "failed-alert")
    }
})

// clear my list items
clearBtn.addEventListener("click", (e) => {
    const myListItems = document.querySelectorAll(".list-items")
    myListItems.forEach((item) => {
        list.removeChild(item)
    })
    container.classList.remove("show-container")
    displayAlert(`All CLEAR`, "succeeded-alert")
    // remove my list from the local storage
    localStorage.removeItem("myToDoList")
})

//functions

//create the list item
function createItem(id, value, status) {
    
    const element = document.createElement("div")
    element.classList.add("list-items")
    const attr = document.createAttribute("data-id")
    attr.value = id
    element.setAttributeNode(attr)
    element.innerHTML = `<button type="button" class="tick-btn"><i class="fa-solid fa-circle-check"></i></button>
                        <input type="text" class="my-item" value="${value}" data-status="${status}" readonly>
                        <div class="btn-container">
                            <button class="edit-btn" type="button">EDIT</button>
                            <button class="delete-btn" type="button"><i class="fa-solid fa-trash"></i></button>
                        </div>`

    if(status === "completed") {
        element.classList.add("completed")
        element.children[1].classList.add("completed")
    }

    list.appendChild(element)

    const deleteBtn = element.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", deleteItem)
    
    const editBtn = element.querySelector(".edit-btn")
    editBtn.addEventListener("click", editItem)

    const tickBtn = element.querySelector(".tick-btn")
    tickBtn.addEventListener("click", completedItem)
    
    container.classList.add("show-container")
}

//delete the list item
function deleteItem(e) {
   const selectedItem = e.currentTarget.parentElement.parentElement
   const id = selectedItem.dataset.id
   
   selectedItem.classList.add("removed")
   
   selectedItem.addEventListener("transitionend", () => {
    selectedItem.remove()
    if(list.children.length === 0 ){
        container.classList.remove("show-container")
      }
   })
   
   displayAlert(`LIST ITEM REMOVED`,"succeeded-alert")
   removeFromLocalStorage(id)
}

//edit the list item
function editItem(e) {
    const selectedItem = e.currentTarget.parentElement.parentElement
    const id = selectedItem.dataset.id
    const selectedInput = selectedItem.children[1]
    selectedItem.classList.add("selected")
    selectedInput.removeAttribute("readonly")
    selectedInput.setSelectionRange(selectedInput.value.length, selectedInput.value.length)
    selectedInput.focus()

    console.log(selectedItem)

    selectedInput.addEventListener("blur", (e) => {
        selectedItem.classList.remove("selected")
        selectedInput.setAttribute("readonly", "readonly")
        const value = selectedInput.value
        const status = selectedInput.dataset.status
        
        editLocalStorage(id, value, status)
        displayAlert(`LIST ITEM UPDATED`, "succeeded-alert")
    })
}

function completedItem(e) {
    const selectedItem = e.currentTarget.parentElement
    const selectedInput = selectedItem.children[1]
    let status
    const id = selectedItem.dataset.id
    const value = selectedInput.value
    
    console.log(selectedInput)

    if(selectedInput.dataset.status === "undone"){
        status = "completed"
        selectedInput.dataset.status = status
        selectedItem.classList.add("completed")
        selectedInput.classList.add("completed")
        console.log(id, value,status)
        editLocalStorage(id, value, status)
    }
    else {
        status = "undone"
        selectedInput.dataset.status = status
        selectedItem.classList.remove("completed")
        selectedInput.classList.remove("completed")
    
        editLocalStorage(id, value, status)
    }
}



function displayAlert(text, status) {
    alert.textContent = text
    alert.classList.add(status)

    setTimeout(() => {
        alert.textContent = ""
        alert.classList.remove(status)  
    }, 2000)
}



function getLocalStorage(){
    return localStorage.getItem("myToDoList")
    ? JSON.parse(localStorage.getItem("myToDoList"))
    : []
}

function addToLocalStorage(id, value, status){
    let storedList = getLocalStorage()
    storedList.push({id, value, status})
    localStorage.setItem("myToDoList", JSON.stringify(storedList))
}

function removeFromLocalStorage(id){
    let storedList = getLocalStorage()
    newList = storedList.filter(item => item.id != id)
    localStorage.setItem("myToDoList", JSON.stringify(newList))
}

function editLocalStorage(id, value, status){
    let storedList = getLocalStorage()
    console.log(id, value, status)

    newList = storedList.map(item => {
        if(item.id === id){
            return {...item, value, status}
        }
        return item
    })
    console.log(newList)
    localStorage.setItem("myToDoList", JSON.stringify(newList))
}
