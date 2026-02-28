const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setStatus(msg, kind="info"){
  statusEl.textContent = msg;
  statusEl.style.color = kind === "error" ? "rgba(255,190,190,.95)" : "rgba(220,235,228,.95)";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Enviando...");

  const data = Object.fromEntries(new FormData(form).entries());

  try{
    const res = await fetch("/api/contato", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });

    const json = await res.json().catch(() => ({}));

    if(!res.ok){
      throw new Error(json?.error || "Falha ao enviar. Tente novamente.");
    }

    form.reset();
    setStatus("Mensagem enviada! Em breve retornamos ✅");
  }catch(err){
    setStatus(err.message || "Erro ao enviar.", "error");
  }
});
