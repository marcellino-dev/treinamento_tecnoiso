import path from "path"

export const COR_DESTAQUE = "#e72d64"
export const COR_VERDE_WHATSAPP = "#25D366"
export const COR_ESCURA = "#000000"
export const EMAIL_CONTATO = "contato@tecnoiso.com"

export const arquivosImagens = ["hero.png", "brush-top.png", "brush-bottom.png"]
export const anexosImagens = arquivosImagens.map((arquivo) => ({
  filename: arquivo,
  path: path.join(process.cwd(), "public", "email", arquivo),
  cid: arquivo.replace(/\.[a-z]+$/, ""),
  contentDisposition: "inline" as const
}))

export const imagem = (cid: string, largura: number) => `<img src="cid:${cid}" width="${largura}" alt="" style="display:block;width:100%;max-width:${largura}px;height:auto;border:0">`
export const faixaTopo = `<tr><td style="line-height:0;font-size:0;background:#ffffff">${imagem("brush-top", 600)}</td></tr>`
export const faixaBase = `<tr><td style="line-height:0;font-size:0;background:#ffffff">${imagem("brush-bottom", 600)}</td></tr>`
export const botao = (texto: string, href: string, cor: string = COR_DESTAQUE) => `<a href="${href}" style="display:inline-block;background:${cor};color:#ffffff;padding:13px 24px;font-size:16px;text-decoration:none;border-radius:4px">${texto}</a>`
export const blocoPreto = (conteudo: string) => `<tr><td bgcolor="${COR_ESCURA}" style="background:${COR_ESCURA};padding:10px 30px 34px;color:#ffffff">${conteudo}</td></tr>`
export const blocoBranco = (conteudo: string) => `<tr><td bgcolor="#ffffff" style="background:#ffffff;padding:10px 30px 34px;color:#000000">${conteudo}</td></tr>`
export const titulo = (texto: string, cor: string) => `<div style="font-size:34px;font-weight:bold;text-align:center;letter-spacing:1px;color:${cor};margin:0 0 24px">${texto}</div>`
export const destaque = (texto: string) => `<div style="font-size:30px;font-weight:bold;color:${COR_DESTAQUE};margin:14px 0 18px">${texto}</div>`
export const duasColunas = (esquerda: string, direita: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" valign="top" style="padding-right:12px">${esquerda}</td><td width="50%" valign="top" style="padding-left:12px">${direita}</td></tr></table>`
export const manchete = (linha1Esquerda: string, linha1Direita: string, linha2Esquerda: string, linha2Direita: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 18px"><tr><td align="right" style="padding-right:14px;font-size:42px;font-weight:bold;color:#000000;line-height:1.1">${linha1Esquerda}</td><td align="left" style="font-size:34px;color:${COR_DESTAQUE};line-height:1.1">${linha1Direita}</td></tr><tr><td align="right" style="padding-right:14px;font-size:46px;font-weight:bold;color:${COR_DESTAQUE};line-height:1.2">${linha2Esquerda}</td><td align="left" style="font-size:28px;color:#000000;line-height:1.2">${linha2Direita}</td></tr></table>`

export const shell = (content: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#000000"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td align="center"><table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" bgcolor="${COR_ESCURA}" style="width:100%;max-width:680px;background:${COR_ESCURA}"><tr><td style="padding:0 40px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff"><tr><td style="padding:22px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#000000">TECNOISO</td><td align="right" style="font-size:12px;font-weight:bold;color:#000000">TREINAMENTO 2026</td></tr></table></td></tr><tr><td style="line-height:0;font-size:0">${imagem("hero", 600)}</td></tr>${content}<tr><td bgcolor="${COR_ESCURA}" style="background:${COR_ESCURA};padding:26px 30px;text-align:center;font-size:12px;color:#ffffff"><strong>TECNOISO Tecnologia e Soluções Industriais LTDA.</strong><br><span style="color:#cccccc">Análise e Interpretação de Certificados de Calibração</span><br><a href="mailto:${EMAIL_CONTATO}" style="color:${COR_DESTAQUE};text-decoration:none;font-weight:bold">${EMAIL_CONTATO}</a></td></tr></table></td></tr></table></td></tr></table></body></html>`

export const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character] || character)

// ============================================
// CONVITE DO GRUPO DO WHATSAPP (mesmo visual dos outros)
// ============================================
const LINK_WHATSAPP = "https://chat.whatsapp.com/EF6ZttIWVMm4AwiCoGC5i2?mode=gi_t"

function primeiroNomeConvite(nome: string): string {
  if (!nome || !nome.trim()) return ""
  return nome.trim().split(/\s+/)[0]
}

export function montarEmailConvite(nome: string): string {
  const primeiro = escapeHtml(primeiroNomeConvite(nome))
  const saudacao = primeiro ? `Olá, ${primeiro}!` : "Olá!"

  const conteudo = `
    <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:18px 30px 10px;text-align:center">
      ${manchete("CONVITE", "ESPECIAL", "GRUPO", "WHATSAPP")}
      <p style="font-size:16px;line-height:1.5;color:#000000;margin:0 0 22px">
        ${saudacao} Para ficar por dentro de todas as informações sobre o <strong>Treinamento de Certificados</strong>, entre no nosso grupo do WhatsApp pelo link abaixo.
      </p>
      ${botao("Entrar no grupo do WhatsApp", LINK_WHATSAPP, COR_VERDE_WHATSAPP)}
      <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
      <p style="font-size:13px;color:#555555;margin:0">Ou copie o link: <a href="${LINK_WHATSAPP}" style="color:${COR_DESTAQUE};word-break:break-all">${LINK_WHATSAPP}</a></p>
    </td></tr>
    ${faixaTopo}
    ${blocoPreto(`
      ${titulo("O QUE VOCÊ VAI RECEBER", "#ffffff")}
      <div style="font-size:16px;line-height:1.8;color:#ffffff;margin:0 0 8px">
        &bull; Avisos e comunicados oficiais<br>
        &bull; Horários e informações de acesso<br>
        &bull; Materiais complementares do treinamento<br>
        &bull; Suporte direto com a equipe TECNOISO
      </div>
    `)}
    ${faixaBase}
    ${blocoBranco(`
      ${titulo("SOBRE O TREINAMENTO", "#000000")}
      ${duasColunas(
        `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px">Data</div><div style="font-size:14px;line-height:1.6;color:#000000">Aula única, das 13h30 às 17h30.</div>${destaque("30/09/2026")}`,
        `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px">Formato</div><div style="font-size:14px;line-height:1.6;color:#000000">Transmissão ao vivo, na modalidade EaD.</div>${destaque("EaD AO VIVO")}`
      )}
    `)}
    ${faixaTopo}
    ${blocoPreto(`
      ${titulo("AINDA NÃO ESTÁ NO GRUPO?", "#ffffff")}
      <div style="text-align:center">
        ${botao("Entrar no grupo do WhatsApp", LINK_WHATSAPP, COR_VERDE_WHATSAPP)}
      </div>
      <p style="font-size:13px;color:#cccccc;text-align:center;margin:22px 0 0">Se o botão não funcionar, copie o link acima e cole no seu navegador.</p>
    `)}
    ${faixaBase}
    <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:6px 30px 30px;text-align:center;font-size:13px;color:#555555">
      Dúvidas? Fale com a gente: <a href="mailto:${EMAIL_CONTATO}" style="color:${COR_DESTAQUE};font-weight:bold">${EMAIL_CONTATO}</a>
    </td></tr>
  `

  return shell(conteudo)
}

export function montarTextoPlanoConvite(nome: string): string {
  const primeiro = primeiroNomeConvite(nome)
  const saudacao = primeiro ? `Olá, ${primeiro}!` : "Olá!"
  return `${saudacao}

Para ficar por dentro de todas as informações sobre o Treinamento de Certificados, entre no nosso grupo do WhatsApp:

${LINK_WHATSAPP}

Lá você receberá avisos, horários e materiais do treinamento.

Atenciosamente,
Equipe Tecnoiso
${EMAIL_CONTATO}`
}