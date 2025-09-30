import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedbackList from "../screens/FeedbackList";
import AppHeader from "../components/AppHeader";
// import FeedbackDetail from "../screens/FeedbackDetail";
import FeedbackForm from "../screens/FeedbackForm";

export type RootStackParamList = {
  FeedbackList: undefined;
  FeedbackDetail: { idfeedback: string };
  FeedbackForm: { idfeedback?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedbackList"
        component={FeedbackList}
        options={({ navigation }) => ({
          header: () => (
            <AppHeader
              title="Feedbacks"
              onBack={undefined} 
            />
          ),
        })}
      />

    
      {/*
      <Stack.Screen
        name="FeedbackDetail"
        component={FeedbackDetail}
        options={({ navigation }) => ({
          header: () => (
            <AppHeader
              title="Detalhes"
              onBack={() => navigation.goBack()}
              onEdit={handleEdit} // função de editar
            />
          ),
        })}
      />
        */}
      <Stack.Screen
        name="FeedbackForm"
        component={FeedbackForm}
        options={({ navigation }) => ({
          header: () => (
            <AppHeader
              title="Criar / Editar Feedback"
              onBack={() => navigation.goBack()}
            />
          ),
        })}
      />
      
    </Stack.Navigator>
  );
}
