import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { google } from "googleapis"
import path from "path"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitsOnly = (value: string) => value.replace(/\D/g, "")
const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character] || character)

// Modo de teste: enquanto for true, todos os e-mails vão apenas para EMAIL_TESTE
const MODO_TESTE = false
const EMAIL_TESTE = "mclsouza1613ad@gmail.com"
const EMAIL_TESTE_CLIENTE = "marcelinosouza.dev@gmail.com"
const DESTINATARIOS_INTERNOS = "contato@tecnoiso.com, vendas@tecnoiso.com, vendas3@tecnoiso.com"
const COPIA_OCULTA = "mclsouza1613ad@gmail.com"

const COR_DESTAQUE = "#e72d64"
const COR_ESCURA = "#000000"
const EMAIL_CONTATO = "contato@tecnoiso.com"

const arquivosImagens = ["hero.png", "brush-top.png", "brush-bottom.png"]
const anexosImagens = arquivosImagens.map((arquivo) => ({
  filename: arquivo,
  path: path.join(process.cwd(), "public", "email", arquivo),
  cid: arquivo.replace(/\.[a-z]+$/, ""),
  contentDisposition: "inline" as const
}))

const imagem = (cid: string, largura: number) => `<img src="cid:${cid}" width="${largura}" alt="" style="display:block;width:100%;max-width:${largura}px;height:auto;border:0">`
const faixaTopo = `<tr><td style="line-height:0;font-size:0;background:#ffffff">${imagem("brush-top", 600)}</td></tr>`
const faixaBase = `<tr><td style="line-height:0;font-size:0;background:#ffffff">${imagem("brush-bottom", 600)}</td></tr>`
const botao = (texto: string, href: string) => `<a href="${href}" style="display:inline-block;background:${COR_DESTAQUE};color:#ffffff;padding:13px 24px;font-size:16px;text-decoration:none">${texto}</a>`
const blocoPreto = (conteudo: string) => `<tr><td bgcolor="${COR_ESCURA}" style="background:${COR_ESCURA};padding:10px 30px 34px;color:#ffffff">${conteudo}</td></tr>`
const blocoBranco = (conteudo: string) => `<tr><td bgcolor="#ffffff" style="background:#ffffff;padding:10px 30px 34px;color:#000000">${conteudo}</td></tr>`
const titulo = (texto: string, cor: string) => `<div style="font-size:34px;font-weight:bold;text-align:center;letter-spacing:1px;color:${cor};margin:0 0 24px">${texto}</div>`
const subtitulo = (texto: string) => `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px">${texto}</div>`
const destaque = (texto: string) => `<div style="font-size:30px;font-weight:bold;color:${COR_DESTAQUE};margin:14px 0 18px">${texto}</div>`
const duasColunas = (esquerda: string, direita: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" valign="top" style="padding-right:12px">${esquerda}</td><td width="50%" valign="top" style="padding-left:12px">${direita}</td></tr></table>`
const campos = (itens: [string, string][], escuro: boolean) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${escuro ? "#333333" : "#e5e5e5"}">${itens.map(([rotulo, valor]) => `<tr><td width="38%" valign="top" style="padding:13px 12px 13px 0;border-bottom:1px solid ${escuro ? "#333333" : "#e5e5e5"};font-size:12px;font-weight:bold;letter-spacing:1px;color:${escuro ? "#999999" : "#777777"}">${rotulo}</td><td valign="top" style="padding:13px 0;border-bottom:1px solid ${escuro ? "#333333" : "#e5e5e5"};font-size:15px;font-weight:bold;line-height:1.4;color:${escuro ? "#ffffff" : "#000000"};word-break:break-word">${valor}</td></tr>`).join("")}</table>`
const manchete = (linha1Esquerda: string, linha1Direita: string, linha2Esquerda: string, linha2Direita: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 18px"><tr><td align="right" style="padding-right:14px;font-size:42px;font-weight:bold;color:#000000;line-height:1.1">${linha1Esquerda}</td><td align="left" style="font-size:34px;color:${COR_DESTAQUE};line-height:1.1">${linha1Direita}</td></tr><tr><td align="right" style="padding-right:14px;font-size:46px;font-weight:bold;color:${COR_DESTAQUE};line-height:1.2">${linha2Esquerda}</td><td align="left" style="font-size:28px;color:#000000;line-height:1.2">${linha2Direita}</td></tr></table>`

const shell = (content: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#000000"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td align="center"><table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" bgcolor="${COR_ESCURA}" style="width:100%;max-width:680px;background:${COR_ESCURA}"><tr><td style="padding:0 40px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff"><tr><td style="padding:22px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:22px;font-weight:bold;letter-spacing:2px;color:#000000">TECNOISO</td><td align="right" style="font-size:12px;font-weight:bold;color:#000000">TREINAMENTO 2026</td></tr></table></td></tr><tr><td style="line-height:0;font-size:0">${imagem("hero", 600)}</td></tr>${content}<tr><td bgcolor="${COR_ESCURA}" style="background:${COR_ESCURA};padding:26px 30px;text-align:center;font-size:12px;color:#ffffff"><strong>TECNOISO Tecnologia e Soluções Industriais LTDA.</strong><br><span style="color:#cccccc">Análise e Interpretação de Certificados de Calibração</span><br><a href="mailto:${EMAIL_CONTATO}" style="color:${COR_DESTAQUE};text-decoration:none;font-weight:bold">${EMAIL_CONTATO}</a></td></tr></table></td></tr></table></td></tr></table></body></html>`

const listaItens = (itens: string[]) => itens.map((item) => `&bull; ${item}`).join("<br>")

// ============================================
// FUNÇÃO: Salvar na planilha do Google Sheets (5 colunas)
// ============================================
async function saveToSheet(data: any) {
  console.log("[SHEETS] ================================")
  console.log("[SHEETS] Iniciando saveToSheet...")
  console.log("[SHEETS] ID da planilha:", process.env.GOOGLE_SHEETS_ID)
  console.log("[SHEETS] Aba:", process.env.GOOGLE_SHEETS_TAB)
  console.log("[SHEETS] Service Account:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  console.log("[SHEETS] Private Key existe?", !!process.env.GOOGLE_PRIVATE_KEY)
  console.log("[SHEETS] Private Key tamanho:", process.env.GOOGLE_PRIVATE_KEY?.length || 0)
  console.log("[SHEETS] ================================")
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${process.env.GOOGLE_SHEETS_TAB}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          data.email,
          data.telefone,
          data.nome,
          data.razaoSocial,
          data.cnpj,
        ]],
      },
    })

    console.log("[SHEETS] ✅ SUCESSO! Linha adicionada:", response.data.updates?.updatedRange)
  } catch (error: any) {
    console.error("[SHEETS] ❌ ERRO:", error.message)
    throw error
  }
}

// ============================================
// ROTA POST
// ============================================
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const required = ["nome", "email", "telefone", "cnpj", "razaoSocial", "setor", "tipoCliente"]
    if (required.some((field) => typeof data[field] !== "string" || !data[field].trim())) {
      return NextResponse.json({ error: "Dados obrigatórios ausentes" }, { status: 400 })
    }
    
    if (!emailPattern.test(data.email) || digitsOnly(data.telefone).length < 10 || digitsOnly(data.cnpj).length !== 14 || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data.cnpj)) {
      return NextResponse.json({ error: "Formato de dado inválido" }, { status: 400 })
    }
    
    const transporter = nodemailer.createTransport({ 
      host: process.env.SMTP_HOST, 
      port: Number(process.env.SMTP_PORT || 465), 
      secure: Number(process.env.SMTP_PORT || 465) === 465, 
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS 
      } 
    })
    
    const name = escapeHtml(data.nome)
    const email = escapeHtml(data.email)
    const primeiroNome = escapeHtml(data.nome.split(" ")[0])
    const tipoCliente = escapeHtml(data.tipoCliente)
    const ehContrato = data.tipoCliente === "Cliente de contrato"
    const linkAgenda = "https://calendar.google.com/calendar/render?action=TEMPLATE&amp;text=" + encodeURIComponent("Treinamento TECNOISO - Análise e Interpretação de Certificados de Calibração") + "&amp;dates=20260930T163000Z/20260930T203000Z&amp;details=" + encodeURIComponent("EaD ao vivo")
    const linkCorrecao = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent("Correção de dados - Treinamento TECNOISO")}`
    const linkFalarEquipe = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent("Treinamento TECNOISO")}`
    const linkResponder = `mailto:${email}?subject=${encodeURIComponent("Treinamento TECNOISO")}`
    const linkLigar = `tel:+55${digitsOnly(data.telefone)}`
    
    const details = `
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:18px 30px 10px;text-align:center">
        ${manchete("NOVA", "INSCRIÇÃO", "30/09", "13H30 &middot; EaD")}
        <p style="font-size:16px;line-height:1.5;color:#000000;margin:0 0 22px">Uma nova pessoa demonstrou interesse no <strong>treinamento TECNOISO</strong>. Confira os dados abaixo e responda este e-mail para falar diretamente com o participante.</p>
        ${botao("Responder participante", linkResponder)}
        <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
      </td></tr>
      ${faixaTopo}
      ${blocoPreto(`
        ${titulo("DADOS PESSOAIS", "#ffffff")}
        ${campos([["NOME", name], ["E-MAIL", email], ["TELEFONE", escapeHtml(data.telefone)]], true)}
        <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
        <div style="text-align:center">${botao("Ligar para o participante", linkLigar)}</div>
      `)}
      ${faixaBase}
      ${blocoBranco(`
        ${titulo("DADOS DA EMPRESA", "#000000")}
        ${campos([["RAZÃO SOCIAL", escapeHtml(data.razaoSocial)], ["CNPJ", escapeHtml(data.cnpj)], ["SETOR", escapeHtml(data.setor)], ["TELEFONE", escapeHtml(data.telefoneEmpresa || "Não informado")], ["CIDADE", escapeHtml(data.cidade || "Não informado")], ["ESTADO", escapeHtml(data.estado || "Não informado")]], false)}
      `)}
      ${faixaTopo}
      ${blocoPreto(`
        ${titulo("TIPO DE CLIENTE", "#ffffff")}
        <div style="text-align:center;margin:0 0 26px"><span style="display:inline-block;padding:10px 20px;border-radius:6px;font-size:18px;font-weight:bold;background:${ehContrato ? "#d1fae5" : "#fff1f5"};color:${ehContrato ? "#065f46" : COR_DESTAQUE}">${tipoCliente}</span></div>
        <div style="text-align:center">${botao("Responder participante", linkResponder)}</div>
      `)}
      ${faixaBase}
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:6px 30px 30px;text-align:center;font-size:14px;color:#555555">Responda este e-mail para falar diretamente com o participante.</td></tr>
    `
    
    const confirmation = `
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:18px 30px 10px;text-align:center">
        ${manchete("INSCRIÇÃO", "RECEBIDA", "30/09", "EaD AO VIVO")}
        <p style="font-size:16px;line-height:1.5;color:#000000;margin:0 0 22px">Olá, ${primeiroNome}. Recebemos seus dados para o treinamento <strong>Análise e Interpretação de Certificados de Calibração</strong> e nossa equipe entrará em contato em breve.</p>
        ${botao("Falar com a equipe", linkFalarEquipe)}
        <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
      </td></tr>
      ${faixaTopo}
      ${blocoPreto(`
        ${destaque("AULA AO VIVO 30/09")}
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;line-height:1.3;margin:0 0 12px;color:#ffffff">Análise e Interpretação de Certificados de Calibração</div>
        <div style="font-size:16px;line-height:1.8;color:#ffffff;margin:0 0 22px">${listaItens(["30/09/2026", "13h30 às 17h30", "EaD ao vivo"])}</div>
        <span style="display:inline-block;background:${COR_DESTAQUE};color:#ffffff;padding:13px 24px;font-size:16px;font-weight:bold">30/09/2026 &middot; 13H30</span>
      `)}
      ${faixaBase}
      ${blocoBranco(`
        ${titulo("SEUS DADOS", "#000000")}
        ${campos([["NOME", name], ["E-MAIL", email], ["EMPRESA", escapeHtml(data.razaoSocial)], ["CNPJ", escapeHtml(data.cnpj)]], false)}
        <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
        <div style="text-align:center">${botao("Corrigir meus dados", linkCorrecao)}</div>
      `)}
      ${faixaTopo}
      ${blocoPreto(`
        ${titulo("NÃO PERCA", "#ffffff")}
        ${duasColunas(
          `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px;color:#ffffff">Data e horário</div><div style="font-size:14px;line-height:1.6;color:#ffffff">Treinamento com aula única, das 13h30 às 17h30.</div>${destaque("30/09/2026")}${botao("Adicionar à agenda", linkAgenda)}`,
          `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px;color:#ffffff">Formato</div><div style="font-size:14px;line-height:1.6;color:#ffffff">Transmissão ao vivo, na modalidade EaD.</div>${destaque("EaD AO VIVO")}`
        )}
      `)}
      ${faixaBase}
      ${blocoBranco(`
        ${titulo("PRÓXIMOS PASSOS", "#000000")}
        ${duasColunas(
          `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px">Aguarde nosso contato</div><div style="font-size:14px;line-height:1.6;color:#000000">Nossa equipe entrará em contato em breve com você.</div>${destaque("01")}`,
          `<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;margin:0 0 12px">Guarde este e-mail</div><div style="font-size:14px;line-height:1.6;color:#000000">Se não encontrá-lo na caixa de entrada, verifique spam e promoções.</div>${destaque("02")}`
        )}
      `)}
    `
    
    // 1. Salva na planilha
    try {
      await saveToSheet(data)
    } catch (err) {
      console.error("[ROUTE] Erro ao salvar na planilha (e-mail continuará):", err)
    }
    
    // 2. Envia e-mail de notificação
    try {
      await transporter.sendMail({ 
        from: process.env.SMTP_USER, 
        to: MODO_TESTE ? EMAIL_TESTE : DESTINATARIOS_INTERNOS, 
        bcc: MODO_TESTE ? undefined : COPIA_OCULTA, 
        replyTo: data.email, 
        subject: `${MODO_TESTE ? "[TESTE] " : ""}Nova inscrição (${data.tipoCliente}) | Treinamento TECNOISO`, 
        html: shell(details), 
        text: `Nova inscrição de ${data.nome} (${data.email}) - ${data.tipoCliente}.`,
        attachments: anexosImagens
      })
      console.log("[ROUTE] ✅ E-mail de notificação enviado")
    } catch (err) {
      console.error("[ROUTE] ❌ Falha ao enviar notificação:", err)
    }
    
    // 3. Envia e-mail de confirmação
    try {
      await transporter.sendMail({ 
        from: process.env.SMTP_USER, 
        to: MODO_TESTE ? EMAIL_TESTE_CLIENTE : data.email, 
        subject: `${MODO_TESTE ? "[TESTE] " : ""}Sua inscrição foi recebida | TECNOISO`, 
        html: shell(confirmation), 
        text: `Olá, ${data.nome}. Recebemos seus dados para o treinamento TECNOISO. Nossa equipe entrará em contato em breve.`,
        attachments: anexosImagens
      })
      console.log("[ROUTE] ✅ E-mail de confirmação enviado para", data.email)
    } catch (err) {
      console.error("[ROUTE] ❌ Falha ao enviar confirmação:", err)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) { 
    console.error("[v0] Falha no envio SMTP:", error)
    return NextResponse.json({ error: "Falha ao enviar inscrição" }, { status: 500 }) 
  }
}