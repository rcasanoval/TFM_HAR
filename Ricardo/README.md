Adjunto los ficheros creados para la carpeta de Django y la actualización del la aplicación móvil 


```
  npm install aws-sdk
```

## Pasos a seguir para generar el apks.

En la aplicación de expo, se ejecuta el siguiente comando para generar el fichero .aab 

```
  npx eas build -p android
```
Para convertir el fichero .aab a .apks se debe de generar primero las contraseñas necesarias para firmar y generar el archivo APK para una aplicación Android.

Posteriormente se introduce el siguiente comando para generar el fichero app.apks:

```
  java -jar bundletool-all-1.7.0.jar build-apks --bundle=<nombre_fichero>.aab --output=app.apks --mode=universal --ks mykeystore.jks --ks-key-alias myalias
```
