# RS Produções — Site (Vercel)

## Como publicar
1. Suba esta pasta para um repositório no GitHub
2. Na Vercel: Add New → Project → Import Git Repository → Deploy

## Formulário (envio de e-mail)
Este projeto usa a API do Resend (serverless) em /api/contato.

### Variáveis na Vercel (Project → Settings → Environment Variables)
- RESEND_API_KEY = (sua chave do Resend)
- TO_EMAIL = Contato@rsproducoeseeventos.com
- FROM_EMAIL = "Contato <contato@rsproducoeseeventos.com>"

### Observação
Para usar FROM_EMAIL no seu domínio, você precisa validar o domínio no Resend.
