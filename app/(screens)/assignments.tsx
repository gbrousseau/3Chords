import { View, Text, StyleSheet } from 'react-native';

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
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