# How to build?

1. Crea una cuenta en expo.dev
2. instala eas-cli: npm install -g eas-cli
3. Haz login con tu cuenta de expo: eas login con usuario y contraseña
4. Establece la configuracion de la build: eas build:configure. Si te sale un error de configuracion diciendo que esta no existe, hay que crear dentro de la carpeta un archivo llamada app.config.json con el nompre de la app. Yo he puesto

'''
{
  "expo": {
    "name": "HAR gather data app",
    "slug": "HAR-gather-data-app"
  }
}
'''
5. eas build --platform android (alternativamente ios o all para las dos)
6. Esperas (puede que bastante)
7. Si quieres ver si todo sigue en orden abres, en la misma carpeta una nueva terminal y haces eas build:list y ves si hay errores
8. Seguimos esperando
8b. Si da errores, hay una cosa maravillosa llamada npx expo-doctor, que sirve para ver que potenciales fallos tiene el proyecto. En mi caso me han salido cosas de versiones de paquetes que usamos, los he actualizado usando npx expo install [los parques que tenia mal que me decia que eran @expo/webpack-config@^18.0.1 react@18.2.0 react-dom@18.2.0 react-native@0.71.7]. Tambien me ha dado un error raruno de los expo plugins pero parece que ese no es tan importante.
9. a