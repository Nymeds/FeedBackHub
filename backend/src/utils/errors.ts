export function formatValidationError(details: Array<{ field?: string, message: string }> = []) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message: "Dados inválidos",
      details: details.map(d => ({ field: d.field ?? "", message: d.message })),
    },
  };
}

export function formatNotFound(entity = "Recurso") {
  return {
    error: {
      code: "NOT_FOUND",
      message: `${entity} não encontrado`,
      details: [],
    },
  };
}
