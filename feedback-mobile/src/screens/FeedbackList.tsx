import React, { useCallback, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FeedbackCard from "../components/FeedbackCard";
import { useFeedbacks } from "../hooks/useFeedbacks";
import SearchInput from "../components/SearchInput";
import BottomButton from "../components/BottomButton";

export default function FeedbackList() {
  const navigation = useNavigation<any>();
  const { feedbacks, loading, handleSearch, error, fetchData } = useFeedbacks();

  // Recarregar a lista sempre que a tela entrar em foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Buscar feedback..." onChangeText={handleSearch} />

      {loading ? (
        <ActivityIndicator style={styles.indicator} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : feedbacks.length === 0 ? (
        <Text style={styles.message}>Nenhum feedback encontrado</Text>
      ) : (
        <FlatList
          data={feedbacks}
          keyExtractor={(item) => item.idfeedback}
          renderItem={({ item }) => (
            <FeedbackCard
              titulo={item.titulo}
              descricao={item.descricao}
              categoria={item.categoria}
              status={item.status}
              autor={item.autor || "Anônimo"}
              commentsCount={item.commentsCount || 0}
              createdAt={item.createdAt}
              onPress={() =>
                navigation.navigate("FeedbackDetail", { idfeedback: item.idfeedback })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <BottomButton title="Novo Feedback" onPress={() => navigation.navigate("FeedbackForm")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  indicator: { marginTop: 20 },
  message: { marginTop: 20, textAlign: "center", fontSize: 16 },
});
