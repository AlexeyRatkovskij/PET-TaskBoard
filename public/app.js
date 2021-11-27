const btnDown = document.querySelector('#user-profile')
btnDown.addEventListener('click', () => {
    const dropNavBar = document.querySelector('.drop-navbar')
    if (dropNavBar.style.display === "none") dropNavBar.style.display = "flex"
    else dropNavBar.style.display = "none"
})


const placeholders = document.querySelectorAll('.placeholder')
let placeholder = document.querySelector('.placeholder')
for(const placeholder of placeholders) {
    placeholder.addEventListener('dragstart', dragstart)
    placeholder.addEventListener('dragend', dragend)
    placeholder.addEventListener('dragover', dragover)
    placeholder.addEventListener('dragleave', dragleave)
    placeholder.addEventListener('drop', dragdrop)
}
getTasks()

async function setRemoveBtn(){
    try {
        const btns = document.querySelectorAll('.btnRemoveTask')
        for(const btn of btns) {
            btn.addEventListener('click', (evt) => {
                const result = confirm("Вы действительно хотите удалить данную задачу?")
                if (result) {
                    const item = evt.target.closest('.item')
                    console.log(item.id)
                    removeTask(item.id)
                    item.remove()
                }
            })        
        }
    } catch(e) {
        console.log(e);
    }
}

const updateNumberTasks = () => {
    let i = 1
    for(const placeholder of placeholders) {
        const items = placeholder.querySelectorAll('.item')
        for(const item of items) {
            updateTask(item.id, placeholder.id, i)
            i++
        }
    }
}

function new_item(task){
    if (placeholders.length > 0) {
        const item = document.createElement('div')
        item.className = 'item'
        item.id = task._id//(document.querySelectorAll('.item').length+1).toString()
        item.draggable = true
        item.style.borderLeft = `5px solid ${task.color}77`

        const btnRemoveTask = document.createElement('div')
        btnRemoveTask.className = 'btnRemoveTask'

        const btnEditTask = document.createElement('div')
        btnEditTask.className = 'btnEditTask'

        const itemRow = document.createElement('div')
        itemRow.className = 'item_row'

        const p = document.createElement('p')
        p.className = 'itemContent'
        
        if (task.title.length > 15) {
            p.textContent = task.title.substring(0, 15) + '...'
        } else {
            p.textContent = task.title
        }

        const circle = document.createElement('div')
        circle.className = 'circleStatus'
        
        circle.style.border = `1px solid ${task.color}77`
        circle.style.backgroundColor = `${task.color}`

        itemRow.appendChild(p)
        itemRow.appendChild(circle)
        item.appendChild(btnRemoveTask)
        item.appendChild(btnEditTask)
        
        item.draggable = true
        btnEditTask.addEventListener('click', showForEditTask)
        item.addEventListener('click', showTask)
        
        placeholders[task.column-1].appendChild(item).appendChild(itemRow)
    }
}
///////////////////////////////////////////




const selectedItem = (evt) => {
    evt.target.classList.add(`selected`)
    evt.target.style.borderBottom = '2px dotted #807280'
    evt.target.style.borderTop = '2px dotted #807280'
    evt.target.style.borderRight = '2px dotted #807280'
}

const removeSelectedItem = (evt) => {
    evt.target.classList.remove(`selected`)
    evt.target.style.removeProperty('border-bottom')
    evt.target.style.removeProperty('border-right')
    evt.target.style.removeProperty('border-top')
}

function dragstart(evt) {
    selectedItem(evt)
    placeholder.classList.add(`hovered`)
}

function dragend(evt) {
    removeSelectedItem(evt)
    for (plsh of placeholders) {
        plsh.classList.remove(`hovered`)
    }
    updateNumberTasks()

}

function dragover(evt) {
  // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    // Находим перемещаемый элемент
    const activeElement = placeholder.querySelector(`.selected`)
    // Находим элемент, над которым в данный момент находится курсор
    let currentElement = evt.target.closest('.item')
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isItem = (currentElement !== null && currentElement.classList.contains('item')) 
    // Если нет, прерываем выполнение функции
    let isPlaceholder = false 
    if (!isItem) {
        currentElement = evt.target.closest('.placeholder')
        isPlaceholder = currentElement !== null && currentElement.classList.contains('placeholder')
        if (!isPlaceholder) {
            return
        }
    } 
    if (!isPlaceholder) {
        placeholder = currentElement.closest('.placeholder')
        placeholder.classList.add(`hovered`)

        if (evt.offsetY < (currentElement.clientHeight) / 2) {
            currentElement.classList.add(`itemHoverUp`)
            if(currentElement.previousElementSibling) {
                currentElement.previousElementSibling.classList.add(`itemHoverDown`)
            }
        } else {
            currentElement.classList.add(`itemHoverDown`)
            if(currentElement.nextElementSibling) {
                currentElement.nextElementSibling.classList.add(`itemHoverUp`)
            }
        }
    } else {
        placeholder = currentElement.closest('.placeholder')
        placeholder.classList.add(`hovered`)
        //Доп логика 
    }
}

function dragleave(evt) {
    let currentElement = evt.target.closest('.item')
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isItem = (currentElement !== null && currentElement.classList.contains('item')) 
    // Если нет, прерываем выполнение функции
    let isPlaceholder = false 
    if (!isItem) {
        currentElement = evt.target.closest('.placeholder')
        isPlaceholder = currentElement !== null && currentElement.classList.contains('placeholder')
        if (!isPlaceholder) {
            return
        }
    } 
    if (!isPlaceholder) {
        placeholder.classList.remove(`hovered`)
        currentElement.classList.remove(`itemHoverDown`)
        currentElement.classList.remove(`itemHoverUp`)
        if(currentElement.previousElementSibling) {
            currentElement.previousElementSibling.classList.remove(`itemHoverDown`)
        }
        if(currentElement.nextElementSibling) {
            currentElement.nextElementSibling.classList.remove(`itemHoverUp`)
        }
    } else {
        placeholder.classList.remove(`hovered`)
    }
    
}

function dragdrop(evt) {
    let currentElement = evt.target.closest('.item')
    const isItem = currentElement !== null && currentElement.classList.contains('item')
    let isPlaceholder = false 
    for(pl of placeholders) {
        pl.classList.remove(`hovered`)
    }
  // Если нет, прерываем выполнение функции
    if (!isItem) {
        currentElement = evt.target.closest('.placeholder')
        isPlaceholder = currentElement !== null && currentElement.classList.contains('placeholder')
        if (!isPlaceholder) {
            return
        }
    } 
    const activeElement = document.querySelector(`.selected`)
    if (!isPlaceholder) {
        if(currentElement.nextElementSibling) {
            currentElement.nextElementSibling.classList.remove(`itemHoverUp`)
        }
        if(currentElement.previousElementSibling) {
            currentElement.previousElementSibling.classList.remove(`itemHoverDown`)
        }
        currentElement.classList.remove(`itemHoverDown`)
        currentElement.classList.remove(`itemHoverUp`)

        let nextElement
        if (evt.offsetY < (currentElement.clientHeight) / 2) {
            nextElement = currentElement
        } else {
            nextElement = currentElement.nextElementSibling
        }
        placeholder.insertBefore(activeElement, nextElement);
    } else {
        placeholder.appendChild(activeElement)
    }
}

///////////////////ПОПЫТКА API
async function getTasks() {
    try {
        const data = await request('/api/tasks')
        const sort_data = data.sort(byField('row'))
        //console.log(sort_data)
        for(const task of sort_data) {
            new_item(task)
        }
        setRemoveBtn()
    } catch(e) {
        console.log(e);
    }
}

function byField(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

async function updateTask(taskId, placeId, num) {
    await request(`/api/update/${taskId}/${placeId}/${num}`)
}

async function removeTask(taskId) {
    await request(`/api/remove/${taskId}`)
}

async function getTask(taskId) {
    return Promise.resolve(await request(`/api/get/${taskId}`))
}

async function request(url, method = 'GET', data = null) {
    try {
        let result
        const headers = {}
        let body
        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch(e) {
        console.warn(e.message);
    }
}


//////////////////////////// ПОПАП

// Попап

const popup = document.querySelector('.popup-create')
const popupBtnStart = document.querySelector('#popup-btn-start')
const form = document.querySelector('.popup')
const popupTaskShow = document.querySelector('.popup-show')

popupTaskShow.addEventListener('click', (evt) => { 
    if (evt.target.classList.contains('popup-show')) {
        if (!isShowTask) {
            popupTaskShow.style.display = "flex"
            isShowTask = true
        } else if (isShowTask) {
            popupTaskShow.style.display = "none"
            isShowTask = false
        }
    }
})

form.addEventListener('click', (evt) => { 
    if (evt.target.classList.contains('popup')) {
        if (form.style.display == "none") {
            form.style.display = "flex"
            isShowTask = true
        } else {
            form.style.display = "none"
            isShowTask = false
        }
    }
})

let isOpen = false
let isShowTask = false

popup.addEventListener('click', (evt) => { 
    if (evt.target.classList.contains('popup-create')) {
        popupCheck()
    }
})

popupBtnStart.addEventListener('click', () => {
    popupCheck()
})

function popupCheck() {
    if (!isOpen) {
        popup.style.display = "flex"
        isOpen = true
    } else if (isOpen) {
        popup.style.display = "none"
        isOpen = false
    }
}

function popupTaskCheck() {
    if (!isShowTask) {
        form.style.display = "flex"
        isShowTask = true
    } else if (isShowTask) {
        form.style.display = "none"
        isShowTask = false
    }
}

async function showForEditTask(evt) {
        let item = evt.target.closest('.item')
        const task = await getTask(item.id)
        const title = form.querySelector('#title')
        const description = form.querySelector('#description')
        const color = form.querySelector('#color')
        const idTask = form.querySelector('.idTask')

        title.value = task['title']
        description.value = task['description']
        color.value = task['color']
        idTask.value = task['_id']

        popupTaskCheck()
}

async function showTask(evt) {
    if(!evt.target.classList.contains('btnRemoveTask')) {
        let item = evt.target.closest('.item')
        const task = await getTask(item.id)

        const taskForm = popupTaskShow.querySelector('.clash-card barbarian')
        const title = popupTaskShow.querySelector('.popup-task-title')
        const description = popupTaskShow.querySelector('.popup-task-text')
        const color = popupTaskShow.querySelector('.clash-card__image')

        title.innerText = `${task['title']}`
        description.innerHTML = `${task['description']}`
        color.style.backgroundColor = `${task.color}77`

        if (!isShowTask) {
            popupTaskShow.style.display = "flex"
            isShowTask = true
        } else if (isShowTask) {
            popupTaskShow.style.display = "none"
            isShowTask = false
        }
    }
}