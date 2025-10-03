import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FeedbackCard from "../components/FeedbackCard";
import { useFeedbacks } from "../hooks/useFeedbacks";
import SearchInput from "../components/SearchInput";
import BottomButton from "../components/BottomButton";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = Math.max(12, Math.round(width * 0.03)); // responsivo e com mínimo

export default function FeedbackList() {
  const navigation = useNavigation<any>();

  const {
    feedbacks,
    loading,
    error,
    page,
    setPage,
    hasMore,
    fetchFeedbacks,
    handleSearch,
  } = useFeedbacks(1, 10); // limite 10 por página

  const [refreshing, setRefreshing] = useState(false);
  const endReachedRef = useRef(false); // evita múltiplos triggers rápidos

  // Recarregar ao focar (reset para a página 1)
  useFocusEffect(
    useCallback(() => {
      fetchFeedbacks(true).catch(() => {});
    }, [fetchFeedbacks])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFeedbacks(true); // reset
    } finally {
      setRefreshing(false);
    }
  }, [fetchFeedbacks]);

  // Carregar mais quando chegar no fim da lista
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    if (endReachedRef.current) return;
    endReachedRef.current = true;
    setPage(prev => prev + 1);
    // libera flag após pequeno atraso para evitar vários triggers
    setTimeout(() => {
      endReachedRef.current = false;
    }, 700);
  }, [loading, hasMore, setPage]);

  const renderItem = useCallback(
    ({ item }) => (
      <FeedbackCard
        titulo={item.titulo}
        descricao={item.descricao}
        categoria={item.categoria}
        status={item.status}
        autor={item.autor || "Anônimo"}
        commentsCount={item.commentsCount || 0}
        createdAt={item.createdAt}
        onPress={() => navigation.navigate("FeedbackDetail", { idfeedback: item.idfeedback })}
      />
    ),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <SearchInput placeholder="Buscar feedback..." onChangeText={handleSearch} />

      <View style={styles.listWrapper}>
        {error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={feedbacks}
            keyExtractor={(item, index) => item.idfeedback ?? String(index)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.contentContainer}
            onEndReached={loadMore}
            onEndReachedThreshold={0.6}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              loading && hasMore ? (
                <View style={styles.footer}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>Nenhum feedback encontrado</Text>
                  <Text style={styles.emptySubtitle}>Crie o primeiro feedback usando o botão abaixo</Text>
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
          />
        )}
      </View>

      <BottomButton title="Novo Feedback" onPress={() => navigation.navigate("FeedbackForm")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#f6f7fb",
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    // sombra sutil
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
  footer: {
    paddingVertical: 12,
    alignItems: "center",
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#666",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
    textAlign: "center",
  },
});
