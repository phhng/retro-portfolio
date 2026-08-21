import { StyleSheet, View } from 'react-native';
import Desktop from '@/components/Desktop';

export default function Index() {
  return (
    <View style={styles.container}>
      <Desktop />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});