import { View, Text, StyleSheet } from 'react-native';

export default function SpeakerRequestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speaker Request</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 20,
  },
}); 