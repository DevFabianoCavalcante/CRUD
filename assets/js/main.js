const query = (element) => document.querySelector(element);

const createDB = (element) => localStorage.setItem('db_client', JSON.stringify(element));

const readDB = () => JSON.parse(localStorage.getItem('db_client'))??[];

const editDB = (client, index) => {
    const dbClient = readDB();
    dbClient.splice(index, 1, client);
    createDB(dbClient);
};

const deleteItemDB = (name, index) => {
    const confirm = window.confirm(`deseja excluir o usuário ${name}?`);
    if(confirm) {
        const dbClient = readDB();
        dbClient.splice(index, 1);
        createDB(dbClient);
        clearBodyTable();
        updateDbInfo();
    }
};

const openModal = () => {
    query('#modal-cad').style.display = "flex";
    query('.primary-screen').style.opacity = '0.3';
};

const closeModal = () => {
    query('#modal-cad').style.display = "none";
    query('.primary-screen').style.opacity = '1';
    clearInput();
};

const updateDbInfo = () => {
    const dbClient = readDB();

    dbClient.forEach((el, index) => {
        const modal = query('.modal-row').cloneNode(true);
        modal.style.display = "flex";
        modal.setAttribute('data-index', index);
        modal.querySelector('#column-name').innerHTML = dbClient[index].name;
        modal.querySelector('#column-email').innerHTML = dbClient[index].email;
        modal.querySelector('#column-tel').innerHTML = dbClient[index].tel;
        modal.querySelector('#column-cep').innerHTML = dbClient[index].cep;
        document.querySelector('.tbody-main-table').append(modal);
    });
};

const clearBodyTable = () => {
    const trTable = document.querySelectorAll('.tbody-main-table tr');
    trTable.forEach(el => el.parentNode.removeChild(el));
};

const clearInput = () => {
    const inputForm = document.querySelectorAll('.input-form');
    inputForm.forEach(input => input.value = '');
}

const createClient = () => {
    let client = {
        name: query('#input-name').value,
        email: query('#input-email').value,
        tel: query('#input-tel').value,
        cep: query('#input-cep').value,
    };

    let dbClient = readDB();
    let checkTypeClient = query('#checkEdit').value;

    if(client.name == ''||client.email == ''||client.tel == ''||client.cep == ''){
       window.alert('Preencha todos os campos!');
    } 
    else {
        if(checkTypeClient == '') {
            dbClient.push(client);
            createDB(dbClient);
            closeModal();
            clearBodyTable();
            updateDbInfo();
        } else{
            editDB(client, checkTypeClient);
            clearBodyTable();
            updateDbInfo();
            closeModal();
        }
    }
};

const setInfoImput = (clientInfo, indexClient) => {
    const client = clientInfo;

    query('#input-name').value = client.name;
    query('#input-email').value = client.email;
    query('#input-tel').value = client.tel;
    query('#input-cep').value = client.cep;
    query('#checkEdit').value = indexClient;
};

const clientEditOrDelete = (e) => {
    const clickArea = e.target;

    if(clickArea.classList.contains('btn-edit')) {
        const btnClient = clickArea.parentNode;
        const client = btnClient.parentNode;
        const indexClient = client.getAttribute('data-index');
        let dbClient = readDB();
        let clientEdit = dbClient.find((client, index) => {
            if(indexClient == index) {
                return client;
            };
        });
        openModal();
        setInfoImput(clientEdit, indexClient);
        
    } 
    else if (clickArea.classList.contains('btn-delete')) {
        const btnClient = clickArea.parentNode;
        const client = btnClient.parentNode;
        const nameClient = client.querySelector('#column-name').innerHTML;
        const indexClient = client.getAttribute('data-index');

        deleteItemDB(nameClient, indexClient);
    }
};

updateDbInfo();

const topPage = () => {
    window.scrollTo(0, 0);
}

query('#btn-add-client').addEventListener('click', openModal);
query('#btn-cancel').addEventListener('click', closeModal);
query('#btn-submit').addEventListener('click', createClient);
document.addEventListener('click', clientEditOrDelete);
query('.btn-mobile-page').addEventListener('click', topPage);