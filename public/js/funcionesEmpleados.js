// const url = 'http://localhost:8082/api/empleado';

const url = 'https://api-cosmetic.onrender.com/api/empleado';

const listarDatos = async () => {
  let respuesta = '';
  let body = document.getElementById('contenido');

  fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((resp) => resp.json())
    .then(function (data) {
      let listaEmpleados = data.empleados;
      listaEmpleados.forEach(function (empleado) {
        const row = document.createElement('tr');
        const estadoCell = document.createElement('td');
        const accionesCell = document.createElement('td');
        const accionesDiv = document.createElement('div');
        const editarIcon = document.createElement('a');
        const eliminarIcon = document.createElement('a');
        const switchLabel = document.createElement('label');
        const switchInput = document.createElement('input');
        const switchSpan = document.createElement('span');

        estadoCell.textContent = empleado.estado === 'true' ? 'activo' : 'inactivo';
        switchInput.type = 'checkbox';
        switchInput.checked = empleado.estado === 'true';

        switchInput.addEventListener('change', function () {
          Swal.fire({
            title: '¿Estás seguro de cambiar el estado?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              const empleadoId = row.getAttribute('data-id');
              const newEstado = this.checked ? 'true' : 'false';

              fetch(url + '?id=' + empleadoId, {
                method: 'PUT',
                mode: 'cors',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                  estado: newEstado
                })
              })
                .then((resp) => resp.json())
                .then(function (data) {
                  Swal.fire({
                    title: data.msg,
                    icon: 'success',
                  });
                  estadoCell.textContent = newEstado === 'true' ? 'activo' : 'inactivo';
                  empleado.estado = newEstado;
                })
                .catch(function (error) {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al cambiar el estado del empleado.',
                    icon: 'error',
                  });
                  console.error('Error en la solicitud:', error);
                });
            } else {
              this.checked = !this.checked;
            }
          });
        });

        editarIcon.classList.add('fa-solid', 'fa-pen-to-square');
        eliminarIcon.classList.add('fa-solid', 'fa-trash-can');

        editarIcon.addEventListener('click', function () {
          editar(empleado);
        });

        eliminarIcon.addEventListener('click', function () {
          eliminar(empleado._id);
        });

        switchLabel.classList.add('switch');
        switchSpan.classList.add('slider', 'round');

        accionesDiv.appendChild(editarIcon);
        accionesDiv.appendChild(eliminarIcon);
        accionesDiv.appendChild(switchLabel);
        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        accionesCell.appendChild(accionesDiv);

        row.setAttribute('data-id', empleado._id);

        row.innerHTML = `<td>${empleado.cedula}</td>` +
          `<td>${empleado.nombre}</td>` +
          `<td>${empleado.correo}</td>` +
          `<td>${empleado.direccion}</td>` +
          `<td>${empleado.telefono}</td>` +
          
          `<td>${empleado.observacion}</td>`;

        row.appendChild(estadoCell);
        row.appendChild(accionesCell);
        body.appendChild(row);
      });
    });
};

function registrar() {
  // Obtener los valores de los campos
  let cedula = document.getElementById('cedula').value;
  let nombre = document.getElementById('nombre').value;
  let correo = document.getElementById('correo').value;
  let direccion = document.getElementById('direccion').value;
  let telefono = document.getElementById('telefono').value;
  let estado = document.getElementById('estado').value;
  let observacion = document.getElementById('observacion').value;

  // Crear el objeto empleado
  let empleado = {
    cedula: cedula,
    nombre: nombre,
    correo: correo,
    direccion: direccion,
    telefono: telefono,
    estado: estado,
    observacion: observacion
  };

  Swal.fire({
    title: '¿Estás seguro de registrar el empleado?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(empleado),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then((resp) => resp.json())
        .then(json => {
          if (json.msg) {
            Swal.fire(
              json.msg,
              '',
              'success'
            ).then(() => {
             
              window.location.href = "/empleados";
            });
          }
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar el empleado.',
            icon: 'error',
          });
          console.error('Error en la solicitud:', error);
        });
    }
  });
}



const editar = (empleado) => {
  var url = "/editarEmpleados?empleado=" + encodeURIComponent(empleado._id);
  window.location.href = url;
};

const consultarEmpleado = (empleado) => {
  const url2 = url + '?id=' + empleado.toString();
  fetch(url2 + "", {
    method: 'GET',
    mode: 'cors',
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((resp) => resp.json())
    .then(function (data) {
      let empleado = data.empleados;
      document.getElementById('id').value = empleado._id;
      document.getElementById('cedula').value = empleado.cedula;
      document.getElementById('nombre').value = empleado.nombre;
      document.getElementById('correo').value = empleado.correo;
      document.getElementById('direccion').value = empleado.direccion;
      document.getElementById('telefono').value = empleado.telefono;
      document.getElementById('estado').value = empleado.estado;
      document.getElementById('observacion').value = empleado.observacion;
    });
};

const actualizar = async () => {
  let id = document.getElementById('id').value;
  let cedula = document.getElementById('cedula').value;
  let nombre = document.getElementById('nombre').value;
  let correo = document.getElementById('correo').value;
  let direccion = document.getElementById('direccion').value;
  let telefono = document.getElementById('telefono').value;
  let estado = document.getElementById('estado').value;
  let observacion = document.getElementById('observacion').value;

  let empleado = {
    cedula: cedula,
    nombre: nombre,
    correo: correo,
    direccion: direccion,
    telefono: telefono,
    estado: estado,
    observacion: observacion
  };

  Swal.fire({
    title: '¿Estás seguro de actualizar el empleado?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url + `?id=${id}`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(empleado),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then((resp) => resp.json())
        .then(json => {
          if (json.msg) {
            Swal.fire({
              title: json.msg,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              window.location.href = "/empleados";
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al actualizar el empleado.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6',
            });
          }
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el empleado.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
          console.error('Error en la solicitud:', error);
          
        });
    }
  });
};


const eliminar = (id) => {
  if (confirm('¿Está seguro de realizar la eliminación?') == true) {
    fetch(url + `?id=${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((resp) => resp.json())
      .then(json => {
        Swal.fire(
          json.msg,
          '',
          'success'
        ).then(() => {
          location.reload();
        });
      });
  }
};


const buscarEmpleado = async () => {
  
  const buscarEmpleado = document.getElementById("buscarEmpleado").value;

  try {
   
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });

    if (response.ok) {
      const data = await response.json();
      const empleados = data.empleados;

      let respuesta = "";
      const body = document.getElementById("contenido");

      empleados.forEach((empleado) => {
        let estadoEmpleado;
        if (empleado.estado === true || empleado.estado === "true") {
          estadoEmpleado = "activo";
        } else {
          estadoEmpleado = "inactivo";
        }

       
        const telefono = empleado.telefono.toString(); 

        if (
          empleado.nombre.toLowerCase().includes(buscarEmpleado.toLowerCase()) ||
          empleado.cedula.toLowerCase().includes(buscarEmpleado.toLowerCase()) ||
          empleado.correo.toLowerCase().includes(buscarEmpleado.toLowerCase()) ||
          empleado.direccion.toLowerCase().includes(buscarEmpleado.toLowerCase()) ||
          telefono.toLowerCase().includes(buscarEmpleado.toLowerCase()) ||
          estadoEmpleado.toLowerCase() === buscarEmpleado.toLowerCase() ||
          empleado.observacion.toLowerCase().includes(buscarEmpleado.toLowerCase())
        ) {
          

          respuesta += `<tr>
            <td>${empleado.nombre}</td>
            <td>${empleado.cedula}</td>
            <td>${empleado.correo}</td>
            <td>${empleado.direccion}</td>
            <td>${empleado.telefono}</td>
            <td>${estadoEmpleado}</td>
            <td>${empleado.observacion}</td>
            <td>
              <a class="fa-solid fa-pen-to-square" onclick='editar(${JSON.stringify(empleado)})'></a>
              <a class="fa-solid fa-trash-can" href='#' onclick='eliminar("${empleado._id}")'></a>
              <label class="switch">
                  <input type="checkbox" id="toggleSwitch">
                  <span class="slider round"></span>
                </label>
            </td>
          </tr>`;
        }
      });

      body.innerHTML = respuesta;
    } else {
      console.error("Error al obtener la lista de empleados:", response.status);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};




if (document.querySelector("#btnBuscarEmpleado")) {
  document.querySelector("#btnBuscarEmpleado").addEventListener("click", buscarEmpleado);
}


if (document.querySelector('#btnRegistrar')) {
  document.querySelector('#btnRegistrar').addEventListener('click', registrar);
}



document.addEventListener("DOMContentLoaded", function () {
  
  var url = window.location.href;

  if (url.includes("/editarEmpleados")) {
    
    var queryString = url.split('?')[1];
    var params = new URLSearchParams(queryString);
    
    var empleado = params.get('empleado');
    consultarEmpleado(empleado);
  }

  
});




