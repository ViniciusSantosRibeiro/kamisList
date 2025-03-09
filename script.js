let itemsList = [];

let newItem = document.querySelector("#newItem");
let btnNewItem = document.querySelector("#addNewItem");
let items = document.querySelector("#items");

getList();

btnNewItem.addEventListener("click", () => {
    const audio = document.getElementById('createItemSound');
    if(newItem.value == ""){return;}
    pushItem({ name: newItem.value, id: createID()});
    audio.play();
    newItem.value = "";
})

function getList(){
    const audio = document.getElementById('startSound');
    audio.play();

    let list = localStorage.getItem("itemsList");
    if(list){
        let items = JSON.parse(list);
        for (const item of items){
            pushItem(item, false);
        }
    }
}

function createID(){
    return Math.floor(Math.random() * 9999);
}

function pushItem(item, newItem = true){
    itemsList.push(item);
    items.appendChild(createItem(item));

    if(newItem){
        localStorage.setItem("itemsList", JSON.stringify(itemsList));
    }
}

function createItem(item){
    let li = document.createElement("li");
    let btnDelete = "<img src='IMGs/delete.png' draggable='false' id='delete' onClick='deleteItem("+item.id+")'>";
    let btnCheck = "<img src='IMGs/check.png' draggable='false' id='check' onClick='checkItem("+item.id+")'>";
    let btnCopy = "<img src='IMGs/copy.png' draggable='false' id='copy' onClick='copyItem("+item.id+")'>";
    li.innerHTML = btnCopy + btnCheck + "<a>"+item.name+"</a>" + btnDelete;
    li.className = "animate__animated animate__bounceIn";
    li.style.marginBottom = "15px";
    li.id = item.id;
    return li;
}

function deleteItem(id){
    let index = itemsList.findIndex(i => i.id == id);

    if(index < 0){
        alert("ID not found!");
        return;
    }

    const audio = document.getElementById('deleteItemSound');
    audio.play();

    document.getElementById(""+id+"").className = "animate__animated animate__backOutUp";

    setTimeout(() => {
        itemsList.splice(index, 1);
        localStorage.setItem("itemsList", JSON.stringify(itemsList));
        document.getElementById(""+id+"").remove();
    }, 700);  
}

let isMarked = false;
function checkItem(id){
    let msg = document.getElementById(id).querySelector("a");

    const audio = document.getElementById('checkItemSound');

    isMarked = !isMarked;

    const parent = document.getElementById(id);

    if (!msg.classList.contains('marked')) {
        audio.play();
        parent.querySelector("#delete").style.pointerEvents = "none";
        parent.querySelector("#delete").style.cursor = "not-allowed"; 
        parent.querySelector("#delete").style.opacity = "0.3";
        document.getElementById(id).querySelector("a").classList.add('marked');
        document.getElementById(id).classList = "animate__animated animate__headShake";
    } else{
        parent.querySelector("#delete").style.pointerEvents = "auto";
        parent.querySelector("#delete").style.cursor = "pointer";
        parent.querySelector("#delete").style.opacity = "1";
        document.getElementById(id).querySelector("a").classList.remove('marked');
        document.getElementById(id).classList = "animate__animated";
    }
}

function copyItem(id){
    let showMessage = false;
    showMessage = true;
    msgCopy = document.getElementById(id).querySelector("a");
    const textToCopy = msgCopy.textContent || msgCopy.innerText;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            sucessCopy(textToCopy);
        })
        .catch(err => {
            alert("Falha ao copiar o texto: ", err);
        });
}

function sucessCopy(msgCopy){
    const audio = document.getElementById('copyItemSound');
    audio.play();
    msg = document.getElementById("copy-message");
    msg.className = "animate__animated animate__fadeInDown";
    showMessage = true;

    msg.querySelector("h1").innerText = "Menssagem copiadaa: \n" + msgCopy;

    msg.classList.remove("hidden");
    setTimeout(() => {
        msg.className = "animate__animated animate__backOutUp";
        setTimeout(() => {
            showMessage = false;
            msg.classList.remove("hidden");
        }, 900);
    }, 1500);
}