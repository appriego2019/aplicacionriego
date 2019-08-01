'use strict'

const os = require('os');
const storage = require('electron-json-storage');
// se fija la ruta donde se almacenara la informacion temporal del tiempo
// storage.setDataPath(os.tmpdir());
storage.setDataPath(os.homedir());
var km_global;
var kd_global;
var kj_global;

function generarEspecies() {
    storage.get('nombres', function (error, data) {
        if (error) throw error;
        var f = "";
        data.forEach(function (especie, index) {
            console.log(especie, index);
            f += '<div class="col">';
            f += `<label for="check` + index + `">` + especie.nombre + `</label>`;
            f += `<input type="checkbox" id="check` + index + `" value="` + especie.ke + `">`;
            f += `</div>`;
        });
        document.getElementById('listaespecies').innerHTML = f;
    });
}

generarEspecies();

function calcularKe() {
    var ke;
    var suma = 0;
    var valor;
    var contatorVegetaciones = 0;
    for (let i = 0; i < 25; i++) {
        var checkBox = document.getElementById("check" + i);

        if (checkBox != null && checkBox.checked == true) {
            valor = parseFloat(checkBox.value);
            suma = suma + valor;
            contatorVegetaciones++;
        }
    }
    ke = suma / contatorVegetaciones;
    // calcular coeficiente de jardin
    kj_global = (ke * kd_global * km_global);
    guardarCoeficienteJardin(kj_global);
    calcularEvapotraspiracion(kj_global);

}


function obtenerCoeficientes() {
    storage.get('coeficienteskmkd', function (error, data) {
        if (error) throw error;
        km_global = data.km;
        kd_global = data.kd;
    });
}
obtenerCoeficientes();



function guardarCoeficienteJardin(kj_global) {
    var coeficientedejardin = {
        nombre: 'Coeficiente de Jardín',
        valor_kj: kj_global
    }
    storage.set('coeficientedejardin', coeficientedejardin, function (error) {
        if (error) throw error;
        console.log("Guardado correctamente");
        obtenerCoeficienteJardin();
    });
}

// obtener el coeficiente de jardin
function obtenerCoeficienteJardin() {
    storage.get('coeficientedejardin', function (error, data) {
        if (error) throw error;
        document.getElementById('coeficientejardin').innerHTML = 'Humedad del Jardin Configurado Actual: ' + data.valor_kj;
    });
}
obtenerCoeficienteJardin();


// funcion para calcular la Evapotraspiracion
function calcularEvapotraspiracion(coeficienteJardin) {
    // variable evapotraspiracion necesidad neta de agua
    var et;
    // variable para referencial
    var er = 3.15;
    // varibale para necesidad bruto de agua
    var nb;
    var nbNormalPorcentaje;
    //  variable necesidad minima
    var nbMinimaPorcentaje;
    // variable necesidad maxima 
    var nbMaximaPorcentaje;
    et = er * coeficienteJardin;
    nb = (0.9 * et / 75) * 100;

    nbMinimaPorcentaje = (nb / er) * 100;
    nbNormalPorcentaje = 100 * (nb / 2.4);
    nbMaximaPorcentaje = (nb / 1.6) * 100;

    guardarConfiguracionTotal(et, nb, nbNormalPorcentaje, nbMinimaPorcentaje, nbMaximaPorcentaje);
}

// guardar variables configuradas de evapotraspiracion y NB en porcentajes 
function guardarConfiguracionTotal(et, nb, nbNormalPorcentaje, nbMinimaPorcentaje, nbMaximaPorcentaje) {
    var configuracionTotal = {
        evapotraspiracion: {
            nombre: 'evapotraspiracion',
            valor: et
        },
        nb: {
            nombre: 'necesidad bruta',
            valor: nb
        },
        nbMaximaPorcentaje: {
            nombre: 'Necesidad bruta Maxima',
            valor: nbMaximaPorcentaje
        },
        nbMinimaPorcentaje: {
            nombre: 'Necesidad bruta Minima',
            valor: nbMinimaPorcentaje
        },
        nbNormalPorcentaje: {
            nombre: 'Necesidad bruta Normal',
            valor: nbNormalPorcentaje
        },
    }
    storage.set('configuracionTotal', configuracionTotal, function (error) {
        if (error) throw error;
        console.log("Guardado correctamente");
    });
}