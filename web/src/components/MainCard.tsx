import React from "react";


export default function MainCard() {
return (
<main className="fp-main fp-card-inner" role="main" aria-label="Conteúdo principal">
<div style={{ textAlign: "center" }}>
<h2 style={{ margin: 0, fontSize: 28 }}>Conteúdo Principal</h2>
<p style={{ opacity: 0.95, marginTop: 12, fontWeight: 500, maxWidth: 560 }}>
Este grande cartão verde representa o painel principal. Substitua pelo seu conteúdo (lista de feedbacks, gráfico, formulário etc.).
</p>
</div>
</main>
);
}