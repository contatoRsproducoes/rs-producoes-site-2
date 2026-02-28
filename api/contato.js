export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  try {
    const { nome, empresa, telefone, email, data, local, mensagem } = req.body || {};

    if (!nome || !telefone || !email || !mensagem) {
      res.status(400).json({ error: "Preencha nome, telefone, e-mail e mensagem." });
      return;
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL || "Contato@rsproducoeseeventos.com";
    const FROM_EMAIL = process.env.FROM_EMAIL || "Contato <contato@rsproducoeseeventos.com>";

    if (!RESEND_API_KEY) {
      res.status(500).json({ error: "RESEND_API_KEY não configurada na Vercel." });
      return;
    }

    const subject = `[RS Site] Novo contato: ${nome}`;
    const safe = (s) => String(s || "").replace(/[<>]/g, "");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Novo contato pelo site</h2>
        <p><b>Nome:</b> ${safe(nome)}</p>
        <p><b>Empresa:</b> ${safe(empresa)}</p>
        <p><b>Telefone:</b> ${safe(telefone)}</p>
        <p><b>E-mail:</b> ${safe(email)}</p>
        <p><b>Data do evento:</b> ${safe(data)}</p>
        <p><b>Cidade/UF:</b> ${safe(local)}</p>
        <p><b>Mensagem:</b><br/>${safe(mensagem).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        html,
        reply_to: safe(email)
      })
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(502).json({ error: "Falha ao enviar e-mail via Resend.", details: t });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro interno.", details: String(e?.message || e) });
  }
}
