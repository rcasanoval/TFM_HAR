import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const Popup = ({ isVisible, onClose, UID }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Text Text style={styles.title}>¡Bienvenido a la aplicación!</Text>
        <Text Text style={styles.uid}>Valor UID: {UID}</Text>
        <Button title="Cerrar" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  uid: {
    fontSize: 16,
    color: 'black',
  },
});

export default Popup;
