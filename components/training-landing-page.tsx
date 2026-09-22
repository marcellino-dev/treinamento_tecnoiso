"use client"

import { FormEvent, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Clock3, FileCheck2, Menu, MessageCircle, Play, ShieldCheck, X } from "lucide-react"
import { RegistrationForm } from "./registration-form"

const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EB0NqotPMJPe2gFNYUawGVhOiVs2f4.png"
const learningItems = ["Estrutura e elementos de um certificado de calibração", "Interpretação de resultados e incertezas de medição", "Rastreabilidade metrológica e cadeia de calibração", "Critérios de aceitação e conformidade", "Boas práticas e ISO/IEC 17025", "Estudos de caso e exercícios práticos"]
const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }

const palavrasAnimadas = [
  "seguras",
  "assertivas",
  "precisas",
  "estratégicas",
  "embasadas",
  "inteligentes",
  "eficientes",
  "seguras e precisas"
]

const frasesHero = [
  {
    linha1: <><span className="text-[#ff2350]">1</span> treinamento</>,
    linha2: <><span className="text-[#ff2350]">4</span> horas de conteúdo</>,
    linha3: <><span className="text-[#ff2350]">100%</span> aplicável</>
  },
  {
    linha1: <>Domine a <span className="text-[#ff2350]">metrologia</span></>,
    linha2: <>Decisões <span className="text-[#ff2350]">seguras</span></>,
    linha3: <>e <span className="text-[#ff2350]">embasadas</span></>
  },
  {
    linha1: <>Análise <span className="text-[#ff2350]">precisa</span></>,
    linha2: <>Resultados <span className="text-[#ff2350]">confiáveis</span></>,
    linha3: <>na sua <span className="text-[#ff2350]">rotina</span></>
  },
  {
    linha1: <>Do certificado à <span className="text-[#ff2350]">decisão</span></>,
    linha2: <>com <span className="text-[#ff2350]">segurança</span></>,
    linha3: <>e <span className="text-[#ff2350]">estratégia</span></>
  },
  {
    linha1: <>Análise <span className="text-[#ff2350]">assertiva</span></>,
    linha2: <>Conformidade <span className="text-[#ff2350]">garantida</span></>,
    linha3: <>e <span className="text-[#ff2350]">eficiente</span></>
  }
]

export function TrainingLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [fraseIndex, setFraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % palavrasAnimadas.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frasesHero.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const modalidade = data.get("modalidade")
    const subject = encodeURIComponent(`Interesse no treinamento - ${modalidade}`)
    const body = encodeURIComponent(`Nova solicitação de inscrição\n\nNome: ${data.get("nome")}\nE-mail: ${data.get("email")}\nTelefone: ${data.get("telefone")}\nEmpresa: ${data.get("empresa") || "Não informado"}\nModalidade: ${modalidade}`)
    window.location.href = `mailto:contato@tecnoiso.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return <div className="min-h-screen overflow-hidden bg-white text-[#202020]">
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><a href="#inicio"><img src={logoUrl} alt="TECNOISO" className="h-9 w-auto brightness-0 invert" /></a><nav className="hidden items-center gap-8 text-xs font-semibold md:flex"><a href="#sobre" className="hover:text-[#ff2746]">O treinamento</a><a href="#conteudo" className="hover:text-[#ff2746]">Conteúdo</a><a href="#inscricao" className="hover:text-[#ff2746]">Inscreva-se</a><a href="#inscricao" className="rounded-full border border-white/70 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#27192f]">Quero minha vaga</a></nav><button className="rounded-lg p-2 text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav className="bg-[#26172d]/95 px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm"><a href="#sobre">O treinamento</a><a href="#conteudo">Conteúdo</a><a href="#inscricao">Inscreva-se</a></div></nav>}</header>
    <main>
      {/* BANNER AJUSTADO PARA MOBILE: padding reduzido e min-h menor */}
      <section id="inicio" className="relative min-h-[600px] overflow-hidden bg-[#28172f] text-white sm:min-h-[800px]">
        <img src="/tecnoiso-speaker-hero.png" alt="Palestrante em evento TECNOISO" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#170819]/90 via-[#210b22]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 sm:h-36"><svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true"><path d="M0 34 C220 112 420 140 690 102 C990 60 1150 10 1440 54 L1440 180 L0 180 Z" fill="white" /></svg></div>
        
        <div className="relative z-30 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-28 pt-32 sm:pb-40 sm:pt-48 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: .7 }}>
            
            {/* TÍTULO COM ALTURAS AJUSTADAS PARA CADA BREAKPOINT */}
            <h1 className="max-w-3xl text-4xl font-black leading-[.98] sm:text-5xl md:text-6xl lg:text-7xl">
              {/* 
                MOBILE (text-4xl): 3 linhas x 0.98 = 2.94em
                SM (text-5xl): 3 linhas x 0.98 = 2.94em  
                MD (text-6xl): 3 linhas x 0.98 = 2.94em
                LG (text-7xl): 3 linhas x 0.98 = 2.94em
                A altura "em" se ajusta automaticamente ao tamanho da fonte!
              */}
              <div className="relative grid h-[3em] overflow-hidden items-center sm:h-[3em] md:h-[3em] lg:h-[2.94em]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fraseIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="col-start-1 row-start-1 flex flex-col justify-center"
                  >
                    <div>{frasesHero[fraseIndex].linha1}</div>
                    <div>{frasesHero[fraseIndex].linha2}</div>
                    <div>{frasesHero[fraseIndex].linha3}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </h1>

            <p className="mt-4 max-w-xl text-base text-white/80 sm:mt-6 sm:text-lg">Análise e Interpretação de Certificados de Calibração para decisões técnicas mais seguras.</p>
            
            <p className="mt-3 font-mono text-xs text-white/90 sm:mt-5 sm:text-sm">[ 30/09/2026 · 13h30 às 17h30 · EaD ao vivo ]</p>

            {/* BOTÕES: no mobile ficam lado a lado com tamanho reduzido */}
            <div className="mt-6 flex flex-row gap-3 sm:mt-8">
              <a href="#inscricao" className="flex-1 rounded-full bg-[#e72d64] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide transition hover:-translate-y-1 hover:bg-[#ff4770] sm:flex-none sm:px-7 sm:py-3.5 sm:text-xs">Quero me inscrever</a>
              <a href="#conteudo" className="flex-1 rounded-full border border-[#e72d64] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-[#e72d64] sm:flex-none sm:px-7 sm:py-3.5 sm:text-xs">Ver conteúdo</a>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }} className="hidden">
            <iframe className="aspect-video w-full" src="https://www.youtube.com/embed/jtJQ-KI4SIc?controls=1&rel=0" title="Vídeo do treinamento TECNOISO" allow="autoplay; encrypted-media" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-bold"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e72d64]"><Play size={14} fill="white" /></span></div>
          </motion.div>
        </div>
      </section>
      
      <section id="sobre" className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold text-[#e72d64]">[ Sobre o treinamento ]</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Transforme certificados em decisões{" "}
              <span className="relative inline-block">
                <span className="invisible font-black" aria-hidden="true">seguras e precisas</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute left-0 top-0 text-[#e72d64] whitespace-nowrap"
                  >
                    {palavrasAnimadas[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-black/60">Aprenda a interpretar as informações que realmente importam em um certificado de calibração e aplique o conhecimento no dia seguinte.</p>
            <a href="#inscricao" className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/30 px-6 py-3 text-xs font-bold uppercase hover:border-[#e72d64] hover:text-[#e72d64]">Saiba mais <ArrowRight size={15} /></a>
          </div>
          <div className="relative">
            <img src="/tecnoiso-auditorio.png" alt="Participantes em auditório durante evento TECNOISO" className="h-72 w-full rounded-2xl object-cover object-right shadow-xl sm:h-96" />
            <span className="absolute -left-5 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-[#e72d64] text-white shadow-xl"><Play size={18} fill="white" /></span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-5 -mt-3 rounded-2xl bg-white p-7 shadow-[0_10px_45px_rgba(0,0,0,.12)] lg:mx-auto lg:max-w-6xl"><div className="grid items-center gap-7 md:grid-cols-[.8fr_1.2fr]"><p className="text-2xl font-black">Conteúdo que cabe na sua rotina e muda sua prática.</p><div className="grid grid-cols-2 gap-5 text-center sm:grid-cols-4"><div><strong className="text-4xl font-black text-[#e72d64]">04</strong><p className="text-xs text-black/50">Horas</p></div><div><strong className="text-4xl font-black text-[#e72d64]">06</strong><p className="text-xs text-black/50">Módulos</p></div><div><strong className="text-4xl font-black text-[#e72d64]">01</strong><p className="text-xs text-black/50">Turma</p></div><div><strong className="text-4xl font-black text-[#e72d64]">100%</strong><p className="text-xs text-black/50">EaD ao vivo</p></div></div></div></section>
      <section id="conteudo" className="bg-[#f7f7f7] px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-12 text-center"><h2 className="mt-3 text-4xl font-black sm:text-5xl">O que você vai aprender</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{learningItems.map((item, index) => <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} key={item} className="group rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"><span className="font-mono text-sm text-[#e72d64]">0{index + 1}</span><h3 className="mt-8 font-bold leading-snug">{item}</h3><div className="mt-6 h-1 w-10 bg-[#e72d64] transition-all group-hover:w-20" /></motion.article>)}</div></div></section>
      <section id="inscricao" className="bg-[#28172f] px-5 py-24 text-white lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold text-[#ff4770]">[ Inscreva-se ]</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Sua próxima decisão técnica começa aqui.</h2><div className="mt-8 space-y-4 text-sm text-white/70"><p className="flex gap-3"><Clock3 className="shrink-0 text-[#ff4770]" />30 de setembro de 2026 · 13h30 às 17h30</p><p className="flex gap-3"><Check className="shrink-0 text-[#ff4770]" />Certificado de participação incluso</p><p className="flex gap-3"><Check className="shrink-0 text-[#ff4770]" />Vagas limitadas para melhor interação</p></div></div><RegistrationForm /><form onSubmit={handleSubmit} className="hidden"><div className="grid gap-4 sm:grid-cols-2"><input required name="nome" placeholder="Nome completo *" className="rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#e72d64]" /><input required type="email" name="email" placeholder="E-mail *" className="rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#e72d64]" /><input required name="telefone" placeholder="Telefone *" className="rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#e72d64]" /><input name="empresa" placeholder="Empresa / Razão social" className="rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#e72d64]" /></div><fieldset><legend className="mb-3 text-sm font-bold">Você é: *</legend><div className="grid gap-3 sm:grid-cols-2"><label className="cursor-pointer rounded-lg border border-black/15 p-3 text-sm has-[:checked]:border-[#e72d64]"><input required type="radio" name="modalidade" value="Cliente avulso" className="mr-2 accent-[#e72d64]" />Cliente avulso</label><label className="cursor-pointer rounded-lg border border-black/15 p-3 text-sm has-[:checked]:border-[#e72d64]"><input required type="radio" name="modalidade" value="Cliente de contrato" className="mr-2 accent-[#e72d64]" />Cliente de contrato</label></div></fieldset><button className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#e72d64] px-6 py-4 font-bold text-white transition hover:bg-[#c91d50]">{submitted ? "Solicitação preparada" : "Quero garantir minha vaga"} <ArrowRight size={17} /></button><p className="text-center text-xs text-black/50">Ao enviar, seu aplicativo de e-mail será aberto para contato@tecnoiso.com.</p></form></div></section>
    </main><a href="https://wa.me/554797410269?text=Olá%20TECNOISO,%20quero%20saber%20mais%20sobre%20o%20treinamento." target="_blank" rel="noreferrer" aria-label="Falar com a TECNOISO pelo WhatsApp" className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"><MessageCircle size={27} /></a><footer className="bg-white px-5 py-10 text-center"><img src={logoUrl} alt="TECNOISO" className="mx-auto h-8 w-auto" /><p className="mt-3 text-xs text-black/50">Treinamentos em metrologia, qualidade e sistemas de gestão.</p><p className="mt-4 text-xs text-black/60">© 2026 TECNOISO TECNOLOGIA E SOLUÇÕES INDUSTRIAIS LTDA. | CNPJ: 17.459.428/0001-08</p></footer>
  </div>
}
export default TrainingLandingPage