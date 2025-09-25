import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import AnalysisScreen from './analysis-screen';
import HomeScreen from './home-screen';
import UploadScreen from './upload-screen';

const Stack = createNativeStackNavigator();

function Index() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Upload" component={UploadScreen}/>
      <Stack.Screen name="Analysis" component={AnalysisScreen}/>
    </Stack.Navigator>
  );
}

export default Index;


