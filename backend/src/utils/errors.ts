export function formatValidationError(
  details: Array<{ field: string; message: string }> = []
) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message: "Dados inválidos",
      details,
    },
  };
}

export function formatNotFound() {
  return {
    error: {
      code: "NOT_FOUND",
      message: "Recurso não encontrado",
      details: [],
    },
  };
}

export function formatInternalError() {
  return {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro inesperado",
      details: [],
    },
  };
}
