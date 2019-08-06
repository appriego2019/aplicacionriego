'use strict'

var request = require('request');
const os = require('os');
const storage = require('electron-json-storage');
// se fija la ruta donde se almacenara la informacion temporal del tiempo
// storage.setDataPath(os.tmpdir());
storage.setDataPath(os.homedir());
var cuerpo;

const config = {
    url: "https://api.darksky.net/forecast/",
    apikey: "cd747cc8303ae0aea22c1b4182eea273",
    latitud: "-3.999375",
    longitud: "-79.375786",
    unidades: "?units=si"
};


//Step 1 - Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
//'http://api.openweathermap.org/data/2.5/weather?q=Loja,EC-L&units=metric&appid=068b43201df12879ba591154bfa02861'
//Step 2 - Configure the request
var options = {
    url     : config.url+config.apikey+'/'+config.latitud+','+config.longitud+config.unidades,
    method  : 'GET',
    jar     : true,
    headers : headers
}

//Step 3 - do the request
// funcion para ctualizar y obtener el tiempo actual
function peticion(){
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        cuerpo = JSON.parse(body);
        guardarStorage();
        //document.getElementById('temp1').innerHTML=cuerpo.currently.temperature+'&degC';
    }
});
}

// funcion para guardar en memoria interna los valores del tiempo actual 
// permitiendo hacer N consultas a esta informacion sin necesidad de ir a consultar directamente a la API
// ya que esto genera costos luego de 1000 peticiones diarias
function guardarStorage(){
      storage.set('tiempo', cuerpo, function(error) {
        if (error) throw error;
        console.log("Guardado correctamente");
        obtenerStorage();
      });
}

// function obtenerStorage(){
//     storage.get('tiempo', function(error, data) {
//         if (error) throw error;
//         console.log(data);
//         document.getElementById('temp1').innerHTML=data.currently.temperature+'&degC';
//       });
// }


// funcion para obtener el almacenamiento interno del tiempo
function obtenerStorage(){
    storage.get('tiempo', function(error, data) {
        if (error) throw error;
        console.log(data);
        var presipitacion = (data.currently.precipIntensity)*100;
        var humedad = (data.currently.humidity)*100;
        
        // redondear 
        humedad = Math.round(humedad);
        presipitacion = Math.round(presipitacion);
        // evaluar presipitacion es 0
        if (presipitacion == 0) {
            presipitacion = 0.01;
        }

        if (document.getElementById('presipitacion') && document.getElementById('humedad')) {
            document.getElementById('presipitacion').innerHTML = presipitacion+'%';
            document.getElementById('humedad').innerHTML=humedad+'%';
        }
        // document.getElementById('presipitacion').innerHTML = presipitacion+'%';
        // document.getElementById('humedad').innerHTML=humedad+'%';
        // Evaluar cielo
        var cielo = data.currently.summary;
        if (cielo === 'Overcast') {
            cielo = 'Nublado';
        }else{
            if (cielo==='Foggy') {
                cielo='Brumoso';
            }else{
                if (cielo === 'Mostly Cloudy') {
                    cielo = 'Mayormente Nublado';
                }else{
                    if (cielo==='Partly Cloudy') {
                        cielo = 'Parcialmente Nublado';
                    }else{                            
                        if (cielo === 'Clear') {
                            cielo = 'Claro';
                        }
                    }
                }
            }
        }
        // document.getElementById('tiempocielo').innerHTML ='Cielo: '+ cielo;
        if (document.getElementById('tiempocielo')) {
            document.getElementById('tiempocielo').innerHTML ='Cielo: '+ cielo;
        }

      });
}
obtenerStorage();

// obtener el coeficiente de jardin
function obtenerConfiguracioTotal() {
    storage.get('configuracionTotal', function(error, data) {
    if (error) throw error;
    var humedad =  Math.round(data.nbNormalPorcentaje.valor);
    // document.getElementById('humedadJardin').innerHTML = 'Humedad Configurada: '+humedad+'%';
    if (document.getElementById('humedadJardin')) {
    document.getElementById('humedadJardin').innerHTML = 'Humedad Configurada: '+humedad+'%';  
    }
  });
}
obtenerConfiguracioTotal(); 


// Accion automatica de actualizar el tiempo cada 58 minutos 
setInterval(() => {
    peticion();
}, 3500000 );