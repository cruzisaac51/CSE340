'use strict';
let classificationList = document.querySelector("#classificationcars")
classificationList.addEventListener("change", function async() { 
    let classification_id = classificationList.value 
    console.log(`classification_id is: ${classification_id}`) 
    let classIdURL = "/inv/getInventory/"+ classification_id 
    fetch(classIdURL) 
    .then(function (response) { 
    if (response.ok) { 
    return response.json(); 
    } 
    throw Error("Network response was not OK"); 
    }) 
    .then(async function (data) { 
        console.log(data); 
        await buildInventoryList(data); 
    }) 
    .catch(function (error) { 
    console.log('There was a problem: ', error.message) 
    }) 
})
// Build inventory items into HTML table components and inject into DOM 
async function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventorydisplay"); 
    console.log("InventoryDisplay: ?????", inventoryDisplay)
    if (inventoryDisplay) {
        // Set up the table labels 
        let dataTable = ''
        dataTable = '<thead>'; 
        dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
        dataTable += '</thead>'; 
        // Set up the table body 
        dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
        data.forEach(function (element) { 
            if (data) {
                console.log(element.inv_id + ", " + element.inv_model); 
                dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
                dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
                dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
            } else {
                dataTable += `<tr><td>Nothing here for Now</td>`; 
                dataTable += `<td><a href='#' title='Click to update'>Modify</a></td>`; 
                dataTable += `<td><a href='#' title='Click to delete'>Delete</a></td></tr>`;
            }
        }) 
        dataTable += '</tbody>'; 
        // Display the contents in the Inventory Management view 
        inventoryDisplay.innerHTML = dataTable; 
    }
}


const form = document.querySelector("#editinventoryform")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
})


function handleImageUpload() {
    const imageInput = document.getElementById('image');
    const selectedImage = imageInput.files[0];
    // Aquí puedes realizar acciones con el archivo de imagen seleccionado
    console.log('Selected Image:', selectedImage);
}

    // Función para manejar la selección de un archivo de miniatura
function handleThumbnailUpload() {
    const thumbnailInput = document.getElementById('thumbnail');
    const selectedThumbnail = thumbnailInput.files[0];
    // Aquí puedes realizar acciones con el archivo de miniatura seleccionado
    console.log('Selected Thumbnail:', selectedThumbnail);
}

document.querySelector('.file-upload-button-image').addEventListener('click', function () {
    handleImageUpload();
});

document.querySelector('.file-upload-button-thumbnail').addEventListener('click', function () {
    handleThumbnailUpload();
});