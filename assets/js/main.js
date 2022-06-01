const query = (element) => document.querySelector(element);
let typeModal;

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
    };
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

const topPage = () => {
    window.scrollTo(0, 0);
};

const setMaskName = () => {
    let inputName = query('#input-name');
    let setName = inputName.value;
    setName = setName.replace(/\d*/g, '').replace(/[!@#$%^&*=;:"|\\\+\{}\[\]><\/?\.\-]/g, '');
    inputName.value = setName;
};

const setMaskTel = () => {
    let inputTel = query('#input-tel');
    let setTel = inputTel.value;
    setTel = setTel.replace(/(^[A-Za-z])/g, '').replace(/[!@#$%^&*=;:"|\\\+\{}\[\]><\/?\.']/g, '');
    setTel = setTel.replace(/^(\d{2})/, '($1)');
    
    if(setTel.length > 12 && setTel.length <= 13) {
        setTel = setTel.replace(/(\d{4}$)/, '-$1');
    };
    
    inputTel.value = setTel;
};

const setMaskCep = () => {
    let inputCep = query('#input-cep');
    let setCep = inputCep.value;
    setCep = setCep.replace(/(^[A-Za-z])/g, '').replace(/[!@#$%^&*=;:"|\\\+\{}\[\]><\/?\.']/g, '');

    if(setCep.length > 7 && setCep.length <= 8) {
        setCep = setCep.replace(/(\d{3}$)/, '-$1');
    };

    inputCep.value = setCep;
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

const validateForm = (client) => {
    let validation = {
        status: true,
        message: '',
    };

    let emailConfirm = client.email.indexOf("@") !== -1;

    if (client.name == ''||client.email == ''||client.tel == ''||client.cep == '') {
        validation.status = false;
        validation.message = 'Preencha todos os campos!';
        return validation;

    } else if (emailConfirm === false) {
        validation.status = false;
        validation.message = 'Formato de e-mail inválido';
        return validation;
    } else if (client.tel.length < 14) {
        validation.status = false;
        validation.message = 'Formato de telefone inválido';
        return validation;
    } else if (client.cep.length < 9) {
        validation.status = false;
        validation.message = 'Formato de cep inválido';
        return validation;
    } else {
        validation.status = true;
        return validation;
    };
};

const createClient = () => {
    typeModal = 'create';
    
    let client = {
        name: query('#input-name').value,
        email: query('#input-email').value,
        tel: query('#input-tel').value,
        cep: query('#input-cep').value,
    };

    let dbClient = readDB();
    let checkTypeClient = query('#checkEdit').value;
    
    let validation = validateForm(client);
    if(validation.status === false){
       window.alert(validation.message);
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
        };
    };
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
        typeModal = 'edit';

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
    };
};

const keyEnterConfirm = (e) => {
    const modal = query('#modal-cad');
    if(modal.style.display == "flex") {
        (e.keyCode === 13)? createClient(): '';
    }; 
};

updateDbInfo();

query('#btn-add-client').addEventListener('click', openModal);
query('#btn-cancel').addEventListener('click', closeModal);
query('#btn-submit').addEventListener('click', createClient);
document.addEventListener('click', clientEditOrDelete);
query('.btn-mobile-page').addEventListener('click', topPage);
query('#input-name').addEventListener('keyup', setMaskName);
query('#input-tel').addEventListener('keyup', setMaskTel);
query('#input-cep').addEventListener('keyup', setMaskCep);
document.addEventListener('keyup', keyEnterConfirm);