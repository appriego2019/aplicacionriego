'use strict'

// variables 
var presipitacionTiempo;
var humedadTiempo;
var humedadConfiguradaNormal;
var humedadConfiguradaMinima;
var humedadConfiguradaMaxima;
var horaDeRegado;
var tiempoPorHoras;
var sensorUno;
var sensorDos

// librerias y conexion para almacenamiento
// const os = require('os');
// const storage = require('electron-json-storage');
// se fija la ruta donde se almacenara la informacion temporal del tiempo
// storage.setDataPath(os.tmpdir());
storage.setDataPath(os.homedir());

//  librerias para conexion de sockets
const io = require('socket.io-client');
var socket = io.connect('http://localhost:3002');


// recibe los datos enviados del arduino
socket.on('arduino:data', function (data) {
    console.log(data);
    // transformamos en float y redondeamos
    sensorUno = Math.round(parseFloat(data.value.slice(0,5)));
    sensorDos = Math.round(parseFloat(data.value.slice(6,12)));
    // Llamar a la funcion presentar humedad de sensores
    presentarHumedadSensores(sensorUno, sensorDos);
});

// funciones para enviar dato al arduino
// encender bomba 1
function encenderBomba1() {
    console.log('se ejecuto');
    var data = {
        value: 'a'
    }
    socket.emit('prueba', data);

    setTimeout(function(){
        apagarBomba1();
        // Cambiar a tiempo de 10 minutos 
    }, 3000);
}

// encender bomba 2
function encenderBomba2() {
    console.log('se ejecuto');
    var data = {
        value: 'b'
    }
    socket.emit('prueba', data);
    setTimeout(function(){ 
        apagarBomba2();
        // Cambiar a tiempo de 10 minutos 
    }, 3000);
}



// apagar bomba 1
function apagarBomba1() {
    var data = {
        value: 'o'
    }
    socket.emit('prueba', data);
}

// apagar bomba 2
function apagarBomba2() {
    var data = {
        value: 'o'
    }
    socket.emit('prueba', data);
}


///// evaluaciones de porcentajes configuracion total y tiempo 

// // obtener el coeficiente de jardin total
function obtenerConfiguracioTotal() {
    storage.get('configuracionTotal', function(error, data) {
    if (error) throw error;
    humedadConfiguradaNormal =  Math.round(data.nbNormalPorcentaje.valor);
    humedadConfiguradaMinima =  Math.round(data.nbMinimaPorcentaje.valor);
    humedadConfiguradaMaxima =  Math.round(data.nbMaximaPorcentaje.valor);
  });
}
obtenerConfiguracioTotal(); 


// funcion para obtener el almacenamiento interno del tiempo
function obtenerStorage(){
    storage.get('tiempo', function(error, data) {
        if (error) throw error;
        console.log(data);
         presipitacionTiempo = (data.currently.precipIntensity)*100;
         humedadTiempo = (data.currently.humidity)*100;
         tiempoPorHoras = data.hourly.data;
        //  evaluarSiLlovera(tiempoPorHoras);
      });
}
obtenerStorage();

// GUARDAR HORA PARA PODER REGAR 
function guardarHora(){
    var horaregado = document.getElementById('horaregado').value;
    var hora ={
        horaregado:parseInt(horaregado)
    };
    storage.set('horaregado', hora, function(error) {
      if (error) throw error;
      console.log("Guardado correctamente la hora regado", hora);
    //   obtenerHoraRegado();
    });
}

// Obtener la hora de riego
function obtenerHoraRegado() {
    storage.get('horaregado', function(error, data) {
        if (error) throw error;
        horaDeRegado = data.horaregado;
      });
}

obtenerHoraRegado();


// funcion para evaluar porcentaje del sensor 
function evaluarPorcSensor(humedadSensor1, humedadSensor2) {
    // console.log('se ejecuto evaluar sensores');
    // SENSOR 1
    // evaluar si es menor a la humedad minima regar 
    if (humedadSensor1 <= humedadConfiguradaMinima) {
        // regar imediatamente
        console.log('regar1');
        encenderBomba1();
    }
    // SENSOR 2
     // evaluar si es menor a la humedad minima regar 
     if (humedadSensor2 <= humedadConfiguradaMinima) {
        // regar imediatamente
        console.log('regar2');
        encenderBomba2();
    }
}

// evaluar si llovera durante las proximas 12 horas luego de ingresar la hora de regado
// function evaluarSiLlovera(tiempoPorHoras) {
function evaluarSiLlovera() {
    // variable contadora si llovera 
    var contadorProbalilidad=0;
    // fecha y hora actual
    var fechaHoy = new Date();
    var horaHoy = fechaHoy.getHours();
    var fechaActual = fechaHoy.getFullYear+'/'+fechaHoy.getMonth()+'/'+fechaHoy.getDay();
    // indice hasta 12 horas 
    var indiceInicial;
    var indiceFinal;
    // recorre toda la data de horas
    tiempoPorHoras.forEach(function (element, index){
        var fecha = new Date(element.time*1000);
        var hora = fecha.getHours();
        var fechaEvaluar = fecha.getFullYear+'/'+fecha.getMonth()+'/'+fecha.getDay();
        if (horaHoy == hora && fechaActual == fechaEvaluar) {
            indiceInicial = index;
            indiceFinal =index+12;
            // recorre las 12 horas el tiempo desde el indice inicial hasta el final
            tiempoPorHoras.forEach(function (horadata, indice){
                if (indice >= indiceInicial && indice <=indiceFinal) {
                    //  variable que almacena temporalmente intencidad de presipitacion que se prevee
                    var precipitacion = horadata.precipIntensity*100;
                    // console.log('indice', indice, horadata);
                    // Evaluar intencidad de presipitacion durante las proximas 12 horas 
                    if (precipitacion >= 40) {
                        contadorProbalilidad++;
                    }
                }
            });
            // Si habra probabilidad de lluvia no encender caso contrario encender electrovalvulas
            if (contadorProbalilidad > 0) {
                // No encender
                console.log('No se necesita encender ya que llovera en las proximas 12 horas');
            }else{
                encenderBomba1();
                encenderBomba2();
            }
        }
    });
}

// Evaluar si ya esta sobre la hora de regado
function evaluarHoraRegado() {
    // console.log('se evalua hora de regado');
    // 
    var fechaHoy = new Date();
    var horaHoy = fechaHoy.getHours();
    // evaluar si es igual a la hora configurada
    if (horaHoy == horaDeRegado) {
        console.log('evaluar si llovera durante las proximas 12 horas');
        evaluarSiLlovera();
    }
}

// funcion para repetir cada  hora
setInterval(function(){
    // console.log('se ejecuto') ;
    // Evaluar porcentajes de humedad cada hora
    evaluarPorcSensor(sensorUno, sensorDos);
    // evaluar tiempo de regado
    evaluarHoraRegado();

    // Cambiar el tiempo para evaluar el tiempo de presipitacion y humedad 
},3000 );



// Presentar humedad de sensores cada 10 segundos
// setInterval(function(){
//     presentarHumedadSensores();
// },10000 );

// Funcion para Presentar humedad de sensores en tarjetas
function presentarHumedadSensores(sensorUno, sensorDos) {
    console.log('presentar ');
    if (document.getElementById('humedadSensor1') && document.getElementById('humedadSensor2')) {
        console.log('entro para presentar');
        document.getElementById('humedadSensor1').innerHTML = sensorUno+'%';
        document.getElementById('humedadSensor2').innerHTML=sensorDos+'%';
    }
}
