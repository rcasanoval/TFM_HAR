import { StyleSheet, TouchableOpacity, Text } from 'react-native';

function Boton_init(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.text}>Init</Text>
    </TouchableOpacity>
  );
}

function Boton_end(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.text}>End</Text>
    </TouchableOpacity>
  );
}

function Boton_send(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.text} >Send</Text>
    </TouchableOpacity>
  );
}

export {Boton_init, Boton_end, Boton_send};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 35,
  },
});
