const {app, Menu, ipcMain, BrowserWindow, remote } = require('electron');
const url = require('url'); //pasar urls  como el pathname
const path = require('path');




// electron reload refrescar si cambia algo 
// solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname,{ //cambios en las vistas 
        electron: path.join(__dirname,'../node_modules', '.bin','electron') // inspeccionar cambion en el proyecto
    });
}

// variables  globales 
// cvariable global para ventana 
let mainWindow;



// arreglo para menu cada objeto es un menu
const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Configurar Coeficientes',  
                accelerator: 'Ctrl+H', // crear atajo
            click() {
                createNewConfiguracionWindow();
                // crear una ventana 
            } //pasar un metodo 
            },
            {
                label: 'Configurar Especies',  
                accelerator: 'Ctrl+E', // crear atajo
            click() {
                createNewConfiguracionEspeciesWindow();
                // crear una ventana 
            } //pasar un metodo 
            },
            {
                label: 'Acción Manual',  
                accelerator: 'Ctrl+M', // crear atajo
            click() {
                createNewAccionManualWindow();
                // crear una ventana 
            } //pasar un metodo 
            },
        {
            label: 'Salir',
            accelerator: process.platform == 'darwin'? 'command+Q':'Ctrl+Q', // validacion de que plataforma tengo
            click(){
                app.quit();
            }
        }]
    }
];


// validando produccion sacar consola 
if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'Herramientas de desarrollo',
        submenu: [
            {
                label: 'Mostrar/Herramientas de desarrollo',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

// ventana principal
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {// para poder utilizar nodeJS en cada ventana
			// allow code inside this window to use use native window.open()
			nativeWindowOpen: true,
            nodeIntegration: true,
		},
    });
    // 
    
    // mostrar index.html
    // 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'), //concatenar
        protocol: 'file', //protoco de carga
        slashes: true
    }))
    
    // navegacion 
    // mennu a partir de un arreglo
    const menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    mainWindow.on('closed', ()=> { // escuchar que se cierre toda la apliacion
        app.quit();
    });

});



 /// 
 
 // crear ventana de porcentajes
function createNewPorcentajesWindow() {
    //const BrowserWindow = remote.BrowserWindow;
    const newPorcentajesWindow = new BrowserWindow({
         width: 800,//800
         height: 600,
         title: 'Orquideas',
         webPreferences: { // para poder utilizar nodeJS en cada ventana
             // allow code inside this window to use use native window.open()
             nativeWindowOpen: true,
             nodeIntegration: true,
         },
     });
     // desactivar el menu principal en la nueva ventana 
     // ojo comentar en desarrollo y en produccion poner 
     // newPorcentajesWindow.setMenu(null);
     newPorcentajesWindow.loadURL(url.format({
         pathname: path.join(__dirname,'views/ingresarPorcentajes.html'), //concatenar
         protocol: 'file', //protoco de carga
         slashes: true
     }));
 
     //cerrar o limpiar ventana 
     newPorcentajesWindow.on('closed', ()=> { // escuchar que se cierre toda la apliacion
        newOrquideasWindow = null;
     });
 }



 
 // crear ventana de configuracion
function createNewConfiguracionWindow() {
    //const BrowserWindow = remote.BrowserWindow;
    var newConfiguracionWindow = new BrowserWindow({
         width: 800,//800
         height: 600,
         title: 'Configuracion',
         webPreferences: { // para poder utilizar nodeJS en cada ventana
             // allow code inside this window to use use native window.open()
             nativeWindowOpen: true,
             nodeIntegration: true,
         },
     });
     // desactivar el menu principal en la nueva ventana 
     // ojo comentar en desarrollo y en produccion poner 
     // newConfiguracionWindow.setMenu(null);
     newConfiguracionWindow.loadURL(url.format({
         pathname: path.join(__dirname,'views/ingresarConfiguracion.html'), //concatenar
         protocol: 'file', //protoco de carga
         slashes: true
     }));
 
     //cerrar o limpiar ventana 
     newConfiguracionWindow.on('closed', ()=> { // escuchar que se cierre toda la apliacion
        newConfiguracionWindow = null;
     });
 }

 // crear ventana de configuracion de especies
 function createNewConfiguracionEspeciesWindow() {
    //const BrowserWindow = remote.BrowserWindow;
    var newConfiguracionEspecies = new BrowserWindow({
         width: 800,//800
         height: 600,
         title: 'Configuracion',
         webPreferences: { // para poder utilizar nodeJS en cada ventana
             // allow code inside this window to use use native window.open()
             nativeWindowOpen: true,
             nodeIntegration: true,
         },
     });
     // desactivar el menu principal en la nueva ventana 
     // ojo comentar en desarrollo y en produccion poner 
     // newConfiguracionEspecies.setMenu(null);
     newConfiguracionEspecies.loadURL(url.format({
         pathname: path.join(__dirname,'views/ingresarEspecies.html'), //concatenar
         protocol: 'file', //protoco de carga
         slashes: true
     }));
 
     //cerrar o limpiar ventana 
     newConfiguracionEspecies.on('closed', ()=> { // escuchar que se cierre toda la apliacion
        newConfiguracionEspecies = null;
     });
 }


// ventana para accionar manualmente bombas 
function createNewAccionManualWindow() {
    //const BrowserWindow = remote.BrowserWindow;
    var newWindowAccionManual = new BrowserWindow({
         width: 800,//800
         height: 600,
         title: 'Acción Manual',
         webPreferences: { // para poder utilizar nodeJS en cada ventana
             // allow code inside this window to use use native window.open()
             nativeWindowOpen: true,
             nodeIntegration: true,
         },
     });
     // desactivar el menu principal en la nueva ventana 
     // ojo comentar en desarrollo y en produccion poner 
     // newWindowAccionManual.setMenu(null);
     newWindowAccionManual.loadURL(url.format({
         pathname: path.join(__dirname,'views/accionarManual.html'), //concatenar
         protocol: 'file', //protoco de carga
         slashes: true
     }));
 
     //cerrar o limpiar ventana 
     newWindowAccionManual.on('closed', ()=> { // escuchar que se cierre toda la apliacion
        newWindowAccionManual = null;
     });
 }