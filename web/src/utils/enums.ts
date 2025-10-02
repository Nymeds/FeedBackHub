export const CATEGORIAS = ["UI", "UX", "Feature", "Bug", "Performance", "Other"] as const;
export const STATUS = ["suggestion", "planned", "in_progress", "done"] as const;

export type Categoria = typeof CATEGORIAS[number];
export type Status = typeof STATUS[number];