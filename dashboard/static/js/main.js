shipmentButton = document.getElementById("shipments-button")
itemButton = document.getElementById("items-button")
itemTable = document.getElementById("item-table")
shipmentTable = document.getElementById("shipment-table")
const itemAddForm = document.getElementById('add-item-form');
const editAddForm = document.getElementById('edit-item-form');
const shipmentAddForm = document.getElementById('add-shipment-form');


async function postData(url = '', data) {
    console.log(JSON.stringify(data))
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
async function putData(url = '', data) {
    console.log(JSON.stringify(data))
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
async function deleteData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response // parses JSON response into native JavaScript objects
}
function createItemTable(data){
    return `<tr>
    <th scope="row">${data['id']}</th>
    <td>${data['name']}</td>
    <td>${data['quantity']}</td>
    <td>$${data['price']}</td>
    <td><a onClick="itemEdit(${data['id']})" href="#">Edit</a></td>
    <td><a onClick="itemDelete(${data['id']})" href="#">Delete</a></td>
    </tr>`
}
function loadItems(){
    url = '/api/items/'
    getData(url).then(data =>{
        itemsString =""
        for(const item of data){
            itemsString+=createItemTable(item)
        }
        finalTable =  `
        <table class="table" id="items-table">
            <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col">name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
            </tr>
            </thead>
            <tbody>
            ${itemsString}
            </tbody>
            </table>
        `
        itemTable.innerHTML = finalTable;
    })
}
itemAddForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  var data = {};
  const formData = new FormData(itemAddForm);
  for (var [key, value] of formData.entries()) {
    data[key] = value
  }
  url = 'api/items/'
  postData(url=url, data=data).then(result =>{

    if (result["success"] != true){
        document.getElementById("add-item-errors").innerHTML=JSON.stringify(result['errors'])
    }
    else{
        itemAddForm.reset();
        loadItems()
        document.getElementById("add-item-errors").innerHTML=""
    }
  })
})
function itemEdit(id){
    document.getElementById("edit-item-errors").innerHTML=""
    url = 'api/items/'+id
    getData(url=url).then(result =>{
        itemAddForm.style.display = "none";
        editAddForm.style.display = "block";
        editAddForm['name'].value = result['name']
        editAddForm['description'].value = result['description']
        editAddForm['quantity'].value = result['quantity']
        editAddForm['price'].value = result['price']
        editAddForm['id'].value = result['id']
    })
}
function cancelEditForm(){
    itemAddForm.style.display = "block";
    editAddForm.style.display = "none";
    document.getElementById("edit-item-errors").innerHTML=""
}
editAddForm.addEventListener('submit', async (event) => {
    
    event.preventDefault();
  
    var data = {};
    const formData = new FormData(editAddForm);
    for (var [key, value] of formData.entries()) {
      data[key] = value
    }
    console.log(data)
    url = 'api/items/'+data['id']+'/'
    putData(url=url, data=data).then(result =>{
        console.log(result)
      if (result["success"] != true){
          document.getElementById("edit-item-errors").innerHTML=JSON.stringify(result['errors'])
      }
      else{
        cancelEditForm()
        loadItems()
        document.getElementById("edit-item-errors").innerHTML=""

      }
    })
})
function itemDelete(id){
    url = 'api/items/'+id+"/"
    deleteData(url=url).then(result =>{
        loadItems()
    })
}
function createShipmentItemTable(data){
    items = ""
    for(item of data){
        items +=`
        <tr>
        <th scope="row">${item['item']['id']}</th>
        <td>${item['item']['name']}</td>
        <td>$${item['item']['price']}</td>
        <td>${item['quantity']}</td>
      </tr>`
    }

    layout = `
    <table class="table">
        <thead>
        <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">price</th>
            <th scope="col">quantity shipped</th>
            </tr>
        </thead>
        <tbody>
            ${items}
        </tbody>
     </table>`
  return layout
}
function createShipmentTable(data){
    return `<tr>
    <th scope="row">${data['id']}</th>
    <td>${data['destination_address']}</td>
    <td>${createShipmentItemTable(data['shipments'])}</tr>`
}
function loadShipments(){
    url = '/api/shipments/'
    getData(url).then(data =>{
        shipmentString =""
        for(const item of data){
            shipmentString+=createShipmentTable(item)
        }
        finalTable =  `
        <table class="table" id="items-table">
            <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col">Address</th>
                <th scope="col">Items</th>
            </tr>
            </thead>
            <tbody>
            ${shipmentString}
            </tbody>
            </table>
        `
        shipmentTable.innerHTML = finalTable;
    })
}
function addItemToShipment(){
    url = '/api/items/retrieve_for_shipment/'
    getData(url=url).then(result =>{
        itemHtml = ""
        for(item of result){
            itemHtml += `<option value=${item['id']}>${item['name']} - $${item['price']} - Quantity: ${item['quantity']}</option>`
        }
        var div = document.createElement("DIV"); 
        div.setAttribute('class','row')
        
        div.innerHTML = `
        <div class="mb-3 col">
            <label class="form-label">item:</label>
            <select class="form-select" name="items[]" aria-label="Default select example">
            ${itemHtml}
            </select>
        </div>
        <div class="mb-3 col">
            <label class="form-label">Quantity:</label>
            <input type="number" min=1 class="form-control" id="shipmentQuantity" name="quantity[]" required>
        </div>
        </div>
        `
        document.getElementById('shipment-items-row').appendChild(div);      
    })

}
shipmentAddForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    var data = {
        "destination_address": document.getElementById("destination_address").value,
        "shipments": [] 
    };

    var items = document.getElementsByName('items[]');
    var quantity = document.getElementsByName('quantity[]');
    for (var i = 0; i < items.length; i++) {
        console.log(quantity[i].value)
        item = {
            "quantity": quantity[i].value,
            "item": {
                "id": items[i].value
            }
        }
        data['shipments'].push(item)
    }

    url = 'api/shipments/'
    postData(url=url, data=data).then(result =>{

        if (result["success"] != true){
            document.getElementById("add-shipment-errors").innerHTML=JSON.stringify(result)
        }

        else{
            document.getElementById("add-shipment-errors").innerHTML=""
            document.getElementById("shipment-items-row").innerHTML=""
            shipmentAddForm.reset()
            addItemToShipment()
            loadShipments()

        }
    })
})
shipmentButton.addEventListener('click', async (event) =>{
    document.getElementById("items").style.display="none"
    document.getElementById("shipments").style.display="block"
    document.getElementById("shipment-items-row").innerHTML=""
    addItemToShipment()
    loadShipments()
})
itemButton.addEventListener('click', async (event) =>{
    document.getElementById("shipments").style.display="none"
    document.getElementById("items").style.display="block"
    loadItems()
})

loadItems()
