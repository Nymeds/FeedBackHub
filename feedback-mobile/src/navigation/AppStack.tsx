import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedbackList from "../screens/FeedbackList";
import AppHeader from "../components/AppHeader";
import FeedbackForm from "../screens/FeedbackForm";
import FeedbackDetails from "../screens/FeedbackDetails";

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

            <Stack.Screen
            name="FeedbackDetail"
            component={FeedbackDetails}
            options={({ navigation, route }) => ({
            header: () => (
            <AppHeader
                title="Detalhes"
                onBack={() => navigation.goBack()}
                onEdit={() =>
                navigation.navigate("FeedbackForm", {
                    idfeedback: (route.params as any)?.idfeedback,
                })
                }
            />
            ),
        })}
        />


    <Stack.Screen
  name="FeedbackForm"
  component={FeedbackForm} 
  options={({ navigation, route }) => {
    const isEdit = !!(route.params as any)?.idfeedback;
    return {
      header: () => (
        <AppHeader
          title={isEdit ? "Editar Feedback" : "Criar Feedback"}
          onBack={() => navigation.goBack()}
          onDelete={isEdit ? () => (route.params as any)?.onDelete?.() : undefined}
        />
      ),
    };
  }}
/>



    </Stack.Navigator>
  );
}
