import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitsOnly = (value: string) => value.replace(/\D/g, "")
const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character] || character)
const shell = (content: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#686868;font-family:Arial,sans-serif;color:#252525"><div style="max-width:620px;margin:24px auto;background:#fff"><div style="padding:28px 36px;border-bottom:1px solid #eee"><strong style="font-size:22px;letter-spacing:1px;color:#28172f">TECNOISO</strong><span style="float:right;color:#e72d64;font-size:12px;font-weight:bold">TREINAMENTO 2026</span></div>${content}<div style="background:#28172f;color:#fff;padding:24px 36px;text-align:center;font-size:12px"><strong>TECNOISO Tecnologia e Soluções Industriais LTDA.</strong><br><span style="color:#d7cadb">Análise e Interpretação de Certificados de Calibração</span></div></div></body></html>`

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validação dos campos obrigatórios
    const required = ["nome", "email", "telefone", "cnpj", "razaoSocial", "setor", "tipoCliente"]
    if (required.some((field) => typeof data[field] !== "string" || !data[field].trim())) {
      return NextResponse.json({ error: "Dados obrigatórios ausentes" }, { status: 400 })
    }
    
    // Validação de formatos
    if (!emailPattern.test(data.email) || digitsOnly(data.telefone).length < 10 || digitsOnly(data.cnpj).length !== 14 || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data.cnpj)) {
      return NextResponse.json({ error: "Formato de dado inválido" }, { status: 400 })
    }
    
    // Configuração do transporter SMTP
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
    
    // E-mail de notificação (para a TECNOISO + setor comercial)
    const details = `
      <h1 style="font-size:28px;margin:0 0 12px;color:#28172f">Nova inscrição recebida</h1>
      <p style="color:#666;line-height:1.6">Uma nova pessoa demonstrou interesse no treinamento TECNOISO.</p>
      <div style="background:#fff1f5;border-left:4px solid #e72d64;padding:18px;margin:24px 0;line-height:1.8">
        <b>Dados pessoais</b><br>
        Nome: ${name}<br>
        E-mail: ${email}<br>
        Telefone: ${escapeHtml(data.telefone)}<br><br>
        <b>Dados da empresa</b><br>
        CNPJ: ${escapeHtml(data.cnpj)}<br>
        Razão social: ${escapeHtml(data.razaoSocial)}<br>
        Setor: ${escapeHtml(data.setor)}<br>
        Telefone da empresa: ${escapeHtml(data.telefoneEmpresa || "Não informado")}<br>
        Cidade: ${escapeHtml(data.cidade || "Não informado")}<br>
        Estado: ${escapeHtml(data.estado || "Não informado")}<br><br>
        <b>Tipo de cliente</b><br>
        <span style="display:inline-block;padding:6px 12px;border-radius:6px;font-weight:bold;background:${data.tipoCliente === "Cliente de contrato" ? "#d1fae5" : "#fff1f5"};color:${data.tipoCliente === "Cliente de contrato" ? "#065f46" : "#e72d64"}">${escapeHtml(data.tipoCliente)}</span>
      </div>
      <p style="color:#666">Responda este e-mail para falar diretamente com o participante.</p>
    `
    
    // E-mail de confirmação (para o participante)
    const confirmation = `
      <div style="padding:42px 36px 34px">
        <div style="display:inline-block;background:#e72d64;color:#fff;border-radius:50%;width:48px;height:48px;text-align:center;line-height:48px;font-size:26px">✓</div>
        <p style="color:#e72d64;font-weight:bold;letter-spacing:2px;font-size:12px;margin:22px 0 8px">INSCRIÇÃO RECEBIDA</p>
        <h1 style="font-size:32px;line-height:1.1;margin:0 0 18px;color:#28172f">Até breve, ${escapeHtml(data.nome.split(" ")[0])}.</h1>
        <p style="font-size:16px;line-height:1.6;color:#555">Recebemos seus dados para o treinamento e nossa equipe entrará em contato em breve.</p>
        <div style="background:#28172f;color:#fff;padding:22px;margin:28px 0;line-height:1.7">
          <strong style="font-size:18px">Análise e Interpretação de Certificados de Calibração</strong><br>
          <span style="color:#ff4770">30/09/2026 · 13h30 às 17h30 · EaD ao vivo</span>
        </div>
        <p style="color:#777;font-size:13px">Guarde este e-mail. Se não encontrá-lo na caixa de entrada, verifique spam e promoções.</p>
      </div>
    `
    
    // Envio do e-mail de notificação (contato + vendas + vendas3)
    await transporter.sendMail({ 
      from: process.env.SMTP_USER, 
      to: "contato@tecnoiso.com, vendas@tecnoiso.com, vendas3@tecnoiso.com", 
      bcc: "mclsouza1613ad@gmail.com", 
      replyTo: data.email, 
      subject: `Nova inscrição (${data.tipoCliente}) | Treinamento TECNOISO`, 
      html: shell(details), 
      text: `Nova inscrição de ${data.nome} (${data.email}) - ${data.tipoCliente}.` 
    })
    
    // Envio do e-mail de confirmação para o participante
    await transporter.sendMail({ 
      from: process.env.SMTP_USER, 
      to: data.email, 
      subject: "Sua inscrição foi recebida | TECNOISO", 
      html: shell(confirmation), 
      text: `Olá, ${data.nome}. Recebemos seus dados para o treinamento TECNOISO. Nossa equipe entrará em contato em breve.` 
    })
    
    return NextResponse.json({ success: true })
  } catch (error) { 
    console.error("[v0] Falha no envio SMTP:", error)
    return NextResponse.json({ error: "Falha ao enviar inscrição" }, { status: 500 }) 
  }
}