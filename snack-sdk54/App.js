import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import Tela1 from './tela1';
import Tela2 from './tela2';
import Tela3 from './tela3';
import Tela4 from './tela4';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={colors.page} />
        <Stack.Navigator
          initialRouteName="BoasVindas"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.page },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="BoasVindas" component={Tela1} />
          <Stack.Screen name="Instrucoes" component={Tela2} />
          <Stack.Screen name="Jogo" component={Tela3} />
          <Stack.Screen name="Creditos" component={Tela4} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
