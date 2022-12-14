function login() {
    var password = document.getElementById("typePasswordX").value;
    var login = document.getElementById("typeEmailX").value;

    if (login === "" || password === "") {
        alert("Insira todos os campo");
    } else {
        axios.post("https://localhost:7030/Login/Login?email=" + login + "&password=" + password)
            .then(function (response) {
                window.sessionStorage.setItem("autentification", true);
                window.sessionStorage.setItem("login", login);

                axios.get('https://localhost:7030/Login/GetAllLogin')
                    .then(function (response) {
                        while (response.data[i].email != null) {

                            if (response.data[i].email == login) {
                                window.sessionStorage.setItem("userID", response.data[i].id);

                            }

                            i++;
                        }
                    })
                    .catch(function (error) {
                        alert(error.response.data.title);
                    });


                window.location.href = "home.html";
            })
            .catch(function (error) {
                alert(error.response.data);
            });
    }
}

function signup() {
    var emailFront = document.getElementById("email-signup").value;
    var passwordFront = document.getElementById("password-signup").value;
    var nameFront = document.getElementById("name-signup").value;


    if (nameFront === "" || emailFront === "" || passwordFront === "") {
        alert("Insira todos os campos");
    } else {
        axios.post('https://localhost:7030/Login/Create', {
            name: nameFront,
            email: emailFront,
            password: passwordFront
        })
            .then(function (response) {
                window.location.href = "login.html";
            })
            .catch(function (error) {
                alert(error.response.data.title);
            });
    }
}

function updateLogin() {
    var password = document.getElementById("password-update").value;
    var login = document.getElementById("email-update").value;
    var id = document.getElementById("id-update").value;
    var name = document.getElementById("name-update").value;

    if (login === "" || password === "") {
        alert("Insira todos os campo");
    } else {
        axios.put("https://localhost:7030/Login/Update", {
            idLogin: id,
            name: name,
            email: login,
            password: password
        }).then(function (response) {
            window.location.href = "Home.html";
        })
            .catch(function (error) {
                alert(error.response.data);
            });
    }
}


function deleteElement(parentId, placa) {
    document.getElementById(parentId).remove();
    let i = 0;
    axios.get('https://localhost:7030/Car/GetAllCar')
        .then(function (response) {
            while (response.data[i].idCar != null) {

                if (response.data[i].plate == placa) {
                    axios.delete("https://localhost:7030/Car/Delete?id=" + response.data[i].idCar);
                    break;
                }

                i++;
            }
        })
        .catch(function (error) {
            alert(error.response.data.title);
        });

}

function updateElement(placa, marca, modelo) {
    let i = 0;
    axios.get('https://localhost:7030/Car/GetAllCar')
        .then(function (response) {
            while (response.data[i].idCar != null) {


                if (response.data[i].plate == placa) {
                    axios.put("https://localhost:7030/Car/Update", {
                        idCar: response.data[i].idCar,
                        modelCar: modelo,
                        carBrand: marca,
                        plate: placa
                    });
                }
                i++;
            }
        })
        .catch(function (error) {
            alert(error.response.data);
        });


}

function setInitialCarValues() {
    window.sessionStorage.setItem("carValue", 0);
    var i = 0;

    axios.get('https://localhost:7030/Car/GetAllCar')
        .then(function (response) {
            while (response.data[i].idCar != null) {
                createCar(response.data[i].carBrand, response.data[i].modelCar, response.data[i].plate, 0);
                i++;
            }
        })

}

function createCar(marca, modelo, placa, criar) {

    if (modelo === "" || marca === "" || placa === "") {
        alert("Insira todos os campos");
    } else {

        var carvalue = parseInt(sessionStorage.getItem("carValue"), 10);
        sessionStorage.setItem("carValue", carvalue + 1);

        // Criar a nova div
        let div = document.createElement('div');
        div.classList.add('col-sm-4');
        div.classList.add('car');
        div.classList.add('center');
        let id = sessionStorage.getItem("carValue");
        div.setAttribute("id", "div" + id);

        // Setar o tipo que cada titulo vai ser
        let title = document.createElement('h1')
        let titleMarca = document.createElement('h2');
        let titleModelo = document.createElement('h2');
        let titlePlaca = document.createElement('h2');
        let lineBreak = document.createElement('h2');

        //Criar titulo e conteúdo da marca do carro na nova div
        title.append(document.createTextNode("Carro "), sessionStorage.getItem("carValue"));
        titleMarca.appendChild(document.createTextNode("Marca"));
        titleModelo.appendChild(document.createTextNode("Modelo"));
        titlePlaca.appendChild(document.createTextNode("Placa"));
        lineBreak.appendChild(document.createTextNode(""));

        // Criar o botão de Remove
        var buttonRemove = document.createElement('BUTTON');
        buttonRemove.classList.add('btn');
        buttonRemove.classList.add('btn-size');
        buttonRemove.classList.add('btn-primary')
        var text = document.createTextNode("Remove");
        buttonRemove.appendChild(text);
        buttonRemove.addEventListener("click", () => deleteElement("div" + id, placa))


        let inputMarca = document.createElement('INPUT');
        inputMarca.setAttribute("id", "inputMarca" + id);
        let inputModelo = document.createElement('INPUT');
        inputModelo.setAttribute("id", "inputModelo" + id);
        let inputPlaca = document.createElement('INPUT');
        inputPlaca.setAttribute("id", "inputPlaca" + id);
        inputPlaca.setAttribute('readonly', true);

        // Criar o botão de Update
        var buttonUpdate = document.createElement('BUTTON');
        buttonUpdate.classList.add('btn');
        buttonUpdate.classList.add('btn-size');
        buttonUpdate.classList.add('btn-primary')
        text = document.createTextNode("Update");
        buttonUpdate.appendChild(text);


        inputMarca.value = marca;
        inputModelo.value = modelo;
        inputPlaca.value = placa;

        buttonUpdate.addEventListener("click", () => updateElement(document.getElementById("inputPlaca" + id).value, document.getElementById("inputMarca" + id).value, document.getElementById("inputModelo" + id).value))

        // colocaar os valores na div
        div.appendChild(title);
        div.appendChild(titleMarca);
        div.append(inputMarca);
        div.appendChild(titleModelo);
        div.append(inputModelo);
        div.appendChild(titlePlaca);
        div.append(inputPlaca);
        div.appendChild(lineBreak);
        div.appendChild(buttonRemove);
        div.appendChild(buttonUpdate);

        document.getElementById('car-row').appendChild(div);

        if (criar === 1) {
            axios.post('https://localhost:7030/Car/Create', {
                idCar: id,
                modelCar: modelo,
                carBrand: marca,
                plate: placa
            })
                .then(function (response) {
                })
                .catch(function (error) {
                    alert(error.response.data);
                });
        }
    }

}

function logout() {
    window.sessionStorage.setItem("autentification", "false");
    window.sessionStorage.setItem("login", "");
    window.location.href = "home.html";
}

function deleteAccount(){
    var id = document.getElementById("id-update").value;

    axios.delete('https://localhost:7030/Login/Delete?id='+id)
    .then(function (response) {
        logout();
    })
    .catch(function (error) {
        alert(error.response.data.title);
    });
}