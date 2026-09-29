import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { google } from "googleapis"
import {
  anexosImagens,
  escapeHtml,
  COR_DESTAQUE,
  COR_VERDE_WHATSAPP,
  montarEmailConvite,
  montarTextoPlanoConvite,
} from "@/lib/email-template"

// ============================================
// CONFIGURAÇÕES
// ============================================
export const maxDuration = 10

const ASSUNTO = "Treinamento de Certificados - Entre no grupo do WhatsApp"
const EMAIL_TESTE = "mclsouza1613ad@gmail.com"
const DELAY_MS = 300
const TAMANHO_LOTE = 15

// ============================================
// TIPOS
// ============================================
type Contato = {
  email: string
  nome: string
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function limparEmail(email: string): string {
  return (email || "").toString().trim().toLowerCase()
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// LER CONTATOS DO GOOGLE SHEETS
// ============================================
async function lerContatosDoSheets(): Promise<Contato[]> {
  console.log("[CONVITE] Lendo contatos do Google Sheets...")

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: `${process.env.GOOGLE_SHEETS_TAB}!A:C`,
  })

  const rows = response.data.values || []
  console.log(`[CONVITE] Total de linhas na planilha: ${rows.length}`)

  const contatos: Contato[] = []
  const vistos = new Set<string>()

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]
    const email = limparEmail(row[0])
    const nome = (row[2] || "").toString().trim()

    if (!email || !emailPattern.test(email)) continue
    if (vistos.has(email)) continue

    vistos.add(email)
    contatos.push({ email, nome })
  }

  console.log(`[CONVITE] Contatos únicos válidos: ${contatos.length}`)
  return contatos
}

// ============================================
// ROTA GET
// ============================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const modoTeste = searchParams.get("teste") === "1"
    const modoEnvio = searchParams.get("enviar") === "1"
    const token = searchParams.get("token") || ""
    const lote = Number(searchParams.get("lote") || "1")
    const emailUnico = searchParams.get("email") || ""

    console.log(`[CONVITE] Modo: ${modoEnvio ? "ENVIO REAL" : modoTeste ? "TESTE" : "PREVIEW"} | Lote: ${lote} | Email específico: ${emailUnico || "nenhum"}`)

    // --- 1. Lê os contatos do Google Sheets ---
    const contatos = await lerContatosDoSheets()

    if (contatos.length === 0) {
      return NextResponse.json({ error: "Nenhum contato encontrado na planilha" }, { status: 404 })
    }

    // --- 2. Modo PREVIEW ---
    if (!modoTeste && !modoEnvio && !emailUnico) {
      const totalLotes = Math.ceil(contatos.length / TAMANHO_LOTE)
      return NextResponse.json({
        modo: "preview",
        total: contatos.length,
        tamanhoLote: TAMANHO_LOTE,
        totalLotes,
        contatos: contatos.slice(0, 10),
        mensagem: `Preview de ${contatos.length} contatos divididos em ${totalLotes} lotes de ${TAMANHO_LOTE}. Use ?teste=1 para enviar um teste ou ?enviar=1&token=SEGREDO&lote=N para enviar cada lote.`,
      })
    }

    // --- 3. Verifica token no modo de envio real ---
    if (modoEnvio && token !== process.env.CONVITE_TOKEN) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 })
    }

    // --- 4. Define destinatários ---
    let destinatarios: Contato[]

    if (emailUnico) {
      const emailsAlvo = emailUnico
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e) => emailPattern.test(e))

      if (emailsAlvo.length === 0) {
        return NextResponse.json({ error: "Nenhum e-mail válido informado no parâmetro ?email=" }, { status: 400 })
      }

      destinatarios = emailsAlvo.map((email) => {
        const encontrado = contatos.find((c) => c.email === email)
        return encontrado || { email, nome: "" }
      })
    } else if (modoTeste) {
      destinatarios = [{ email: EMAIL_TESTE, nome: "Marcelo Teste" }]
    } else {
      const inicio = (lote - 1) * TAMANHO_LOTE
      const fim = inicio + TAMANHO_LOTE
      destinatarios = contatos.slice(inicio, fim)

      if (destinatarios.length === 0) {
        return NextResponse.json({
          error: `Lote ${lote} está vazio. O total de lotes é ${Math.ceil(contatos.length / TAMANHO_LOTE)}.`,
        }, { status: 400 })
      }
    }

    console.log(`[CONVITE] Enviando para ${destinatarios.length} destinatários...`)

    // --- 5. Configura transporter SMTP ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      },
    })

    // --- 6. Envia e-mails ---
    const enviados: string[] = []
    const falhas: { email: string; erro: string }[] = []

    for (const contato of destinatarios) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: contato.email,
          subject: modoTeste ? `[TESTE] ${ASSUNTO}` : ASSUNTO,
          html: montarEmailConvite(contato.nome),
          text: montarTextoPlanoConvite(contato.nome),
          attachments: anexosImagens,
        })
        enviados.push(contato.email)
        console.log(`[CONVITE] ✅ Enviado: ${contato.email}`)
      } catch (err: any) {
        falhas.push({ email: contato.email, erro: err.message })
        console.error(`[CONVITE] ❌ Falha: ${contato.email} — ${err.message}`)
      }

      if (contato !== destinatarios[destinatarios.length - 1]) {
        await sleep(DELAY_MS)
      }
    }

    const totalLotes = Math.ceil(contatos.length / TAMANHO_LOTE)
    const proximoLote = lote + 1
    const temProximoLote = proximoLote <= totalLotes

    console.log(`[CONVITE] Concluído. Enviados: ${enviados.length} | Falhas: ${falhas.length}`)

    return NextResponse.json({
      modo: emailUnico ? "envio-individual" : modoTeste ? "teste" : "envio-real",
      lote: emailUnico ? null : lote,
      totalLotes: emailUnico ? null : totalLotes,
      tamanhoLote: TAMANHO_LOTE,
      totalContatos: contatos.length,
      destinatarios: destinatarios.map((d) => d.email),
      enviados: enviados.length,
      falhas: falhas.length,
      detalhesFalhas: falhas.slice(0, 10),
      proximoLote: !emailUnico && temProximoLote ? proximoLote : null,
      mensagem: emailUnico
        ? `Convite enviado para ${enviados.length} e-mail(s) específico(s).`
        : temProximoLote
        ? `Lote ${lote} de ${totalLotes} concluído. Próximo: ?enviar=1&token=SEGREDO&lote=${proximoLote}`
        : `🎉 Todos os ${totalLotes} lotes concluídos!`,
    })
  } catch (error: any) {
    console.error("[CONVITE] Erro geral:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar convites" }, { status: 500 })
  }
}