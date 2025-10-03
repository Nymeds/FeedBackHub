import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedbackList from "../screens/FeedbackList";
import FeedbackForm from "../screens/FeedbackForm";
import FeedbackDetail from "../screens/FeedBackDetails/FeedbackDetails";
import AppHeader from "../components/AppHeader";

export type RootStackParamList = {
  FeedbackList: undefined;
  FeedbackDetail: { idfeedback: string };
  FeedbackForm: { idfeedback?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      {/* Lista de Feedbacks */}
      <Stack.Screen
        name="FeedbackList"
        component={FeedbackList}
        options={{
          header: () => <AppHeader title="Feedbacks" />,
        }}
      />

      {/* Detalhes do Feedback */}
      <Stack.Screen
        name="FeedbackDetail"
        component={FeedbackDetail}
        options={{ headerShown: false }} // Header será controlado pelo FeedbackDetail
      />

      {/* Formulário de Feedback */}
      <Stack.Screen
        name="FeedbackForm"
        component={FeedbackForm}
        options={{ headerShown: false }} // Header customizado dentro do form
      />
    </Stack.Navigator>
  );
}
