"use client"

import { FormEvent, useState } from "react"

type FormData = { 
  nome: string; 
  email: string; 
  telefone: string; 
  cnpj: string; 
  razaoSocial: string; 
  setor: string; 
  telefoneEmpresa: string; 
  cidade: string; 
  estado: string;
  tipoCliente: string;
}
const initialData: FormData = { 
  nome: "", 
  email: "", 
  telefone: "", 
  cnpj: "", 
  razaoSocial: "", 
  setor: "", 
  telefoneEmpresa: "", 
  cidade: "", 
  estado: "",
  tipoCliente: ""
}
const states = ["AC - Acre", "AL - Alagoas", "AP - Amapá", "AM - Amazonas", "BA - Bahia", "CE - Ceará", "DF - Distrito Federal", "ES - Espírito Santo", "GO - Goiás", "MA - Maranhão", "MT - Mato Grosso", "MS - Mato Grosso do Sul", "MG - Minas Gerais", "PA - Pará", "PB - Paraíba", "PR - Paraná", "PE - Pernambuco", "PI - Piauí", "RJ - Rio de Janeiro", "RN - Rio Grande do Norte", "RS - Rio Grande do Sul", "RO - Rondônia", "RR - Roraima", "SC - Santa Catarina", "SP - São Paulo", "SE - Sergipe", "TO - Tocantins"]
const inputClass = "w-full rounded-lg border border-black/15 px-4 py-3 outline-none transition focus:border-[#e72d64]"
const onlyDigits = (value: string) => value.replace(/\D/g, "")
const formatCnpj = (value: string) => { const d = onlyDigits(value).slice(0, 14); return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4").replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5") }
const formatPhone = (value: string) => { const d = onlyDigits(value).slice(0, 11); if (d.length <= 2) return d ? `(${d}` : ""; if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`; const mobile = d.length >= 11; return `(${d.slice(0, 2)}) ${d.slice(2, mobile ? 7 : 6)}-${d.slice(mobile ? 7 : 6)}` }

export function RegistrationForm() {
  const [step, setStep] = useState(1); const [data, setData] = useState(initialData); const [cities, setCities] = useState<string[]>([]); const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const update = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData((current) => ({ ...current, [field]: event.target.value }))
  const updateFormatted = (field: "telefone" | "telefoneEmpresa" | "cnpj") => (event: React.ChangeEvent<HTMLInputElement>) => setData((current) => ({ ...current, [field]: field === "cnpj" ? formatCnpj(event.target.value) : formatPhone(event.target.value) }))
  async function loadCities(state: string) { const uf = state.slice(0, 2); setData((current) => ({ ...current, estado: state, cidade: "" })); if (!uf) return; try { const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`); const result = await response.json(); setCities(result.map((city: { nome: string }) => city.nome)) } catch { setCities([]) } }
  const next = (event: FormEvent) => { event.preventDefault(); if (data.nome.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && onlyDigits(data.telefone).length >= 10) setStep(2) }
  async function submit(event: FormEvent) { event.preventDefault(); if (onlyDigits(data.cnpj).length !== 14 || !data.razaoSocial.trim() || !data.setor.trim() || !data.tipoCliente) return; setStatus("sending"); try { const response = await fetch("/api/inscricao", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error(); setStatus("success") } catch { setStatus("error") } }
  if (status === "success") return <div className="rounded-2xl bg-white p-8 text-center text-[#202020] shadow-xl"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e72d64] text-3xl text-white">✓</div><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#e72d64]">Inscrição confirmada</p><h3 className="mt-2 text-3xl font-black">Até breve, {data.nome.split(" ")[0]}.</h3><p className="mx-auto mt-3 max-w-md text-sm text-black/60">Recebemos seus dados e enviamos a confirmação para <strong>{data.email}</strong>.</p></div>
  
  return <form onSubmit={step === 1 ? next : submit} className="grid gap-5 rounded-2xl bg-white p-6 text-[#202020] shadow-xl sm:p-9">
    <div className="flex items-center gap-3 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e72d64] text-white">{step}</span>{step === 1 ? "Dados pessoais" : "Dados da empresa"}<span className="ml-auto text-xs font-normal text-black/40">Etapa {step} de 2</span></div>
    
    {step === 1 ? 
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Nome completo *<input required value={data.nome} onChange={update("nome")} className={inputClass} placeholder="Seu nome completo" /></label>
        <label className="grid gap-2 text-sm font-semibold">E-mail *<input required type="email" value={data.email} onChange={update("email")} className={inputClass} placeholder="seu@email.com" /></label>
        
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          Telefone celular *
          <input 
            required 
            type="text" 
            inputMode="tel" 
            pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}" 
            title="Digite o telefone no formato (XX) XXXXX-XXXX"
            value={data.telefone} 
            onChange={updateFormatted("telefone")} 
            className={inputClass} 
            placeholder="(47) 99999-9999" 
          />
        </label>
        
        <button className="rounded-full bg-[#e72d64] px-6 py-3 text-sm font-bold text-white sm:col-span-2">Continuar para dados da empresa →</button>
      </div> 
    : 
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          CNPJ *
          <input 
            required 
            type="text"
            inputMode="numeric" 
            pattern="\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}" 
            title="Digite o CNPJ no formato 00.000.000/0000-00"
            value={data.cnpj} 
            onChange={updateFormatted("cnpj")} 
            className={inputClass} 
            placeholder="00.000.000/0000-00" 
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">Razão social *<input required value={data.razaoSocial} onChange={update("razaoSocial")} className={inputClass} placeholder="Nome da empresa" /></label>
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">Setor / Departamento *<input required value={data.setor} onChange={update("setor")} className={inputClass} placeholder="Ex.: Qualidade, Produção" /></label>
        
        {/* CAMPO: TIPO DE CLIENTE */}
        <fieldset className="grid gap-3 sm:col-span-2">
          <legend className="text-sm font-semibold">Você é: *</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Opção 1: Cliente de contrato */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/15 p-4 text-sm transition has-[:checked]:border-[#e72d64] has-[:checked]:bg-[#fff1f5]">
              <input 
                required 
                type="radio" 
                name="tipoCliente" 
                value="Cliente de contrato" 
                checked={data.tipoCliente === "Cliente de contrato"}
                onChange={update("tipoCliente")}
                className="mt-0.5 accent-[#e72d64]" 
              />
              <div className="flex-1">
                <strong className="block">Cliente de contrato</strong>
                <span className="mt-1 block text-xs text-black/50">Possui contrato ativo com a TECNOISO</span>
              </div>
            </label>
            
            {/* Opção 2: Cliente avulso - COM BADGE "SOB CONSULTA" */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/15 p-4 text-sm transition has-[:checked]:border-[#e72d64] has-[:checked]:bg-[#fff1f5]">
              <input 
                required 
                type="radio" 
                name="tipoCliente" 
                value="Cliente avulso" 
                checked={data.tipoCliente === "Cliente avulso"}
                onChange={update("tipoCliente")}
                className="mt-0.5 accent-[#e72d64]" 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <strong className="block">Cliente avulso</strong>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    Sob consulta
                  </span>
                </div>
                <span className="mt-1 block text-xs text-black/50">É cliente, mas não possui contrato ativo</span>
              </div>
            </label>
          </div>
          
          {/* ALERTA: aparece apenas quando "Cliente avulso" está selecionado */}
          {data.tipoCliente === "Cliente avulso" && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="mt-0.5 text-lg text-amber-600">⚠️</span>
              <div className="flex-1 text-amber-900">
                <strong className="block font-bold">Fique atento</strong>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  Como você não possui contrato ativo com a TECNOISO, o valor do treinamento precisa ser validado com o setor comercial.
                </p>
              </div>
            </div>
          )}
        </fieldset>

        <label className="grid gap-2 text-sm font-semibold">
          Telefone da empresa 
          <input 
            type="text" 
            inputMode="tel" 
            pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}" 
            title="Digite o telefone no formato (XX) XXXXX-XXXX"
            value={data.telefoneEmpresa} 
            onChange={updateFormatted("telefoneEmpresa")} 
            className={inputClass} 
            placeholder="(47) 99999-9999" 
          />
        </label>
        
        <label className="grid gap-2 text-sm font-semibold">Estado <input list="estados-brasil" value={data.estado} onChange={(event) => loadCities(event.target.value)} className={inputClass} placeholder="Digite ou selecione o estado" /><datalist id="estados-brasil">{states.map((state) => <option key={state} value={state} />)}</datalist></label>
        <label className="grid gap-2 text-sm font-semibold">Cidade <input list="cidades-brasil" value={data.cidade} onChange={update("cidade")} className={inputClass} placeholder="Digite ou selecione a cidade" /><datalist id="cidades-brasil">{cities.map((city) => <option key={city} value={city} />)}</datalist></label>
        <div className="flex gap-3 sm:col-span-2"><button type="button" onClick={() => setStep(1)} className="rounded-full border border-black/15 px-5 py-3 text-sm font-bold">Voltar</button><button disabled={status === "sending"} className="flex-1 rounded-full bg-[#e72d64] px-6 py-3 text-sm font-bold text-white">{status === "sending" ? "Enviando..." : "Finalizar inscrição →"}</button></div>
        {status === "error" && <p className="text-sm font-semibold text-red-600 sm:col-span-2">Não foi possível enviar. Tente novamente.</p>}
      </div>
    }
  </form>
}

export default RegistrationForm