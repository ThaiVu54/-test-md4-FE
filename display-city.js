getAllCities();

function getAllCities() {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        type: "GET",
        url: 'http://localhost:8080/cities',
        success: function (data) {
            let content = '<tr>\n' +
                '        <th>ID</th>\n' +
                '        <th>CITY</th>\n' +
                '        <th>COUNTRY</th>\n' +
                '        <th colspan="2">ACTION</th>\n' +
                '        </tr>';
            for (let i = 0; i < data.length; i++) {
                content += getCity(data[i])
            }
            document.getElementById("formCity1").innerHTML = content;
        }
    })
}

function getCity(city) {
    return `<tr>
                        <td >${city.id}</td>
                        <td><button type="button" value="${city.id}" onclick="showInfoCity(this)">${city.name}</button></td>
                        <td>${city.country.name}</td>` +
        `<td><button type="button" value="${city.id}" onclick="showEditCity(this)">Edit</button></td>` +
        `<td><button type="button" value="${city.id}" onclick="deleteCity(this)">Delete</button></td>` +
        `</tr>`;
}

function closeDetailCityForm() {
    $('#FormDetails').modal('hide')
}

function showInfoCity(a) {
    $('#FormDetails').modal('show');
    let id = a.getAttribute("value")
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/cities/${id}`,
        success: function (data) {
            let content =
                '            <div class="modal-header">\n' +
                '                <h5 class="modal-title" id="titleModal4">' + data.name + '</h5>\n' +
                '                 <button onclick="closeDetailCityForm()" class="btn btn-primary">Show Cities</button>\n' +
                '            </div>\n' +
                '            <!-- body -->\n' +
                '            <div class="modal-body">\n' +
                '                <div class="modal-container">\n' +
                '                    <h3>City ' + data.name + '</h3>\n' +
                '                        <div>\n' +
                '                            <h5>Name: </h5>\n' +
                '                            <p>' + data.name + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3">\n' +
                '                            <h5>Country: </h5>\n' +
                '                            <p>' + data.country.name + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3">\n' +
                '                            <h5>Diện tích: </h5>\n' +
                '                            <p>' + data.area + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3">\n' +
                '                            <h5>Population: </h5>\n' +
                '                            <p>' + data.population + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3">\n' +
                '                            <h5>GDP: </h5>\n' +
                '                            <p>' + data.gpa + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3">\n' +
                '                            <h5>Description: </h5>\n' +
                '                            <p>' + data.description + '</p>\n' +
                '                        </div>\n' +
                '                        <div class="mb-3" id="btn_delete_yes" style="margin-left: 10px">\n' +
                '                            <button onclick="showEditCity(' + data.id + ')" class="btn btn-secondary">Update</button>\n' +

                '                            <button onclick="showFormDeleteCity(' + data.id + ')" class="btn btn-secondary">Delete</button>\n' +
                '                        </div>\n' +
                '                </div>\n' +
                '            </div>'

            document.getElementById('viewDetails').innerHTML = content
        }
    })
    event.preventDefault();
}

function showEditCity(a) {
    $('#FormDetails').modal('hide');
    $('#FormEditCity').modal('show');
    let id = a.getAttribute("value")
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/cities/' + id,
        success: function (data) {
            $('#cityNameEdit').val(data.name);
            $('#descriptionEdit').val(data.description);
            $('#gdpEdit').val(data.gpa);
            $('#areaEdit').val(data.area);
            $('#populationEdit').val(data.population);
            $('#countryEdit').val(data.country.id);
            $('#cityIdEdit').val(data.id);
            $.ajax({
                type: "GET",
                url: 'http://localhost:8080/countries',
                success: function (country) {
                    let content = ''
                    for (let i = 0; i < country.length; i++) {
                        if (country[i].id === data.country.id) {
                            content += '<option value="' + country[i].id + '" selected>' + country[i].name + '</option>\n'
                        } else {
                            content += '<option value="' + country[i].id + '">' + country[i].name + '</option>\n'
                        }


                    }
                    document.getElementById("countryEdit").innerHTML = content;
                }
            })
        }
    })
    event.preventDefault();
}


function showFormAdd() {
    $('#FormCity').modal('show')
}

function showFormDeleteCity(city) {
    $('#FormDetails').modal('hide');
    $('#cityIdDelete').val(city.id);
    $('#FormDelete').modal('show');
}

function deleteCity(a) {
    let cityId = a.getAttribute("value");
    $.ajax({
        type: "DELETE",
        url: 'http://localhost:8080/cities/' + cityId,
        success: function () {
            alert("Delete Success")
            getAllCities()
        }
    });
    event.preventDefault();
}

function closeDeleteForm() {
    $('#FormDelete').modal('hide')
}

function closeCityAddForm() {
    $('#FormCity1').modal('hide')
}

function resetForm() {
    $('#cityName').val("");
    $('#area').val("");
    $('#population').val("");
    $('#gdp').val("");
    $('#description').val("");
    $('#country').val("");
}

function addCity() {
    let name = $('#cityName').val();
    let area = $('#area').val();
    let population = $('#population').val();
    let gpa = $('#gdp').val();
    let description = $('#description').val();
    let country = $('#country').val();
    let data = {
        name: name,
        area: area,
        population: population,
        gpa: gpa,
        description: description,
        country: {
            id: country
        }
    }
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        url: 'http://localhost:8080/cities',
        date: JSON.stringify(data),
        success: function () {
            getAllCities()
            closeCityAddForm()
            resetForm();
        }
    })
    event.preventDefault();
}


function closeCityEditForm() {
    $('#FormEditCity').modal('hide');
}

function updateCity() {
    let name = $('#cityNameEdit').val();
    let description = $('#descriptionEdit').val();
    let gdp = $('#gdpEdit').val();
    let population = $('#populationEdit').val();
    let countryId = $('#countryEdit').val();
    let area = $('#areaEdit').val();
    let cityId = $('#cityIdEdit').val();
    let data = {
        id: cityId,
        name: name,
        description: description,
        area: area,
        gdp: gdp,
        population: population,
        country: {
            id: countryId
        }
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

        type: "PUT",
        url: 'http://localhost:8080/cities/' + cityId,
        data: JSON.stringify(data),
        success: function () {
            getAllCities()
            $('#FormEditCity').modal('hide');
            alert("Update Success")
        }
    })
    event.preventDefault();
}