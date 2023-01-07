const url = 'http://127.0.0.1:3005';

const mainRow = document.querySelector('#main-row');
const addBtn = document.querySelector('#addBtn');
const input = document.querySelector('#inputMsg');

addBtn.addEventListener('click', newEvent);
function newEvent() {
    if (input.value) {
        let inputVal = input.value;
        let xml = new XMLHttpRequest();
        xml.open('post', url + '/save');
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                displayEvents();
            }
        }
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.send(JSON.stringify({ msg: inputVal }));
        input.value = '';
    } else {
        alert("Unesite poruku")
    }
}

function displayEvents() {
    let data = new Promise((resolve, reject) => {
        let xml = new XMLHttpRequest();
        xml.open('get', url + '/get_data');
        xml.onreadystatechange = () => {
            if (xml.readyState == 4 && xml.status == 200) {
                resolve(JSON.parse(xml.responseText))
            }
        }
        xml.send();
    })
    data.then((data) => {
        let text = '';
        text += `
            <div class="container">
                <div class="row">
                     <div class="col-lg-5 col-md-6 col-sm-8 mx-auto">
                        <div class="card my-5">
                             <div class="card-body">
                                 <div class="input-group mb-3">
                                     <input type="text" id="search" class="form-control" placeholder="Search">
                                 <div class="input-group-append">
                                     <span class="input-group-text"> <i class="fas fa-search"></i> </span>
                                </div>
                            </div>
                            <ul class="list-group mb-3" id="main-row">
        `
        for (let i = 0; i < data.length; i++) {
            text += `
                <li class="list-group-item">
                    <span class="event-text">${data[i].msg} (${data[i].quantity}) </span>
                    <button edit-id="${data[i]._id}"><i class="far fa-edit"></i></i></button>
                    <button del-id="${data[i]._id}" class=""><i class="far fa-trash-alt"></i></button>
                </li>
                `
        }
        text += `
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        mainRow.innerHTML = text;

        let search = document.querySelector('#search');
        search.addEventListener('keyup', searchEvent);
        let allDeleteBtns = document.querySelectorAll('[del-id]');
        let allEditBtns = document.querySelectorAll('[edit-id]');
        for (let i = 0; i < allDeleteBtns.length; i++) {
            allDeleteBtns[i].addEventListener('click', deleteEvent);
            allEditBtns[i].addEventListener('click', editEvent);
        }
    })
}

displayEvents();

function deleteEvent() {
    let xml = new XMLHttpRequest();
    xml.open('post', url + '/delete');
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            displayEvents();
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.send(JSON.stringify({ id: this.getAttribute('del-id') }));
}

function editEvent() {
    let id = this.getAttribute('edit-id');
    // console.log(id);
    let data = new Promise((resolve, reject) => {
        let xml = new XMLHttpRequest();
        xml.open('get', url + '/edit/' + id);
        xml.onreadystatechange = () => {
            if (xml.readyState == 4 && xml.status == 200) {
                resolve(JSON.parse(xml.responseText));
            }
        }
        xml.send();
    })
    data.then((data) => {
        mainRow.innerHTML = `
            <div class="container">
                <div class="row">
                     <div class="col-lg-5 col-md-6 col-sm-8 mx-auto">
                        <h4 class="text-center">Edit Event</h4>
                        <div class="col-10 offset-1">
                            <div class="row">
                                <form action="" method="">
                                    <input type="hidden" id="updateId" value="${data._id}">
                                    <label for="updateMsg">naziv</label>
                                    <input id="updateMsg" name="updateMsg" class="form-control" type="text" value="${data.msg}"><br>
                                    <label for="updateMsg">kolicina</label>
                                    <input class="form-control" type="text" id="updateQuantity" value="${data.quantity}"><br>
                                    <button id="updateBtn" class="btn btn-primary control">Update</button>
                                    <button id="cancelBtn" class="btn btn-primary control">Cancel</button>
                                </form>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        `

        let updateBtn = document.querySelector('#updateBtn');
        updateBtn.addEventListener('click', updateEvent);
        let cancelBtn = document.querySelector('#updateBtn');
        cancelBtn.addEventListener('click', function (e) {
            console.log();
            e.preventDefault;
            displayEvents();
        });
    })
}

function updateEvent(e) {
    e.preventDefault();
    let inputId = document.querySelector('#updateId').value;
    let inputMsg = document.querySelector('#updateMsg').value;
    let inputQuantity = document.querySelector('#updateQuantity').value;

    let xml = new XMLHttpRequest();
    xml.open('post', url + '/update');
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status == 200) {
            displayEvents();
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.send(JSON.stringify({ id: inputId, msg: inputMsg, quantity: inputQuantity }));
}

function searchEvent(e) {
    const text = e.target.value.toLowerCase();
    const allItem = document.querySelectorAll('.list-group-item');
    for (let task of allItem) {
        const item = task.textContent;
        if (item.toLocaleLowerCase().indexOf(text) != -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    }
}