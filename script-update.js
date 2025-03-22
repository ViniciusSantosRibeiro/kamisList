let itemsList = [];

let newItem = document.querySelector("#newItem");
let btnNewItem = document.querySelector("#addNewItem");
let items = document.querySelector("#items");

getList();

btnNewItem.addEventListener("click", () => {
    const audio = document.getElementById('createItemSound');
    if (newItem.value == "") { return; }
    pushItem({ name: newItem.value, id: createID(), marked: false });
    audio.play();
    newItem.value = "";
});

function getList() {
    const audio = document.getElementById('startSound');
    audio.play();

    let list = localStorage.getItem("itemsList");
    if (list) {
        let itemsFromStorage = JSON.parse(list);
        for (const item of itemsFromStorage) {
            pushItem(item, false);
        }
    }
}

function createID() {
    return Math.floor(Math.random() * 9999);
}

function pushItem(item, newItem = true) {
    itemsList.push(item);
    items.appendChild(createItem(item));

    if (newItem) {
        localStorage.setItem("itemsList", JSON.stringify(itemsList));
    }
}

function createItem(item) {
    let li = document.createElement("li");

    // Cria o container com flex
    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.style.width = "100%";

    // Área esquerda com copy e check
    let leftButtons = document.createElement("div");
    leftButtons.style.display = "flex";
    leftButtons.style.gap = "10px";

    let btnCopy = document.createElement("img");
    btnCopy.src = 'IMGs/copy.png';
    btnCopy.draggable = false;
    btnCopy.id = 'copy';
    btnCopy.style.cursor = 'pointer';
    btnCopy.onclick = () => copyItem(item.id);

    let btnCheck = document.createElement("img");
    btnCheck.src = 'IMGs/check.png';
    btnCheck.draggable = false;
    btnCheck.id = 'check';
    btnCheck.style.cursor = 'pointer';
    btnCheck.onclick = () => checkItem(item.id);

    leftButtons.appendChild(btnCopy);
    leftButtons.appendChild(btnCheck);

    // Texto
    let text = document.createElement("a");
    text.innerText = item.name;
    text.style.margin = "0 10px";
    if (item.marked) {
        text.classList.add('marked');
    }

    // Botão de deletar à direita
    let btnDelete = document.createElement("img");
    btnDelete.src = 'IMGs/delete.png';
    btnDelete.draggable = false;
    btnDelete.id = 'delete';
    btnDelete.style.cursor = 'pointer';
    btnDelete.onclick = () => deleteItem(item.id);

    // Monta estrutura
    container.appendChild(leftButtons);
    container.appendChild(text);
    container.appendChild(btnDelete);

    li.appendChild(container);
    li.className = "animate__animated animate__bounceIn";
    li.style.marginBottom = "15px";
    li.id = item.id;

    // Ativa drag and drop simples
    li.draggable = true;
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", dropItem);
    li.addEventListener("dragend", dragEnd);

    return li;
}

// Remove item com animação
function deleteItem(id) {
    let index = itemsList.findIndex(i => i.id == id);
    if (index < 0) {
        alert("ID not found!");
        return;
    }

    const audio = document.getElementById('deleteItemSound');
    audio.play();

    const li = document.getElementById("" + id);
    li.className = "animate__animated animate__backOutUp";

    setTimeout(() => {
        itemsList.splice(index, 1);
        localStorage.setItem("itemsList", JSON.stringify(itemsList));
        li.remove();
    }, 700);
}

function checkItem(id) {
    let msg = document.getElementById(id).querySelector("a");
    const audio = document.getElementById('checkItemSound');
    const parent = document.getElementById(id);
    const index = itemsList.findIndex(i => i.id === id);

    if (index === -1) return;

    const item = itemsList[index];

    if (!msg.classList.contains('marked')) {
        audio.play();
        msg.classList.add('marked');
        parent.className = "animate__animated animate__headShake";
        item.marked = true; // Salva como marcado
    } else {
        msg.classList.remove('marked');
        parent.className = "animate__animated";
        item.marked = false; // Salva como desmarcado
    }

    localStorage.setItem("itemsList", JSON.stringify(itemsList));
}

function copyItem(id) {
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

function sucessCopy(msgCopy) {
    const audio = document.getElementById('copyItemSound');
    audio.play();
    const msg = document.getElementById("copy-message");
    msg.className = "animate__animated animate__fadeInDown";
    msg.querySelector("h1").innerText = "Mensagem copiada: \n" + msgCopy;

    msg.classList.remove("hidden");
    setTimeout(() => {
        msg.className = "animate__animated animate__backOutUp";
        setTimeout(() => {
            msg.classList.remove("hidden");
        }, 900);
    }, 1500);
}

//
// DRAG AND DROP FUNCIONAL SIMPLES (sem efeitos visuais)
//
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
    e.preventDefault(); // Necessário para permitir drop
}

function dropItem(e) {
    e.preventDefault();
    if (this !== draggedItem) {
        const children = Array.from(items.children);
        const draggedIndex = children.indexOf(draggedItem);
        const targetIndex = children.indexOf(this);

        if (draggedIndex < targetIndex) {
            this.after(draggedItem);
        } else {
            this.before(draggedItem);
        }
        updateItemsListFromDOM();
    }
}

function dragEnd() {
    draggedItem = null;
}

function updateItemsListFromDOM() {
    const listItems = Array.from(items.children);
    const newList = [];

    listItems.forEach(li => {
        const id = parseInt(li.id);
        const item = itemsList.find(i => i.id === id);
        if (item) {
            newList.push(item);
        }
    });

    itemsList = newList;
    localStorage.setItem("itemsList", JSON.stringify(itemsList));
}
