import Colors from '@/src/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>

      <Picker
        selectedValue={'Proyecto'}
        onValueChange={(itemValue) => null}
        style={styles.picker}
        selectionColor={Colors.secondary}
      >
        <Picker.Item label='Rol' value='' style={styles.pickerItem} />
        <Picker.Item label='USUARIO' value='' style={styles.pickerItem} />
        <Picker.Item label='ALUMNO' value='' style={styles.pickerItem} />
        <Picker.Item label='EVALUADOR' value='' style={styles.pickerItem} />
        <Picker.Item label='ADMINISTRADOR' value='' style={styles.pickerItem} />
      </Picker>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 16
  },
  picker: {
    alignItems: 'center',
    width: '80%',
    height: 52,
    color: Colors.textPrimary,
    backgroundColor: Colors.itemBackgroundColor,

    // iOS
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android
    elevation: 4,
  },
  pickerItem: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 16
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary
  }
});
