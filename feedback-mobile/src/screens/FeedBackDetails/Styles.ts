import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  message: { textAlign: "center", marginTop: 20, fontSize: 16 },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(18,35,58,0.04)",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#12233a",
    fontWeight: "700",
  },

  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(18,35,58,0.04)",
  },
  descLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  descText: {
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  descFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eef2f6",
    paddingTop: 8,
    gap: 10,
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 4,
  },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 8, color: "#12233a" },

  commentFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#e6e9ef",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  publishButton: {
    backgroundColor: "#0b74ff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  publishText: { color: "#fff", fontWeight: "700" },
});
