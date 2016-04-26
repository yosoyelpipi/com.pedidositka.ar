/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
    var i_log = 0;
	var total = 0;
    var existe_db;
	var db;
	var exite;
	var fua_cli;
	var fua_precios;
	
	var menuOpen = true;
    var menuDiv = "";
	menuDiv = document.querySelector("#menu"); 
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');	
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		*/
        console.log('Received Event: ' + id);
		//alert('Comencé');

		//window.localStorage.setItem("existe_db", 0);
		onDeviceReadyNow();
    }
};

app.initialize();


	
function mkLog(text){
	var date = new Date();
	var txt = i_log + " - " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ": " + text; 
	i_log++;
	console.log(txt);
	//$("#log").append(txt + '<br>');
}


function onDeviceReadyNow(){
	//window.notification.navigator.notification.alert('Arranco la App');
    mkLog("Ejecute el onDeviceReady--->");
	window.localStorage.setItem("total", total);
	
	existe_db = window.localStorage.getItem("existe_db");	
	//existe_db = null;
	db = window.openDatabase("ERPITRIS", "1.0", "Pedidos Offline", 200000);
	
	if(existe_db == null){
	    mkLog("la BD es null");
		creaDB();
	}else{
		mkLog("la BD está definida");
		cargaDatos();
	}
	//Habilita la función del botón atrás.
	document.addEventListener("backbutton", onBackKeyDown, false);	
	//Habilita la función del botón menú.
	document.addEventListener("menubutton", onMenuKeyDown, false);	
	//Depuro los pedidos para migrar
	depuraIniDatos();
}//Fin OnReadyDevice

	$(document).ready(function(){

				var WebService = window.localStorage.getItem("ws");
					var BaseDeDatos = window.localStorage.getItem("bd");
					var Usuario = window.localStorage.getItem("user");
					var Clave = window.localStorage.getItem("password");
					fua_cli = window.localStorage.getItem("fua_cli");
					
					$("#conexion").click(function(){
						var url = 'http://iserver.itris.com.ar:3000/ITSWS/ItsCliSvrWS.asmx?WSDL';
						var url = window.localStorage.getItem("ws");
						$("#estado").show();
						$.getJSON("http://leocondori.com.ar/app/local/testws.php", {ws: url, precio: 20}, resultConn, "json");
						})
					$("#testlogin").click(function(){
					$("#estado").show();		
						$.getJSON("http://leocondori.com.ar/app/local/itslogin.php", {ws: WebService, base: BaseDeDatos, usuario: Usuario, pass: Clave}, ItsLogin, "json");
					})

		//Sincronizo clientes:			
					$("#clientesDown").click(function(){
						console.log('Entramos al ClientDowload');
					$("#estadodown").show();
					$("#estadodown").html('<div class="progress">' +
										  '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> ' +
										  '<span class="sr-only">100% Complete</span>' +
										  '</div>' +
										  '</div>');
					//Para la pimera ejecución, entonces controlo si está declarada o no.
					fua_cli = window.localStorage.getItem("fua_cli");
					if(!fua_cli){
						var fec_ult_act_cli = '';
					}else{
						var fec_ult_act_cli = fua_cli;
					}
						$.getJSON("http://leocondori.com.ar/app/local/downloadclient.php", {ws: WebService, base: BaseDeDatos, usuario: Usuario, pass: Clave, fua_cliente: fec_ult_act_cli}, ItsDownloadClient, "json");
					});
		//FIN: Sincronizo clientes

		//Sincronizo lista de precios:
					$("#LisPre").click(function(){
					$("#estadodown").show();
					$("#estadodown").html('<div class="progress">' +
							  '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> ' +
							  '<span class="sr-only">100% Complete</span>' +
							  '</div>' +
							  '</div>');
					//Para la pimera ejecución, entonces controlo si está declarada o no.
					fua_precios = window.localStorage.getItem("fua_precios");
					if(!fua_precios){
						var fec_ult_act_pre = '';
					}else{
						var fec_ult_act_pre = fua_precios;
					}
						$.getJSON("http://leocondori.com.ar/app/local/erp_pre_ven.php", {ws: WebService, base: BaseDeDatos, usuario: Usuario, pass: Clave, fua_pre: fec_ult_act_pre}, ItsErpPreVen, "json");
					});
		//FIN: Sincronizar listas de precios.

		//Fin del script.			
				});
				


		

		function errorCB(err){
			console.log("Error procesando SQL:" + err.code);
			//navigator.notification.alert("Error procesando SQL:" + err.code);
			//alert("Error procesando SQL:" + err.code + '-' + err.message);
			navigator.notification.alert("Error procesando SQL:" + err.code + '-' + err.message, alertDismissed, 'Pedidos Mobile', 'Listo');
		}

		function errorCBart(err){
			console.log("Error al procesar el SQL: " + err.code);
			//navigator.notification.alert("Error procesando SQL:" + err.code);
			//alert("Error procesando SQL:" + err.code + '-' + err.message);
			navigator.notification.alert("Error procesando SQL:" + err.code + '-' + err.message, alertDismissed, 'Pedidos Mobile', 'Listo');
		}		
		
		function successCB(){
			mkLog("Dato insertado");
			//navigator.notification.alert("Insertamos todos los datos con éxito");
		}

		function successCBs(total, count){
		var total;
		var count;
		calculaPorcentaje(total, count); 
		}

		//********************INICIO DE FUNCIONES *************************		
		//FUCIONES			
				function resultConn(respuesta){
					if (respuesta.valor == 1){
						$("#estado").hide();				   
						navigator.notification.alert('Conexión creada con éxito', alertDismissed, 'Pedidos Mobile', 'Listo');
					}else{
						$("#estado").hide();
						navigator.notification.alert('No se pudo realizar una conexión con el servicio web solicitado', alertDismissed, 'Pedidos Mobile', 'Listo');
					}
				}
				
				function ItsLogin(Response){
					if (Response.ItsLoginResult == 1){
						$("#estado").hide();				   
						//alert('Error : ' + Response.motivo);
						navigator.notification.alert('Error : ' + Response.motivo, alertDismissed, 'Pedidos Mobile', 'Listo');
					}else{
						$("#estado").hide();
						//alert('Login realizado con éxito: ' + Response.session);
						navigator.notification.alert('Login realizado con éxito: ' + Response.session, alertDismissed, 'Pedidos Mobile', 'Listo');
					}
				}

				function ItsDownloadClient(Response){
					if (Response.ItsLoginResult == 1){
						$("#estadodown").html('');
						navigator.notification.alert('Error : ' + Response.motivo, alertDismissed, 'Pedidos Mobile', 'Listo');
					}else{
							$("#estadodown").html('');
							
							$("#instala").show();
							
							if(Response.Cantidad != 0){
							//var dbeee = openDatabase("ERPITRIS", "1.0", "Pedidos Offline", 200000);
							db.transaction(crearEmpresa, errorCB, successCB);
		function crearEmpresa(tx){													
								for(var x=0; x<Response.Data.length; x++) {
										  console.log("INSERT INTO erp_empresas (id, descripcion, te, num_doc) VALUES ('"+Response.Data[x]["ID"]+"', '"+Response.Data[x]["DESCRIPCION"]+"', '"+Response.Data[x]["TE"]+"', '"+Response.Data[x]["NUM_DOC"]+"' ) ");
										tx.executeSql("INSERT INTO erp_empresas (id, descripcion, te, saldo, num_doc) VALUES ('"+Response.Data[x]["ID"]+"', '"+Response.Data[x]["DESCRIPCION"]+"', '"+Response.Data[x]["TE"]+"', '"+Response.Data[x]["SALDO"]+"', '"+Response.Data[x]["NUM_DOC"]+"') ");
										//tx.executeSql("INSERT INTO erp_empresas (id, descripcion, te, num_doc) VALUES ('"+Response.Data[x]["ID"]+"', '"+Response.Data[x]["DESCRIPCION"]+"', '"+Response.Data[x]["TE"]+"', '"+Response.Data[x]["NUM_DOC"]+"') ");
									}
								}
								
								$("#instala").html('<span class="label label-default">¡Genial! se han sincronizado ' + Response.Data.length + ' registros.</span><br>');
								window.localStorage.setItem("fua_cli", Response.ItsGetDate);
								$("#instala").append('<span class="label label-success">Fecha de última actualización: ' + Response.ItsGetDate + '</span>');
								console.log('Fecha de última actualización:' + Response.ItsGetDate);						
								//$("#instala").fadeOut(10000);						
							}else{
					if( confirm("No hay empresas nuevas para centralizar desde la última vez que se sincronizó, la fecha y hora es " + fua_cli + ". De todas maneras ¿Desea forzar la centralización? se perderán todas las empresas guardadas.") )
					{
					//Borro los datos de la tabla.
					//var db = openDatabase("ERPITRIS", "1.0", "Pedidos Offline", 200000);
					db.transaction(function(tx) {
					tx.executeSql("delete from erp_empresas");
					}, errorCB, successCB);
					
					//Actualizo la fecha de última actualización.
					  window.localStorage.setItem("fua_cli", '');
					//Todo fue maravilloso  
					  //alert('¡Excelente! ahora volvé a centralizar las empresas.');
					  navigator.notification.alert('¡Excelente! ahora volvé a centralizar las empresas.', alertDismissed, 'Pedidos Mobile', 'Listo');
						//location.reload();			  
					}
							
								//$("#instala").html('<span class="label label-info">Tenés el maestro de empresas actualizado</span><br>');
								$("#instala").fadeOut(9000);
							}
					}
				}

				function ItsErpPreVen(Response){
					if (Response.ItsLoginResult == 1){
						$("#estadodown").hide();				   
						//alert('Error : ' + Response.motivo);
						navigator.notification.alert('Error : ' + Response.motivo, alertDismissed, 'Pedidos Mobile', 'Listo');
					}else{
							$("#estadodown").hide();
							$("#instala").show();
		if(Response.Cantidad != 0){
							//var db = openDatabase("ERPITRIS", "1.0", "Pedidos Offline", 200000);
							db.transaction(crearPrecios, errorCB, successCBs);
		function crearPrecios(tx){
								$("#progressbars").html('');
								for(x=0; x<Response.Data.length; x++){
										//console.log('Esto es el ID: '+ Response.Data[x]["ID"]);
										//console.log('Esto es el ARTICULOS: '+ Response.Data[x]["FK_ERP_ARTICULOS"]);
										//console.log('Esto es la DESCRIPCIÓN: '+ Response.Data[x]["DES_ART"]);
										//console.log('Esto es el PRECIO: '+ Response.Data[x]["PRECIO"]);								
										tx.executeSql("INSERT INTO erp_pre_ven (id, fk_erp_articulos, des_art, precio) VALUES ('"+Response.Data[x]["ID"]+"', '"+Response.Data[x]["FK_ERP_ARTICULOS"]+"', '"+Response.Data[x]["DES_ART"]+"', "+Response.Data[x]["PRECIO"]+") ");
										//calculaPorcentaje(Response.Data.length, x);			
									}
								}


							$("#instala").html('<span class="label label-default">¡Genial! se han sincronizado ' + Response.Data.length + ' registros.</span><br>');
							window.localStorage.setItem("fua_precios", Response.ItsGetDate);
							$("#instala").append('<span class="label label-success">Fecha de última actualización: ' + Response.ItsGetDate + '</span>');
							console.log('Fecha de última actualización:' + Response.ItsGetDate);

		}else{
					if(confirm("No hay precios nuevos o actualizados para centralizar desde la última vez que se sincronizó, la fecha y hora es " + fua_cli + ". De todas maneras ¿Desea forzar la centralización? se perderán todos los precios guardadas.") ){
					//var db = openDatabase("ERPITRIS", "1.0", "Pedidos Offline", 200000);
					db.transaction(function(tx) {
					tx.executeSql("delete from erp_pre_ven");
					}, errorCB, successCB);
					
					//Actualizo la fecha de última actualización.
					  window.localStorage.setItem("fua_precios", '');
					//Todo fue maravilloso  
					navigator.notification.alert('¡Excelente! ahora volvé a centralizar los precios.');  
					//location.reload();			  
					}					
					$("#instala").html('<span class="label label-info">Tenés la lista de precios actualizada.</span><br>');
					$("#instala").fadeOut(9000);
							}
					}
				}


function ShowParam(){
	$("#menuPrincial").hide();
	$("#bajada").html('Podrás configurar la conexión al WebService.').show();	
	Vermenu();
}

function ShowMenu(){
	$("#config").hide();
	$("#bajada").hide();
	$("#configurado").hide();
	$("#menuPrincial").show();
}
/*
function ShowDownload(){
					$("#menuPrincial").hide();
					$("#bajada").html('Panel de sincronización.').show();
					$("#download").show();	
	}
*/

function ShowDownload(){	
	var networkState = navigator.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'No podemos determinar tu tipo de conexión a una red de datos.';
	states[Connection.ETHERNET] = 'Estás conectado a la red mediante Ethernet connection, estamos listo para sincronizar los datos.';
	states[Connection.WIFI]     = 'Estás conectado a la red mediante WiFi, estamos listo para sincronizar los datos.';
	states[Connection.CELL_2G]  = 'Estás conectado a la red mediante Cell 2G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_3G]  = 'Estás conectado a la red mediante Cell 3G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_4G]  = 'Estás conectado a la red mediante Cell 4G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL]     = 'Estás conectado a la red mediante Cell generic connection, podrías experimentar lentitud en la sincronización.';
	states[Connection.NONE]     = '¡Atención! tu dispositivo no tiene conexion a datos, no podrás sincronizar, sin embargo podrás seguir trabajando de manera offline.';
	
		if(navigator.network.connection.type == Connection.WIFI){
			//No tenemos conexión
			console.log(states[networkState]);
			var existe = window.localStorage.getItem("ws");
			if(!existe){
					navigator.notification.alert('Si bien detectamos que tu dispositivo tiene Wi-Fi, parece que aún no definiste los parámetros de conexión. Andá a la sección configuración y volvé por aquí.');
			}else{
					$("#menuPrincial").hide();
					$("#bajada").html('Panel de sincronización.').show();
					$("#download").show();
			}
		}else{
			// Si tenemos conexión
			//navigator.notification.alert(states[networkState]);
			navigator.notification.alert('Detectamos que no estás conectado a ninguna red Wi-Fi, conectate a alguna red disponible y volvé por acá');
		}	
	}

function ShowSync(){	
	var networkState = navigator.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'No podemos determinar tu tipo de conexión a una red de datos.';
	states[Connection.ETHERNET] = 'Estás conectado a la red mediante Ethernet connection, estamos listo para sincronizar los datos.';
	states[Connection.WIFI]     = 'Estás conectado a la red mediante WiFi, estamos listo para sincronizar los datos.';
	states[Connection.CELL_2G]  = 'Estás conectado a la red mediante Cell 2G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_3G]  = 'Estás conectado a la red mediante Cell 3G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL_4G]  = 'Estás conectado a la red mediante Cell 4G connection, estamos listo para sincronizar los datos.';
	states[Connection.CELL]     = 'Estás conectado a la red mediante Cell generic connection, podrías experimentar lentitud en la sincronización.';
	states[Connection.NONE]     = '¡Atención! tu dispositivo no tiene conexion a datos, no podrás sincronizar, sin embargo podrás seguir trabajando de manera offline.';
	
		if(navigator.network.connection.type == Connection.WIFI){
			//No tenemos conexión
			//navigator.notification.alert(states[networkState]);
			var existe = window.localStorage.getItem("ws");
			if(!existe){
					navigator.notification.alert('Si bien detectamos que tu dispositivo tiene Wi-Fi, parece que aún no definiste los parámetros de conexión. Andá a la sección configuración y volvé por aquí.');
			}else{
					$("#menuPrincial").hide();
					$("#bajada").html('Panel de sincronización.').show();
					$("#sync").show();
			}
		}else{
			// Si tenemos conexión
			//navigator.notification.alert(states[networkState]);
			navigator.notification.alert('Detectamos que no estás conectado a ninguna red Wi-Fi, conectate a alguna red disponible y volvé por acá');
		}	
	}

/*
function ShowSync(){
					$("#menuPrincial").hide();
					$("#bajada").html('Panel de sincronización.').show();
					$("#sync").show();
					
			}
*/			
function ShowOrder(){
		var existe = window.localStorage.getItem("ws");
		if(!existe){
			console.log('No está definido el WS entonces no puedo mostrar la carga de pedido.');
			navigator.notification.alert('No tenés definido los parámetros de conexión. Definí uno y volvé por acá.', alertDismissed, 'Pedidos Mobile', 'Listo');
		}else{
			$("#menuPrincial").hide();
			$("#bajada").html('Pedidos de ventas.').show();
			$("#order").show();
			
		}
}

function HideDownload(){
	$("#download").hide();
	$("#menuPrincial").show();
	}	

function HideOrder(){
	$("#order").hide();
	$("#menuPrincial").show();
	}

function HideSync(){
	$("#sync").hide();
	$("#menuPrincial").show();
	}	
	
function Vermenu(){
		var wsS = window.localStorage.getItem("ws");
		var bdS = window.localStorage.getItem("bd");
		var userS = window.localStorage.getItem("user");
		var passwordS = window.localStorage.getItem("password");
		//navigator.notification.alert(wsS);
	if(!wsS){
		mkLog("No de definió WS");
		mkLog(wsS);
		//navigator.notification.alert('Es distinto de null');
		$("#config").show();
		
		$("#wsconfig").html('<label for="ws"><small>Web Service</small></label>' +
							'<input type="text" class="form-control" id="ws" name="ws" value="http://Servidor/ITSWS/ItsCliSvrWS.asmx?WSDL">');
		$("#bdconfig").html('<label for="bd"><small>Base de datos</small></label>' +
							'<input type="text" class="form-control" id="bd" name="bd" placeholder="Ej. DEMO">');
		$("#userconfig").html('<label for="user"><small>Usuario</small></label>'+
							  '<input type="text" class="form-control" id="user" name="user" placeholder="USER">');
		$("#passconfig").html('<label for="pass"><small>Password</small></label>' +
							  '<input type="password" class="form-control" id="pass" name="pass" placeholder="PASS">');
	}else{
		mkLog("Ya se definió el WS");
		$("#wsconfig").html('<label for="ws"><small>Web Service</small></label>' +
							'<input type="text" class="form-control" id="ws" name="ws" value="'+ wsS +'">');
		$("#bdconfig").html('<label for="bd"><small>Base de datos</small></label>' +
							'<input type="text" class="form-control" id="bd" name="bd" value="'+ bdS +'">');
		$("#userconfig").html('<label for="user"><small>Usuario</small></label>'+
							  '<input type="text" class="form-control" id="user" name="user" value="'+ userS +'">');
		$("#passconfig").html('<label for="pass"><small>Password</small></label>' +
							  '<input type="password" class="form-control" id="pass" name="pass" value="'+ passwordS +'">');
		$("#configurado").show();
		$("#testeer").show();		
	}
//	navigator.notification.alert(window.localStorage.getItem("ws"));	
	
}

// Función activada. Botón Menú.
function onMenuKeyDown() {
	//navigator.notification.alert('No hay opciones de menu disponible por el momento');
    show_hidden('menufooter');
    }

function onBackKeyDown() {
            if( confirm("Realmente desea salir de la aplicación? Para navegar por esta app utilice los enlaces internos.") )
            {
                  navigator.app.exitApp();
            }
		}
		
function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'No podemos determinar tu tipo de conexión a una red de datos.';
            states[Connection.ETHERNET] = 'Estás conectado a la red mediante Ethernet connection, estamos listo para sincronizar los datos.';
            states[Connection.WIFI]     = 'Estás conectado a la red mediante WiFi, estamos listo para sincronizar los datos.';
            states[Connection.CELL_2G]  = 'Estás conectado a la red mediante Cell 2G connection, estamos listo para sincronizar los datos.';
            states[Connection.CELL_3G]  = 'Estás conectado a la red mediante Cell 3G connection, estamos listo para sincronizar los datos.';
            states[Connection.CELL_4G]  = 'Estás conectado a la red mediante Cell 4G connection, estamos listo para sincronizar los datos.';
            states[Connection.CELL]     = 'Estás conectado a la red mediante Cell generic connection, podrías experimentar lentitud en la sincronización.';
            states[Connection.NONE]     = '¡Atención! tu dispositivo no tiene conexion a datos, no podrás sincronizar, sin embargo podrás seguir trabajando de manera offline.';
			
			if(navigator.network.connection.type == Connection.NONE){
				// No tenemos conexión
				navigator.notification.alert(states[networkState], alertDismissed, 'Pedidos Mobile', 'Listo');
			}else{
				// Si tenemos conexión
				navigator.notification.alert(states[networkState], alertDismissed, 'Pedidos Mobile', 'Listo');
			}
			
            //navigator.notification.alert(states[networkState]);
        }
		
/*
*Creación de base de datos
*/
function creaDB(){
	db.transaction(creaNuevaDB, errorDB, crearSuccess);
	}

function creaNuevaDB(tx){
	mkLog("Creando base de datos.");
	
	tx.executeSql('DROP TABLE IF EXISTS erp_paises');
	//Creo la empresa ERP_PAISES
	var sql = "CREATE TABLE IF NOT EXISTS erp_paises ( " +
	          "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			  "descripcion VARCHAR(50)," +
			  "sigla VARCHAR(5) )";			  
	tx.executeSql(sql);
	
	//Creo la tabla ERP_EMPRESAS
	//tx.executeSql('delete from erp_empresas');
	tx.executeSql('DROP TABLE IF EXISTS erp_empresas');
	var empresas = "CREATE TABLE IF NOT EXISTS erp_empresas ( " +
		  		   "id VARCHAR(50) PRIMARY KEY, " +
		    	   "descripcion VARCHAR(100)," +
				   "te VARCHAR(30)," +
				   "saldo VARCHAR(15)," +
		           "num_doc VARCHAR(13) )";			   
	tx.executeSql(empresas);
	console.log('Creé la tabla ERP_EMPRESAS');
	
	//Creo la tabla PRECIOS DE VENTAS.
	tx.executeSql('DROP TABLE IF EXISTS erp_pre_ven');
	var precios = "CREATE TABLE IF NOT EXISTS erp_pre_ven ( " +
		  		   "id VARCHAR(50) PRIMARY KEY, " +
		    	   "fk_erp_articulos VARCHAR(50)," +
		    	   "des_art VARCHAR(40)," +				   
		           "precio NUMERIC(10,4) )";
	tx.executeSql(precios);
	console.log('Creé la tabla erp_pre_ven');

	//Creo la tabla PEDIDOS DE VENTAS.
	tx.executeSql('DROP TABLE IF EXISTS erp_mig_ped');
	var erp_mig_ped = "CREATE TABLE IF NOT EXISTS erp_mig_ped ( " +
						"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
						"numero NUMERIC(12), " +
						"fk_erp_empresas VARCHAR(15)," +
						"fk_erp_articulos VARCHAR(15), " +
						"cantidad NUMERIC(12), " +
						"estado varchar(1), " +				   
						"precio NUMERIC(10,4) )";
	tx.executeSql(erp_mig_ped);
	console.log('Creé la tabla erp_mig_ped');
	
	//Marco a la aplicación para que sepa que la base de datos ya está creada.
	window.localStorage.setItem("existe_db", 1);
}

function crearSuccess(){
	console.log('La base y tablas se crearon con éxito.');
	//cargaDatos();	
}

function errorDB(err){
	mkLog("Error procesando SQL:" + err.message);
	navigator.notification.alert("Error procesando SQL:" + err.message, alertDismissed, 'Pedidos Mobile', 'Listo');
}

/*
*Cargar desde la base de datos
*/
function cargaDatos(){
	db.transaction(cargaRegistros, errorDB);
}

function cargaRegistros(tx){
	mkLog("Cargando registros de la base de datos.");
	tx.executeSql('select * from erp_paises', [], cargaDatosSuccess, errorDB);
}

function cargaDatosSuccess(tx, results){
	mkLog("Recibidos de la base de datos" + results.rows.length + " registros");
	if(results.rows.length == 0){
		mkLog("La tabla países está vacía.");
		//navigator.notification.alert("La tabla países está vacía.");
	}
	
	for(var i=0; i<results.rows.length; i++){
		var paises = results.rows.item(i);
		var selector = $('#muestroresultado');
		selector.append('<tr>' +
							'<th scope="row">' + paises.id + '</th>' +
							'<td>' + paises.descripcion + '</td>' +
							'<td>' + paises.sigla + '</td>' +
						'</tr>');
	}
}


function cargaEmpresas(){
	db.transaction(cargaCliente, errorDB);
}

function cargaCliente(tx){
	console.log("Cargando registros de la base de datos.");
	tx.executeSql('select * from erp_empresas', [], cargaClienteSuccess, errorDB);
}

function cargaClienteSuccess(tx, results){
	console.log("Recibidos de la base de datos" + results.rows.length + " registros");
	if(results.rows.length == 0){
		console.log("La tabla está vacía.");
		navigator.notification.alert("La tabla está vacía.", alertDismissed, 'Pedidos Mobile', 'Listo');
	}else{		
			var Datos = [];
			var selector = $('#aca');
			for(var i=0; i<results.rows.length; i++){
				var empresas = results.rows.item(i);
				Datos[i] = empresas.descripcion;
				//console.log('Esto es la descripcion: '+empresas.descripcion);
				//console.log('Esto es el areeglo: ' + Datos[i]);
				
				/*
				selector.append('<tr>' +
									'<th scope="row">' + empresas.id + '</th>' +
									'<td>' + empresas.descripcion + '</td>' +
								'</tr>');
				*/
				
			}
			
			//navigator.notification.alert(Datos);
			
$(function() {
    $( "#tags" ).autocomplete({
      source: Datos
    });
  });			
	}	
}



function cargaArticulos(){
	db.transaction(cargaArt, errorDB);
}

function cargaArt(tx){
	console.log("Cargando pedidos de la base de datos.");
	tx.executeSql('select * from erp_pre_ven', [], cargaArtSuccess, errorDB);
}

function cargaArtSuccess(tx, results){
	console.log("Recibidos de la base de datos" + results.rows.length + " registros");
	if(results.rows.length == 0){
		console.log("La tabla precios de ventas está vacía.");
		navigator.notification.alert("Para poder usar esta app te informamos que la debés tener sincronizada la lista de precios.", alertDismissed, 'Pedidos Mobile', 'Listo');
	}else{		
			/*var id = [];
			var Art = [];
			var Desc = [];
			var precios = [];
			var registro = [];
			
			var selector = $('#aca');
		    var a;*/
			
			//Oculto los articulos, pero los cargo.
			$("#erpdetarticulos").hide();
			
			for(var i=0; i<results.rows.length; i++){
			var art = results.rows.item(i);
				//id[i] = art.id;
				//Art[i] = art.fk_erp_articulos;
				//Desc[i] = art.des_art;
				//precios[i] = art.precio;
				//$("#opciones").append('<option value="'+ art.fk_erp_articulos +'">' + art.des_art + ' | $' + art.precio +'</option>');
				
				/*$("#erp_articulos").append('<tr>' +
											'<th scope="row"><button class="btn btn-default" onclick="clickMe(\' '+ art.fk_erp_articulos + '\', '+ art.precio +', \' '+ art.des_art + '\' )"; type="button"> ' + 
											'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button> '+ art.fk_erp_articulos + '</th>' +
											'<td>'+ art.des_art +'</td>' +
											'<td>'+ art.precio +'</td>' +
											'</tr>');*/
											
				$("#erpdetarticulos").append('<a href="#" class="list-group-item">' +
											 '<span class="glyphicon glyphicon-tag" aria-hidden="true"></span> ' +
											 ' '+ art.fk_erp_articulos + ' - '+ art.des_art +' <span class="badge">$ '+ art.precio +'</span>' +
											 '</a>');							
			}
			
			$(function(){
				//$("#erpart").autocomplete({source: desc});
				// $("#search_term").autocomplete("option", "source", "search_comments.php");
				//$("#erpart").autocomplete( "option", source: Desc );
			  });
	}	
}
/*
	*Guardando datos en local storage
*/

function submitForm(){
	var _webs = $("[name='ws']").val();
	var _base = $("[name='bd']").val();
	var _users = $("[name='user']").val();
	var _pass = $("[name='pass']").val();
	
	var ws = window.localStorage.setItem("ws", _webs);
	var bd = window.localStorage.setItem("bd", _base);
	var user = window.localStorage.setItem("user", _users);
	var password = window.localStorage.setItem("password", _pass);
	navigator.notification.alert('Los datos se han guardado correctamente.', alertDismissed, 'Pedidos Mobile', 'Listo');
	
	$("#config").hide();
    location.reload();
	return false;
}

function Cleaner(){
	
	if( confirm("Realmente deseas borrar los datos de conexión al WebService? Tené en cuenta que no vas a poder cargar o generar pedidos ni sincronizar datos.") )
            {
			var ws = window.localStorage.setItem("ws", "");
			var bd = window.localStorage.setItem("bd", "");
			var user = window.localStorage.setItem("user", "");
			var password = window.localStorage.setItem("password", "");
			$("#configurado").hide();
			$("#testeer").hide();
			$("#config").show();
			mkLog('Borraste los datos de conexión');
			navigator.notification.alert('Borraste los datos de conexión', alertDismissed, 'Pedidos Mobile', 'Listo');
			location.reload();
			}
}

function datosConexion(){
	navigator.notification.alert('Este es el WebService: ' + window.localStorage.getItem("ws"), alertDismissed, 'Pedidos Mobile', 'Listo');
	navigator.notification.alert('Esta es base de datos: ' + window.localStorage.getItem("bd"), alertDismissed, 'Pedidos Mobile', 'Listo');
	navigator.notification.alert('Este es el Usuario: ' + window.localStorage.getItem("user"), alertDismissed, 'Pedidos Mobile', 'Listo');
	navigator.notification.alert('Este es el Password: ' + window.localStorage.getItem("password"), alertDismissed, 'Pedidos Mobile', 'Listo');

	//$('#output').html("Ws: " + window.localStorage.getItem("ws") + "<br>" +
	//					"BD: " + window.localStorage.getItem("bd") + "<br>" +
	//					"USer: " + window.localStorage.getItem("user") + "<br>" +
	//					"Pass: " + window.localStorage.getItem("password") + "<br>");
}


/*
BUSCAR ARTICULOS
*/

function searchArticulos(){
	db.transaction(searchArt, errorDB);
}
function searchArt(tx){
	var search = $("#searchart").val();
	
	if(!search){
		navigator.notification.alert('Tenés que ingresar un artículo para iniciar la búsqueda', alertDismissed, 'Pedidos Mobile', 'Listo');
		return;
	}
	
	console.log("Cargando pedidos::: "+search+" :::de la base de datos.");
	tx.executeSql('select * from erp_pre_ven where fk_erp_articulos like(\'%'+ search +'%\') or des_art like(\'%'+ search +'%\') ', [], searchArtSuccess, errorDB);
}
function searchArtSuccess(tx, results){
	if(results.rows.length == 0){
		var searchFail = $("#searchart").val();
		console.log("No hay resultados para la busqueda (" + searchFail + ")seleccionada.");
		navigator.notification.alert("No hay resultados para la busqueda (" + searchFail + ") seleccionada.", alertDismissed, 'Pedidos Mobile', 'Listo');
	}else{
	console.log('Oculto todos los resultos sin limpiar datos. Para no volver a cargarlos.');
	
	$("#erpdetarticulossearch").html('');
	$("#erpdetarticulossearch").show();
	console.log('Limpie los resultados anteriores y vuelvo a mostrar los resultados.');
	
		for(var z=0; z<results.rows.length; z++){
				var artresult = results.rows.item(z);
				//Muestro la sección del buscador.
				$("#google").show();
				//Limpio la sección de resultados del buscador.
				$("#erpdetarticulossearch").show();
				//Grabo en la consola el estado de los resultados.
				console.log('Encontre esto: ' + artresult.fk_erp_articulos);
				
				//Imprimo los resultados encontrados.
				$("#erpdetarticulossearch").append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><button type="button" onclick="clickMeArtNonCant(\' '+ artresult.fk_erp_articulos + ' \', \' '+ artresult.des_art +' \', \' '+ artresult.precio + '\' )";  class="list-group-item" >'+ artresult.fk_erp_articulos +' - '+ artresult.des_art +' <span class="badge">$ '+ artresult.precio +'</span></button>');
			}
	}	
}

//Función que limpia el buscador de artículo
function CleanerSearch(){
	//Oculto la sección.
	$("#google").hide();
	//Limpio los resultados.
	$("#erpdetarticulossearch").html('');
}



/*
BUSCAR EMPRESAS
*/

function searchEmpresas(){
	console.log('Ejecute la funcion searchEmpresas()');
	db.transaction(searchEmp, errorDB);
}
function searchEmp(tx){
	var searchEmpresa = $("#searchclient").val();
	console.log('Ejecute la funcion searchEmp()');
	
	if(!searchEmpresa){
		navigator.notification.alert('Tenés que ingresar un valor para iniciar la búsqueda de empresas', alertDismissed, 'Pedidos Mobile', 'Listo');
		return;
	}
	console.log('Estoy acá porque el tipo ingreso un valor');
	console.log("Cargando clientes ::: "+searchEmpresa+" :::de la base de datos.");
	tx.executeSql('select * from erp_empresas where id like(\'%'+ searchEmpresa +'%\') or descripcion like(\'%'+ searchEmpresa +'%\') ', [], searchEmpSuccess, errorDB);
}
function searchEmpSuccess(tx, results){
	if(results.rows.length == 0){
		var searchFail = $("#searchclient").val();
		console.log("No hay resultados para la busqueda (" + searchFail + ")seleccionada.");
		navigator.notification.alert("No hay resultados para la busqueda (" + searchFail + ") seleccionada.", alertDismissed, 'Pedidos Mobile', 'Listo');
	}else{	
	$("#erparticulos").hide();
	console.log('Oculto todos los resultos sin limpiar datos. Para no volver a cargarlos.');
	
	$("#erpempresassearch").html('');
	$("#erpempresassearch").show();
	console.log('Limpie los resultados anteriores y vuelvo a mostrar los resultados.');
	
		for(var x=0; x<results.rows.length; x++){
				var empresult = results.rows.item(x);
				console.log('Encontre esto: ' + empresult.descripcion);
				
				//Imprimo los resultados encontrados.
				$("#erpempresassearch").append('<button type="button" onclick="clickMeEmp(\' '+ empresult.id + ' \', \' '+ empresult.descripcion +' \', \' '+ empresult.te + '\', \' '+ empresult.num_doc + ' \');" class="list-group-item"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> '+ empresult.id +' - '+ empresult.descripcion +' ['+ empresult.num_doc +'] | ['+ empresult.te +'] | ['+ empresult.saldo +']</button>');
			}
	}	
}

//Función que limpia el buscador de empresas
function CleanerSearchEmp(){
	//Oculto la sección.
	$("#googleEmp").hide();
	//Limpio los resultados.
	$("#erpempresassearch").html('');
}

function clickMeEmp(idd, description, tel, numdoc){
	var idd;
	var description;
	var tel;
	var numdoc;
	//Falta agregar los campos y navigator.notification.alertar al usuario.
	$("#em").html(idd);
	$("#rz").html(description);
	$("#doc").html(numdoc);
	$("#te").html(tel);
	
	//Le aviso al usuario que seleccionó la empresa con éxito.
	navigator.notification.alert('La empresa ' + description + ' se agregó correctamente.', alertDismissed, 'Pedidos Mobile', 'Listo');
	$("#menudisabled").hide();
	$("#menuenabled").show();
	$("#Artdisabled").hide();
	$("#Artenabled").show();	
}


function clickMeArtNonCant(erp_articulos0, descrip0, costo0){
	var erp_articulos0;
	var descrip0;
	var costo0;
	//alert(erp_articulos0);
	//alert(descrip0);
	//alert(costo0);
	
	navigator.notification.prompt(
		'Ingrese la cantidad',  // message
		onPrompt,                  // callback to invoke
		'Pedidos de ventas',            // title
		['Confirmar','Cancelar'],             // buttonLabels
		''                 // defaultText
	);

	// process the promp dialog results
	function onPrompt(results) {
		//alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
		if(results.buttonIndex==1){
			var ca = results.input1;
			//window.localStorage.setItem("cantidad", results.input1);
			//navigator.notification.alert('El artículo ' + descrip + ' se agregó correctamente.', alertDismissed, 'Pedidos Mobile', 'Listo');
			//alert('Hasta llegueee');
			clickMeArt(erp_articulos0, descrip0, ca, costo0);
		}else{
			return;
		}
	}

	var canti = window.localStorage.getItem("cantidad");

}


function clickMeArt(erp_articulos, descrip, ca, costo){
	//alert('Entre');
	var erp_articulos;
	var descrip;
	var costo;
	var ca;
	console.log(erp_articulos);
	console.log(descrip);
	console.log(costo);
	console.log(ca);
   
	$("#det_com").append('<tr>' +
							'<th id="articulosS" scope="row">'+erp_articulos+'</th>' +
							'<td>'+descrip+'</td>' +
							'<td>'+ca+'</td>' +
							'<td>$ '+costo+'</td>' +
						 '</tr>');
	
	var emPed = document.getElementById("em");
	window.localStorage.setItem("fk_erp_empresa", emPed.innerText);
	window.localStorage.setItem("fk_erp_articulos", erp_articulos);
	window.localStorage.setItem("precio", costo);
    window.localStorage.setItem("cantidad", ca);

	var acumulado = window.localStorage.getItem("total");
	console.log('Este es el valor acumulado en locastorage: ' + acumulado);
	console.log('Esta es la cantidad: ' + ca);
	console.log('Este es el costo: ' + costo);
	
	var totalrenglon = ca * costo;
	
	total = totalrenglon + total;
	console.log('Este es el total: ' + total);
	
	window.localStorage.setItem("total", total);
	
	
	$("#totalPie").html(total);
	
	navigator.notification.alert('El artículo ' + descrip + ' se agregó correctamente.', alertDismissed, 'Pedidos Mobile', 'Listo');
	
	grabaDatos();	
}
/*
Graba pedidos
*/
function grabaDatos(){
	db.transaction(grabaRegistros, errorDB);
}

function grabaRegistros(tx){
	//Recojo los datos e inserto en la tabla erp_mig_ped.
	var emPed = document.getElementById("em");
	var rzPed = document.getElementById("rz");
	var docPed = document.getElementById("doc");
	var tePed = document.getElementById("te");
	
	var artTemp = window.localStorage.getItem("fk_erp_articulos");
	var cosTemp = window.localStorage.getItem("precio");
	var cantTemp = window.localStorage.getItem("cantidad");

	
    var cabecera={empresa: emPed.innerText, raz_soc: rzPed.innerText, doc: docPed.innerText, tel: tePed.innerText, detArt: artTemp, precio: cosTemp, cantidad: cantTemp};
	
	tx.executeSql("insert into erp_mig_ped (fk_erp_empresas, fk_erp_articulos, cantidad, precio)values('"+cabecera.empresa+"','"+cabecera.detArt +"', '"+cabecera.cantidad +"', '"+cabecera.precio+"') ", [], grabarDatosSuccess, errorDB);
	mkLog("inserté linea para migrar");
}

function grabarDatosSuccess(tx, results){
	mkLog("Grabé registro con éxito.");
	//navigator.notification.alert('');
}

/*
Depuro la tabla para migrar
*/

function depuraDatos(){
	window.localStorage.removeItem("cantidad");
	db.transaction(depuraRegistros, errorDB);
}

function depuraRegistros(tx){
	tx.executeSql("delete from erp_mig_ped where estado is null ", [], depurarDatosSuccess, errorDB);
	mkLog("Depuré la tabla para migrar.");
}

function depurarDatosSuccess(tx, results){
	mkLog("Éxito al depurar.");
	location.reload();
}


//Depura al inicio de la aplicación
function depuraIniDatos(){
	db.transaction(depuraIniRegistros, errorDB);
}

function depuraIniRegistros(tx){
	tx.executeSql("delete from erp_mig_ped where estado <> 'p' ", [], depurarIniDatosSuccess, errorDB);
	mkLog("borré de la tabla erp_mig_ped los datos basura.");
}

function depurarIniDatosSuccess(tx, results){
	mkLog("Éxito al depurar con la función inicial.");
	//navigator.notification.alert('');
}


function grabarPedido(){
	db.transaction(grabarRegistros, errorDB);
}

function grabarRegistros(tx){
	var empTemp = window.localStorage.getItem("fk_erp_empresas");
	tx.executeSql("update erp_mig_ped set estado = 'p' where estado is null  ", [], grabadoDatosSuccess, errorDB);
	mkLog("modificaste el estado pendiente segun la empresa seleccionada.");
}

function grabadoDatosSuccess(tx, results){
	mkLog("Pedido generado");
	window.localStorage.removeItem("cantidad");
	navigator.notification.alert('¡Pedido guardado con éxito!', alertDismissed, 'Pedidos Mobile', 'Listo');
	location.reload();
	
}


//Preparar para sincronizar.

function syncPrepare(){
	db.transaction(syncArt, errorDB);
}

function syncArt(tx){
	console.log("Seleccionando datos para cargar");
	tx.executeSql('select * from erp_mig_ped', [], syncArtSuccess, errorDB);
}

function syncArtSuccess(tx, results){
	console.log("Recibidos de la base de datos erp_mig_ped " + results.rows.length + " registros");
	if(results.rows.length == 0){
		console.log("La tabla erp_mig_ped está vacía.");
		navigator.notification.alert("No hay pedido guardados off line para centralizar.", alertDismissed, 'Pedidos Mobile', 'Listo');
	}else{
		var contenido =[];
		for(var i=0; i<results.rows.length; i++){
			var art = results.rows.item(i);
			contenido[i]=(art.fk_erp_empresas, art.fk_erp_articulos, art.precio);
			//navigator.notification.alert(contenido);
			//$("#jsonPed").append(art.fk_erp_empresas, art.fk_erp_articulos, art.precio);
			$("#jsonPed").append('<button type="button" id="paraCen" onclick="erpCenNow(\''+art.id+'\', \''+art.fk_erp_empresas+'\', \''+art.fk_erp_articulos+'\', \''+art.precio+'\')" class="list-group-item">Empresa: '+art.fk_erp_empresas+' | Artículo: '+ art.fk_erp_articulos +'</button>');
			//erpCenNow('+art.id+', '+art.fk_erp_empresas+', '+art.fk_erp_articulos+', '+art.precio+');
            }
	}	
}

/*
Borro el registro que fue centralizado.
*/
function deleteArticulos(){
	db.transaction(deleteArt, errorDB);
}
function deleteArt(tx){
	var del = window.localStorage.getItem("iddelete");
	
	if(!del){
		navigator.notification.alert('No hay pedidos parar borrar', alertDismissed, 'Pedidos Mobile', 'Listo');
		return;
	}
	
	console.log("a punto de borrar el pedido centralizado");
	tx.executeSql("delete from erp_mig_ped where id = "+del+" ", [], deleteArtSuccess(del), errorDB);
}

function deleteArtSuccess(del) {
    var del;
    console.log('Borre el articulo centralizado '+ del);
    cleanerSync();
}

function cleanerSync(){
    $("#jsonPed").html('');
    syncPrepare();
}

function alertDismissed() {
    // do something
}

function calculaPorcentaje(totalRegistros, proceso){
	var totalRegistros;
	var proceso;
	var porcentaje = proceso * 100 / totalRegistros;
	$("#progressbars").html('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="'+ parseInt(porcentaje) +'" aria-valuemin="0" aria-valuemax="'+ totalRegistros +'" style="width: '+ parseInt(porcentaje) +'%;">'+ parseInt(porcentaje) +'%</div></div>');
}

function progressBar(porcentaje, totalRegistros){
	var porcentaje;
	var totalRegistros;
	//document.getElementById('barras').innerHTML='<div id="pro" class="progress-bar" role="progressbar" aria-valuenow="'+ porcentaje +'" aria-valuemin="0" aria-valuemax="'+ total +'" style="width: '+ porcentaje +'%;">'+ porcentaje +'%</div>';  
	$("#progressbars").html('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="'+ parseInt(porcentaje) +'" aria-valuemin="0" aria-valuemax="'+ totalRegistros +'" style="width: '+ parseInt(porcentaje) +'%;">'+ parseInt(porcentaje) +'%</div></div>');
}




		  $(document).ready(function() {
		   $(document).ajaxStart(function() {
		   $('#conecto').show();
	       $('#muestroresultado').hide();

			}).ajaxStop(function() {
			$('#conecto').hide();
			$('#muestroresultado').fadeIn('slow');
			});
		  $('#form, #fat, #test').submit(function() {
			   $('#muestroresultado').hide();
			   $('#conecto').show();
			$.ajax({
				type: 'post',
				url: $(this).attr('action'),
				data: $(this).serialize(),
				success: function(data) {
				$('#conecto').hide();
				$('#muestroresultado').fadeIn('slow');
				$('#muestroresultado').html(data);
				}
			})  
			return false;
			 }); 
			})  




    function erpCenNow(ii, ee, aa, pp)
    {
        $("#estadoSync").show();
        var ii;
        var ee;
        var aa;
        var pp;
        var WebService = window.localStorage.getItem("ws");
        var BaseDeDatos = window.localStorage.getItem("bd");
        var Usuario = window.localStorage.getItem("user");
        var Clave = window.localStorage.getItem("password");

        $.getJSON("http://leocondori.com.ar/app/local/itssync.php", { id: ii, empresa: ee, articulo: aa, precio: pp, ws: WebService, base: BaseDeDatos, usuario: Usuario, pass: Clave }, resultSync, "json");
    }

    //FUCIONES      
    function resultSync(respuesta)
    {
        if (respuesta.ItsLoginResult == 0)
        {
            var idd = respuesta.id;
            window.localStorage.setItem("iddelete", idd);
            $("#estadoSync").hide();
            //alert('Pedido centralizado con éxito.');
			navigator.notification.alert('Pedido centralizado con éxito.', alertDismissed, 'Pedidos Mobile', 'Listo');
			
			
            deleteArticulos();
        } else
        {
            $("#estadoSync").hide();
            //alert('Existió un error' + respuesta.motivo);
			navigator.notification.alert('Existió un error' + respuesta.motivo, alertDismissed, 'Pedidos Mobile', 'Listo');
        }
    }


    function addCart()
    {
        if ($('#opciones').val() == '')
        {
            //alert('Por favor seleccione un artículo!');
			navigator.notification.alert('Por favor seleccione un artículo!', alertDismissed, 'Pedidos Mobile', 'Listo');
            return;
        }

        if ($('#tags').val() == '')
        {
            //alert('Por favor seleccione una empresa!');
			navigator.notification.alert('Por favor seleccione una empresa!', alertDismissed, 'Pedidos Mobile', 'Listo');
            return;
        }

        $("#detalle").show();

        var article = $('#opciones').val();
        $("#erpdetcom").append('<li class="list-group-item">' +
                                            '<span class="badge">14</span> ' +
                                            article +
                                       '</li>');
        $("#ImpTotCot").show();
    }

    function addClient()
    {
        if ($('#tags').val() == '')
        {
            //alert('Por favor seleccione una empresa!');
			navigator.notification.alert('Por favor seleccione una empresa!', alertDismissed, 'Pedidos Mobile', 'Listo');
            return;
        }
        $("#cabecera").show();
        var empresa = $('#tags').val();
        window.localStorage.setItem("empresa", empresa);
        var fk_erp_empresas = window.localStorage.getItem("empresa");
        $("#subcabecera").html('<p class="bg-primary">Empresa: ' + fk_erp_empresas + '</p>');
    }


    function dameRenglon()
    {
        $("#detalle").append('<div class="input-group">' +
                                '<div class="input-group-addon"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></div>' +
                                '<input type="text" id="erpart" class="form-control" placeholder="Artículos">' +
                                '<div class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>' +
                             '</div>');

    }

    function resetCar()
    {
        if (confirm("¿Desea cancelar la edición?"))
        {
            window.localStorage.removeItem("empresa");
            location.reload();
        }

    }

    function acept()
    {
        grabarPedido();
    }

    function cancel()
    {
        if (confirm("¿Cancela la edición?"))
        {
            depuraDatos();
        }
    }

    function search()
    {
        //alert('Función no implementada.');
		navigator.notification.alert('Función no implementada', alertDismissed, 'Pedidos Mobile', 'Listo');
    }