import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import FeedbackList from "../screens/FeedbackList";
import FeedbackForm from "../screens/FeedbackForm";
import FeedbackDetails from "../screens/FeedBackDetails/FeedbackDetails";
import AppHeader from "../components/AppHeader";
import { deleteFeedback } from "../api/feedbacks"; // <-- importa deleteFeedback

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
        component={FeedbackDetails}
        options={({ navigation, route }) => ({
          header: () => (
            <AppHeader
              title="Detalhes"
              onBack={() => navigation.goBack()}
              onEdit={() =>
                navigation.navigate("FeedbackForm", {
                  idfeedback: route.params.idfeedback,
                })
              }
            />
          ),
        })}
      />

      {/* Formulário de Feedback */}
      <Stack.Screen
        name="FeedbackForm"
        component={FeedbackForm}
        options={({ navigation, route }) => {
          const idfeedback = route.params?.idfeedback;
          const isEdit = !!idfeedback;

          return {
            header: () => (
              <AppHeader
                title={isEdit ? "Editar Feedback" : "Criar Feedback"}
                onBack={() => navigation.goBack()}
                onDelete={
                  isEdit
                    ? async () => {
                        try {
                          await deleteFeedback(idfeedback);
                          Alert.alert("Sucesso", "Feedback deletado!");
                          navigation.navigate("FeedbackList");
                        } catch (err: any) {
                          Alert.alert(
                            "Erro",
                            err?.message || "Erro ao deletar feedback"
                          );
                        }
                      }
                    : undefined
                }
              />
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
}
