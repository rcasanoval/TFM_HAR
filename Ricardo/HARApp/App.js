import React, { useState, useEffect } from 'react';
import {AccessibilityInfo, StyleSheet, Text, View, Alert } from 'react-native';
import { Accelerometer, Magnetometer, Barometer, Gyroscope, LightSensor } from 'expo-sensors';
import {Boton_init, Boton_end, Boton_send} from './botons';
import * as FileSystemExpo from 'expo-file-system';
//import { appendFile } from 'react-native-fs';
//import { FileSystem } from 'react-native-file-access';
//import { Parser } from '@json2csv/plainjs';
//import { Parser } from 'json2csv';
//import {init, end, send} from './funct_botons';
import { Modal, TouchableOpacity } from 'react-native';
//import Papa from 'papaparse';
import { S3 } from 'aws-sdk';
//import DeviceInfo from 'react-native-device-info';
//import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import Popup from './Popup';


// Credenciales de Amazon S3
const ACCESS_KEY_ID = 'AKIAXMLIWNTTYD22JRTF';
const SECRET_ACCESS_KEY = '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';
const REGION = 'eu-west-2';

// Configuración del bucket de Amazon S3
const bucketName = 'upm-har';





export default function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [activityInitialized, setActivityInitialized] = useState(false);

  const [accelerometerData, setAccelerometerData] = useState({});
  const [accelerometerDataArray, setAccelerometerDataArray] = useState([]);

  const [magnetometerData, setMagnetometerData] = useState({});
  const [magnetometerDataArray, setMagnetometerDataArray] = useState([]);
  
  const [barometerData, setBarometerData] = useState({});
  const [barometerDataArray, setBarometerDataArray] = useState([]);

  const [gyroscopeData, setGyroscopeData] = useState({});
  const [gyroscopeDataArray, setGyroscopeDataArray] = useState([]);

  const [lightSensorData, setLightSensorData] = useState({});
  const [lightSensorDataArray, setLightSensorDataArray] = useState([]);

  const [mensaje, setMensaje] = useState('');

  //Popup
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [valorUID, setValorUID] = useState(null);
 

  useEffect(() => {
    checkIfFirstOpen();
  }, []);

  const checkIfFirstOpen = async () => {
    try {
      const isFirstOpenValue = await SecureStore.getItemAsync('isFirstOpen');
      console.log(isFirstOpenValue);
      if (isFirstOpenValue === null) {
        setIsFirstOpen(true);
        await SecureStore.setItemAsync('isFirstOpen', 'true');
      }
      // Configurar valor de UID
      UID = Application.androidId;
      await new Promise((resolve) => {
      setValorUID(UID, () => {
        resolve();
      });
    });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePopupClose = () => {
    setIsFirstOpen(false);
  };

  /*const [PulsadoInit, setPulsadoInit] = useState(null);
  const [PulsadoEnd, setPulsadoEnd] = useState(null);
  const [PulsadoSend, setPulsadoSend] = useState(null);*/

  const [baseFilename, setBaseFilename] = useState("generic_basefilename");

  
  //alert(process.cwd())
  const rutaMaestra = FileSystemExpo.documentDirectory + 'HARdocs/';
  let nombrefile;
  const [finalContAcc, setFinalContAcc] = useState(0);
  let contador_acc = 0;
  const [finalContMag, setFinalContMag] = useState(0);
  let contador_mag = 0;
  const [finalContBar, setFinalContBar] = useState(0);
  let contador_bar = 0;
  const [finalContGyr, setFinalContGyr] = useState(0);
  let contador_gyr = 0;
  const [finalContLig, setFinalContLig] = useState(0);
  let contador_lig = 0;

  let endCompleted = false;
  let tiempoExcedido = false; // Variable para indicar si se ha excedido el tiempo máximo
  let temporizador = {};

  //console.log("Inicialización completa... Esperando acción de usuario");
  useEffect(() => {
    console.log("Estableciendo nombreBaseFile: " + baseFilename);
  }, [baseFilename]);

  useEffect(() => {
    if (activityInitialized) {
      funct_init(selectedActivity);
      setActivityInitialized(false); // Reiniciar el estado de la variable
    }
  }, [activityInitialized]);


  async function checkDirectory() {
    try {
      const dirInfo = await FileSystemExpo.getInfoAsync(rutaMaestra);
      if (!dirInfo.exists) {
        await FileSystemExpo.makeDirectoryAsync(rutaMaestra, { intermediates: true });
        console.log("Creado directorio: " + rutaMaestra )
      }
      else {
        console.log("El directorio " + rutaMaestra + " ya existe!")
      }
    } catch (error) {
      console.log(error);
    }
    return
  }


  async function joinFiles(ruta, nombreFile) {
    
    try{

    // Crear un archivo de salida
    const archivoSalida = ruta + nombreFile + '.json';

    // Obtener la lista de archivos en la ruta
    const files = await FileSystemExpo.readDirectoryAsync(ruta);

    let data = [];
    //content = "";
    for (const file of files) {
      if (file.startsWith(nombreFile)){
        console.log("Leido la info de " + file)
        const filePath = `${ruta}${file}`;
        // read the contents of the file
        const content_aux = await FileSystemExpo.readAsStringAsync(filePath);
        //content = content + content_aux
        const jsonData = JSON.parse(content_aux);
        data.push(...Array.isArray(jsonData) ? jsonData : [jsonData]);
      }
    }
    // Convertir el arreglo 'data' a formato JSON
    const jsonContent = JSON.stringify(data);
    //console.log(jsonContent);
    console.log("Creando el archivo " + nombreFile)
    await FileSystemExpo.writeAsStringAsync(archivoSalida, jsonContent, { encoding: FileSystemExpo.EncodingType.UTF8 });
    } catch(error){
      console.error(error)
    }

  }  
  
  async function deleteFiles(ruta, nombreFile) {
    // Obtener la lista de archivos en la ruta
    const archivos = await FileSystemExpo.readDirectoryAsync(ruta);
    // Iterar sobre los archivos en la ruta

    for (const archivo of archivos) {
      console.log(nombreFile + ' ' + archivo)
      if (archivo.startsWith(nombreFile) && archivo !== nombreFile.concat('.json')){
        console.log(archivo + " esta siendo eliminado");
        await FileSystemExpo.deleteAsync(`${ruta}${archivo}`);
      }
    }
  }
  
  async function obtenerFechaHoraActual() {
    const fecha = new Date(); // crea un objeto Date con la fecha y hora actuales
    console.log(fecha)
    const fechaStr = fecha.toLocaleDateString(); // obtiene la fecha en formato legible
    console.log("Fecha: " + fechaStr);
    const horaStr = fecha.toLocaleTimeString(); // obtiene la hora en formato legible
    console.log("Hora: " + horaStr);
    cadena = fechaStr.concat('_' + horaStr).replace('/', '_').replace('/', '_').replace(':', '_').replace(':', '_')
    setBaseFilename(cadena); // devuelve una cadena con la fecha y hora
    //Wait para que le de tiempo a actualizar el nombre de baseFilename 
    // TODO OOJOO!!!!!!!!!!!!!!!! es una solucion momentanea, tiene que haber otra forma
    setTimeout(() => {}, 100);
    
    console.log("BaseFileName asignado: " + baseFilename)
    
    return cadena
  }

  async function write_file(nombrefile, arrayData){
    try{
      if (arrayData.length > 0){
        console.log("Escribiendo archivo " + nombrefile)
        //console.log("Data:" + JSON.stringify(arrayData));
        /*const fields = arrayData[0].keys();
        console.log(fields)
        const parser = new Parser({ fields });*/

        //const opts = {};
        //const parser = new Parser(opts);
        //const csv = parser.parse(arrayData);

        const json = JSON.stringify(arrayData);
        //console.log(csv);
        await FileSystemExpo.writeAsStringAsync(rutaMaestra + nombrefile, json, { encoding: FileSystemExpo.EncodingType.UTF8 });
      }
      else{
        console.log(nombrefile + " no ha recibido ningun dato");
        await FileSystemExpo.writeAsStringAsync(rutaMaestra + nombrefile, JSON.stringify(-1), { encoding: FileSystemExpo.EncodingType.UTF8 });

      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteArray(array){
    while(array.length > 0){
      array.pop();
    }
    return array
  }

  const detenerTemporizador = () => {
    // Verificar si el temporizador está activo
    console.log('Temporizador:', temporizador);
    if (temporizador.temporizadorID) {
      // Desactivar el temporizador
      clearTimeout(temporizador.temporizadorID);
      console.log('Temporizador detenido:', temporizador.temporizadorID);
    }
  
    // Reiniciar el identificador del temporizador en el objeto temporizador
    temporizador.temporizadorID = null;
  };

  async function funct_init(actividad){
    setMensaje('Leyendo datos');
    console.log(`La actividad seleccionada es: ${actividad}`);
    console.log("Buscando directorio ".concat(rutaMaestra).concat("..."));
    // Comprueba si existe una ruta universal donde escribir los archivos y , si no, la crea
    await checkDirectory();
    console.log("Estableciendo nombreBaseFile...");
    //Establecemos el nombre base de todos los archivos temporales hasta que se pulse el boton de end (en funcion de un nonce y/o la fecha y hora)
    cadaux = await obtenerFechaHoraActual();

    // Añadimos todos los listeners

    const interval = 100;
    const max_length = 20;
    let length_acc = 0;
    let length_mag = 0;
    let length_bar = 0;
    let length_gyr = 0;
    let length_lig = 0;
    

    // Contador y función para reiniciar el contador cada segundo
    let contador = 0;
    let previousSecond = -1;
    let hour = null;

    //Se excede el tiempo máximo
    const tiempoMaximo = 2 * 60 * 60 * 1000; // 2 Horas de medidas
    
    // Función para detener la lectura de los sensores después de que haya pasado el tiempo máximo
    const detenerLecturaDespuesDeTiempoMaximo = () => {
      console.log('Tiempo máximo alcanzado. Deteniendo lectura de datos.');
      tiempoExcedido = true; // Se ha excedido el tiempo máximo  
      // Llamar a la función `end()` después de 5 segundos
      setTimeout(async () => {
        end();
        console.log(endCompleted);
        if (endCompleted) {
          send(); // Llamar a la función `send()` después de que `end()` haya terminado
        }
      }, 15000);
    }

    detenerTemporizador();
    // Iniciar el temporizador
    temporizador.temporizadorID = setTimeout(detenerLecturaDespuesDeTiempoMaximo, tiempoMaximo);
    console.log("Temporizador: ", temporizador.temporizadorID);
    console.log("Datos: ", temporizador);

    //Sensores
    Accelerometer.addListener(data => {
      const sensor = '1';
      const now = new Date();
      hour = now.toISOString().replace('T', ' ').replace(/\.\d+Z/, '');
      const timestamp = hour;
      const activity = actividad;
      //Contador
      const currentSecond = now.getSeconds();
      if (currentSecond !== previousSecond) {
        // Reiniciar el contador 
        contador = 0;
      } else{
        contador++;
      }
      previousSecond = currentSecond;

      const counter = contador;
      //Datos que se envían
      const newData = { ...data, timestamp, activity, sensor, counter };
      setAccelerometerData(newData);
      accelerometerDataArray.push(newData);
      //setAccelerometerDataArray((prevArray) => [...prevArray, data]);
      length_acc = length_acc + 1;
      
      if (length_acc > max_length){
        //Creamos los nombres concatenando la fecha y hora, el sensor correspondiente y un nonce
        nombrefile = cadaux.concat("_ACC_").concat(contador_acc).concat(".json");
        contador_acc = contador_acc + 1;
        setFinalContAcc(contador_acc);
        write_file(nombrefile, accelerometerDataArray);
        deleteArray(accelerometerDataArray);
        length_acc = 0;
      }

    });
    Accelerometer.setUpdateInterval(interval);

    Magnetometer.addListener(data => {
      const sensor = '2';
      const timestamp = hour;
      const activity = actividad;
      const counter = contador;
      const newData = { ...data, timestamp, activity, sensor, counter };
      setMagnetometerData(newData);
      magnetometerDataArray.push(newData);
      //setMagnetometerDataArray((prevArray) => [...prevArray, data]);
      length_mag = length_mag + 1;

      if (length_mag > max_length){
        nombrefile = cadaux.concat("_MAG_").concat(contador_mag).concat(".json");
        contador_mag = contador_mag + 1;
        setFinalContMag(contador_mag);
        write_file(nombrefile, magnetometerDataArray);
        deleteArray(magnetometerDataArray);
        length_mag = 0;
      }
    });
    Magnetometer.setUpdateInterval(interval);

    Barometer.addListener(data => {
      const sensor = '3';
      const timestamp = hour;
      const activity = actividad;
      const counter = contador;
      const newData = { ...data, timestamp, activity, sensor, counter };
      setBarometerData(newData);
      barometerDataArray.push(newData);
      //setBarometerDataArray((prevArray) => [...prevArray, newData]);
      length_bar = length_bar + 1;

      if (length_bar > max_length){
        nombrefile = cadaux.concat("_BAR_").concat(contador_bar).concat(".json");
        contador_bar = contador_bar + 1;
        setFinalContBar(contador_bar);
        write_file(nombrefile, barometerDataArray);
        deleteArray(barometerDataArray);
        length_bar = 0;
      }
    }); 
    Barometer.setUpdateInterval(interval);

    Gyroscope.addListener(data => {
      const sensor = '4';
      const timestamp = hour;
      const activity = actividad;
      const counter = contador;
      const newData = { ...data, timestamp, activity, sensor, counter };
      setGyroscopeData(newData);
      gyroscopeDataArray.push(newData);
      //setGyroscopeDataArray((prevArray) => [...prevArray, newData]);
      length_gyr = length_gyr + 1;

      if (length_gyr > max_length){
        nombrefile = cadaux.concat("_GYR_").concat(contador_gyr).concat(".json");
        contador_gyr = contador_gyr + 1;
        setFinalContGyr(contador_gyr);
        write_file(nombrefile, gyroscopeDataArray);
        deleteArray(gyroscopeDataArray);
        length_gyr = 0;
      }
    });
    Gyroscope.setUpdateInterval(interval);

    LightSensor.addListener(data => {
      const sensor = '5';
      const timestamp = hour;
      const activity = actividad;
      const counter = contador;
      const newData = { ...data, timestamp, activity, sensor, counter };
      setLightSensorData(newData);
      lightSensorDataArray.push(newData);
      //setLightSensorDataArray((prevArray) => [...prevArray, newData]);
      length_lig = length_lig + 1;
      
      if (length_lig > max_length){
        nombrefile = cadaux.concat("_LIG_").concat(contador_lig).concat(".json");
        contador_lig = contador_lig + 1;
        setFinalContLig(contador_lig);
        write_file(nombrefile, lightSensorDataArray);
        deleteArray(lightSensorDataArray);
        length_lig = 0;
      }
    });
    LightSensor.setUpdateInterval(interval);
    
    return
  }

  async function init(){
    setShowOptions(true);
    //console.log("function_init")
    //console.log("Fin function_init")
    return  
  }

  async function removeListeners(){
    Accelerometer.removeAllListeners()
    Magnetometer.removeAllListeners()
    Barometer.removeAllListeners()
    Gyroscope.removeAllListeners()
    LightSensor.removeAllListeners()
    return
  }

  async function resetCounters(){
    contador_acc = 0;
    contador_mag = 0;
    contador_bar = 0;
    contador_gyr = 0;
    contador_lig = 0;
    return
  }

  async function writeFinalFiles(){
    console.log("Dentro de finalfiles: " + baseFilename)
    nombrefile = baseFilename.concat("_ACC_").concat(finalContAcc).concat(".json");
    await write_file(nombrefile, accelerometerDataArray);
    deleteArray(accelerometerDataArray);
    console.log("Acc_final escrito con " + accelerometerDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_MAG_").concat(finalContMag).concat(".json");
    await write_file(nombrefile, magnetometerDataArray);
    deleteArray(magnetometerDataArray);
    console.log("Mag_final escrito con " + magnetometerDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_BAR_").concat(finalContBar).concat(".json");
    await write_file(nombrefile, barometerDataArray);
    deleteArray(barometerDataArray);
    console.log("Bar_final escrito con " + barometerDataArray)

    nombrefile = baseFilename.concat("_GYR_").concat(finalContGyr).concat(".json");
    await write_file(nombrefile, gyroscopeDataArray);
    deleteArray(gyroscopeDataArray);
    console.log("Gyr_final escrito con " + gyroscopeDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_LIG_").concat(finalContLig).concat(".json");
    await write_file(nombrefile, lightSensorDataArray);
    deleteArray(lightSensorDataArray);
    console.log("Lig_final escrito con " + lightSensorDataArray.length + " datos.")

    return
  }

  async function funct_end(){
    detenerTemporizador();
    console.log("Dentro de end " + baseFilename)
    // Quitamos todos los listeners
    console.log("Quitando los listeners...")
    await removeListeners()

    
    // Reseteamos los contadores de nuevo

    console.log("Reseteando contadores...")
    await resetCounters()

    //Escribimos a un archivo temporal los datos que tenemos hasta ahora en los array de datos

    console.log("Escribiendo archivos finales...")
    await writeFinalFiles()
    
    //Reunimos todos los archivos temporales y los unificamos en uno mismo

    console.log("Uniendo archivos temporales...")
    // Unificamos todos los archivos con el mismo nombre
    await joinFiles(rutaMaestra, baseFilename + '_ACC')
    await joinFiles(rutaMaestra, baseFilename + '_MAG')
    await joinFiles(rutaMaestra, baseFilename + '_BAR')
    await joinFiles(rutaMaestra, baseFilename + '_GYR')
    await joinFiles(rutaMaestra, baseFilename + '_LIG')

    console.log("Eliminando archivos temporales...")
    // Eliminamos los archivos temporales
    await deleteFiles(rutaMaestra, baseFilename + '_ACC')
    await deleteFiles(rutaMaestra, baseFilename + '_MAG')
    await deleteFiles(rutaMaestra, baseFilename + '_BAR')
    await deleteFiles(rutaMaestra, baseFilename + '_GYR')
    await deleteFiles(rutaMaestra, baseFilename + '_LIG')

    setMensaje('Fin de lectura de datos');

    return
  }

  async function end(){
    console.log("function_end")
    console.log("Valor temportizador antes de pararlo: ", temporizador.temporizadorID);
    await funct_end()
    endCompleted = true;
    console.log("Fin function_end")
    return    
  }   
  
  function printFiles(files) {
    files.forEach((file) => {
      console.log(file);
    });
  }

  async function deleteAllFilesInDirectory(directory) {
    try {
      const files = await FileSystemExpo.readDirectoryAsync(directory);
      // Loop through the files in the directory and delete them one by one
      for (const file of files) {
        await FileSystemExpo.deleteAsync(`${directory}/${file}`);
      }
    } catch (error) {
      console.error(`Failed to delete files in directory ${directory}: ${error}`);
    }
  }

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => {
      setMensaje('');
    }, 5000);
  };

  async function unificarFicherosSensor(ruta, sensor) {
    try {
      // Obtener la lista de archivos en la ruta
      const files = await FileSystemExpo.readDirectoryAsync(ruta);
  
      const archivosSensor = files.filter(file => {
        const regex = new RegExp(`^\\d{1,2}_\\d{1,2}_\\d{4}_\\d{1,2}_\\d{1,2}_\\d{1,2}_${sensor}_\\d+\\.json$`);
        return regex.test(file);
      });
  
      if (archivosSensor.length > 0) {
        console.log(`Unificando ficheros del sensor ${sensor}: ${archivosSensor.join(', ')}`);
        await joinFiles(ruta, sensor);
      } else {
        console.log(`No se encontraron ficheros para el sensor ${sensor}`);
      }
    } catch (error) {
      console.error(error);
    }
  }  

  function verificarFormatoUniforme(nombresArchivos) {
    const formato = /^(\d{1,2})_(\d{1,2})_(\d{4})_(\d{1,2})_(\d{1,2})_(\d{1,2})_(ACC|LIG|MAG|BAR|GYR)_\d+\.json$/;
    for (const nombreArchivo of nombresArchivos) {
      if (!formato.test(nombreArchivo)) {
        return false;
      }
    }
    return true;
  }
  
  async function funct_send(){
    setMensaje('Envío de datos');
    //Seleccionamos todos los archivos generados guardados y los enviamos a una direccion IP "hardcodeada"
    const archivos = await FileSystemExpo.readDirectoryAsync(rutaMaestra);
    //console.log("Archivos en el directorio....", rutaMaestra)
    //printFiles(archivos.sort()); // Array de nombres de archivo

    
    if (tiempoExcedido && !verificarFormatoUniforme(archivos)) {
      unificarFicherosSensor(rutaMaestra, 'ACC')
      unificarFicherosSensor(rutaMaestra, 'MAG')
      unificarFicherosSensor(rutaMaestra, 'BAR')
      unificarFicherosSensor(rutaMaestra, 'GYR')
      unificarFicherosSensor(rutaMaestra, 'LIG')
    } else {
      console.log('Los nombres de archivo tienen un formato uniforme. No se requiere unificar.');
    }
    

    const s3 = new S3({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: REGION
    });

    let datosCombinados = {}; // objeto que contiene los datos de todos los archivos JSON

    //Convertimos los ficheros .csv a .json
    /*await Promise.all(archivos.map(async (archivo) => {
      if (archivo.endsWith('.csv')) {
        const rutaArchivo = `${rutaMaestra}/${archivo}`;
        const contenidoArchivo = await FileSystemExpo.readAsStringAsync(rutaArchivo);
        const datosJson = Papa.parse(contenidoArchivo, { header: true }).data;
        const nombreArchivoJson = archivo.replace('.csv', '.json');
        const rutaArchivoJson = `${rutaMaestra}/${nombreArchivoJson}`;
        const contenidoArchivoJson = JSON.stringify(datosJson);
        await FileSystemExpo.writeAsStringAsync(rutaArchivoJson, contenidoArchivoJson);
        // agregar los datos al objeto de datos combinados
        datosCombinados[nombreArchivoJson] = datosJson;
        //console.log(datosCombinados); 
        //const infoArchivoJson = await FileSystemExpo.getInfoAsync(rutaArchivoJson);
        //console.log(`Archivo guardado: ${infoArchivoJson.exists ? infoArchivoJson.uri : 'No encontrado'}`);
    }
    }));*/

    //Convertimos los ficheros .json a objetos JSON y los agregamos al objeto de datos combinados
    await Promise.all(archivos.map(async (archivo) => {
      if (archivo.endsWith('.json')) {
        const rutaArchivo = `${rutaMaestra}/${archivo}`;
        const contenidoArchivo = await FileSystemExpo.readAsStringAsync(rutaArchivo);
        //console.log(contenidoArchivo);
        const datosJson = JSON.parse(contenidoArchivo);
        
        // agregar los datos al objeto de datos combinados
        datosCombinados[archivo] = datosJson;
        //console.log(datosCombinados); 
      }
    }));

    // Filtrar los archivos que no deben ser enviados
    const filesToSend = Object.keys(datosCombinados).filter(
      (archivo) => datosCombinados[archivo] !== -1
    );


    // Verificar si hay archivos para enviar
    if (filesToSend.length > 0) {
      // Crear un nuevo objeto con los archivos que deben ser enviados

      // Agregar la propiedad "timeExceeded" si tiempoExcedido es true
      if (tiempoExcedido) {
        datosCombinados.timeExceeded = true;
        datosCombinados.fileExceeded = baseFilename;
        tiempoExcedido = false;
      }

      //datosCombinados.deviceId = Device.getUniqueId();

      datosCombinados.deviceId = valorUID;
      
      // Convertir los datos combinados a un solo archivo JSON y enviarlo
      cadaux = await obtenerFechaHoraActual();
      const nombreArchivoJsonCombinado = cadaux.concat('_datos_combinados.json');
      const rutaArchivoJsonCombinado = `${rutaMaestra}/${nombreArchivoJsonCombinado}`;
      const contenidoArchivoJsonCombinado = JSON.stringify(datosCombinados);
      await FileSystemExpo.writeAsStringAsync(rutaArchivoJsonCombinado, contenidoArchivoJsonCombinado);

      const params = {
        Bucket: bucketName,
        Key: nombreArchivoJsonCombinado,
        Body: contenidoArchivoJsonCombinado,
      };
      await s3.putObject(params).promise();
      mostrarMensaje('Datos enviados');

    }

    if(datosCombinados.length == 0){
      mostrarMensaje('No hay datos para enviar');
    }

    //Eliminamos estos archivos para que no se vuelvan a enviar
    console.log("Eliminando todos los archivos del directorio...")
    await deleteAllFilesInDirectory(rutaMaestra);
  }

  async function send(){
    console.log("function_send")  
    //Variable para saber la actividad que se ha seleccionado. 
    console.log(`La actividad seleccionada es: ${selectedActivity}`);
    await funct_send()
    console.log("Fin function_send")
    return
  }

  const handleCancel = async () => {
    console.log('Lectura de datos cancelada');
    // Lógica adicional para cancelar la lectura de datos
    await funct_end()

    //Seleccionamos todos los archivos generados guardados
    const archivos = await FileSystemExpo.readDirectoryAsync(rutaMaestra);
    console.log(archivos);
    
    // Eliminar los archivos con base_filename
    for (const archivo of archivos) {
      if (archivo.startsWith(baseFilename)) {
        const rutaArchivo = `${rutaMaestra}/${archivo}`;
        await FileSystemExpo.deleteAsync(rutaArchivo);
        console.log(`Archivo ${archivo} eliminado`);
      }
    }
    mostrarMensaje('Datos eliminados');

  };

  function getActivitySeleccionada() {
    let actividadSeleccionada;
  
    switch (selectedActivity) {
      case '1':
        actividadSeleccionada = 'Caminar';
        break;
      case '2':
        actividadSeleccionada = 'Metro';
        break;
      case '3':
        actividadSeleccionada = 'Bus';
        break;
      case '4':
        actividadSeleccionada = 'Conducir coche';
        break;
      case '5':
        actividadSeleccionada = 'Subir o bajar escaleras';
        break;
      case '6':
        actividadSeleccionada = 'Estar detenido';
        break;
      default:
        actividadSeleccionada = 'Actividad desconocida';
        break;
    }
  
    return actividadSeleccionada;
  }
  
  
  return(
    <View style={styles.container}>
      <Popup isVisible={isFirstOpen} onClose={handlePopupClose} UID={valorUID}/>
      <Text style={styles.text}>{mensaje}</Text>
      <Boton_init onPress={() => {
        init()
      }} />
      <Boton_end onPress={() => {
        const actividadSeleccionada = getActivitySeleccionada();
      // Mostrar mensaje de confirmación
      Alert.alert(
        'Confirmación',
        `¿Estás seguro de que la actividad que se estaba realizando era: ${actividadSeleccionada}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: handleCancel, // Llamar a la función handleCancel cuando se selecciona "Cancelar"
          },
          {
            text: 'Confirmar',
            onPress: () => {
              // Lógica cuando se confirma la finalización
              console.log('Lectura de datos finalizada');
              end(); // Llamar a la función end() si se confirma la finalización
            },
          },
        ],
        { cancelable: false }
      );
    }} />
      <Boton_send onPress={() => {
        send()
      }} />
       <Modal visible={showOptions} animationType="slide">
        <View style={styles.modalContainer}>
        <Text style={styles.text}>Registre la actividad que está realizando: </Text>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el primer método
            setSelectedActivity('1');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Caminar</Text>

          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el segundo método
            setSelectedActivity('2');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Metro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el tercer método
            setSelectedActivity('3');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Bus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el cuarto método
            setSelectedActivity('4');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Conducir coche</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el quinto método
            setSelectedActivity('5');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Subir o bajar escaleras</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={async () => {
            // Lógica para el quinto método
            setSelectedActivity('6');
            setShowOptions(false);
            setActivityInitialized(true);
          }}>
            <Text style={styles.text}>Estar detenido</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
});
