import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Trash2, Share2, LayoutDashboard, BarChart2, GitMerge, Calendar, Heart, PieChart, Settings, HelpCircle, Info, ChevronRight, CheckCircle2, Link } from "lucide-react";

// ─── BANDEIRAS via flagcdn.com ────────────────────────────────────────────────
const FLAG_ISO = {
  MEX:"mx", RSA:"za", KOR:"kr", CZE:"cz",
  CAN:"ca", BIH:"ba", QAT:"qa", SUI:"ch",
  BRA:"br", MAR:"ma", HAI:"ht",
  USA:"us", PAR:"py", AUS:"au", TUR:"tr",
  GER:"de", CUW:"cw", CIV:"ci", ECU:"ec",
  NED:"nl", JPN:"jp", SWE:"se", TUN:"tn",
  BEL:"be", EGY:"eg", IRN:"ir", NZL:"nz",
  ESP:"es", CPV:"cv", KSA:"sa", URU:"uy",
  FRA:"fr", SEN:"sn", IRQ:"iq", NOR:"no",
  ARG:"ar", ALG:"dz", AUT:"at", JOR:"jo",
  POR:"pt", COD:"cd", UZB:"uz", COL:"co",
  CRO:"hr", GHA:"gh", PAN:"pa",
};

// Fallback emoji para nações sem ISO padrão
const FLAG_EMOJI = { SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" };

function Flag({ code, size = 20 }) {
  const iso = FLAG_ISO[code];
  const emoji = FLAG_EMOJI[code];
  const w = Math.round(size * 1.45);

  if (emoji && !iso) {
    return (
      <span style={{ fontSize: size * 0.85, lineHeight:1, flexShrink:0, display:"inline-block", width:w, textAlign:"center" }}>
        {emoji}
      </span>
    );
  }
  if (!iso) return <span style={{ width:w, height:size, display:"inline-block", background:"#e5e7eb", borderRadius:3 }} />;

  return (
    <img
      src={"https://flagcdn.com/w40/" + iso + ".png"}
      alt={code}
      width={w}
      height={size}
      style={{ objectFit:"cover", borderRadius:3, flexShrink:0, display:"block", border:"1px solid #e5e7eb" }}
      onError={e => {
        // Se flagcdn falhar, tenta countryflags.io como fallback
        e.target.onerror = null;
        e.target.style.display = "none";
      }}
    />
  );
}

// ─── DADOS ────────────────────────────────────────────────────────────────────
const GROUP_PAIRINGS = {
  A:[[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  B:[[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  C:[[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  D:[[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  E:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  F:[[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  G:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  H:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  I:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  J:[[2,3],[0,1],[3,1],[0,2],[3,0],[1,2]],
  K:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  L:[[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
};

const GROUP_FIXTURES_META = {
  A:[{date:"11 jun",time:"16:00"},{date:"11 jun",time:"23:00"},{date:"18 jun",time:"13:00"},{date:"18 jun",time:"22:00"},{date:"24 jun",time:"22:00"},{date:"24 jun",time:"22:00"}],
  B:[{date:"12 jun",time:"16:00"},{date:"13 jun",time:"16:00"},{date:"18 jun",time:"16:00"},{date:"18 jun",time:"19:00"},{date:"24 jun",time:"16:00"},{date:"24 jun",time:"16:00"}],
  C:[{date:"13 jun",time:"19:00"},{date:"13 jun",time:"22:00"},{date:"19 jun",time:"19:00"},{date:"19 jun",time:"21:30"},{date:"24 jun",time:"19:00"},{date:"24 jun",time:"19:00"}],
  D:[{date:"12 jun",time:"22:00"},{date:"13 jun",time:"01:00"},{date:"19 jun",time:"01:00"},{date:"19 jun",time:"16:00"},{date:"25 jun",time:"23:00"},{date:"25 jun",time:"23:00"}],
  E:[{date:"14 jun",time:"14:00"},{date:"14 jun",time:"20:00"},{date:"20 jun",time:"17:00"},{date:"20 jun",time:"21:00"},{date:"25 jun",time:"17:00"},{date:"25 jun",time:"17:00"}],
  F:[{date:"14 jun",time:"17:00"},{date:"14 jun",time:"23:00"},{date:"20 jun",time:"01:00"},{date:"20 jun",time:"14:00"},{date:"25 jun",time:"20:00"},{date:"25 jun",time:"20:00"}],
  G:[{date:"15 jun",time:"16:00"},{date:"15 jun",time:"22:00"},{date:"21 jun",time:"16:00"},{date:"21 jun",time:"22:00"},{date:"27 jun",time:"00:00"},{date:"27 jun",time:"00:00"}],
  H:[{date:"15 jun",time:"13:00"},{date:"15 jun",time:"19:00"},{date:"21 jun",time:"13:00"},{date:"21 jun",time:"19:00"},{date:"26 jun",time:"21:00"},{date:"26 jun",time:"21:00"}],
  I:[{date:"16 jun",time:"16:00"},{date:"16 jun",time:"19:00"},{date:"22 jun",time:"18:00"},{date:"22 jun",time:"21:00"},{date:"26 jun",time:"16:00"},{date:"26 jun",time:"16:00"}],
  J:[{date:"16 jun",time:"01:00"},{date:"16 jun",time:"22:00"},{date:"22 jun",time:"00:00"},{date:"22 jun",time:"14:00"},{date:"27 jun",time:"23:00"},{date:"27 jun",time:"23:00"}],
  K:[{date:"17 jun",time:"14:00"},{date:"17 jun",time:"23:00"},{date:"23 jun",time:"14:00"},{date:"23 jun",time:"23:00"},{date:"27 jun",time:"20:30"},{date:"27 jun",time:"20:30"}],
  L:[{date:"17 jun",time:"17:00"},{date:"17 jun",time:"20:00"},{date:"23 jun",time:"17:00"},{date:"23 jun",time:"20:00"},{date:"27 jun",time:"18:00"},{date:"27 jun",time:"18:00"}],
};

const GROUPS_RAW = [
  {letter:"A",teams:[{code:"MEX",name:"México"},{code:"RSA",name:"África do Sul"},{code:"KOR",name:"Coreia do Sul"},{code:"CZE",name:"Tchéquia"}]},
  {letter:"B",teams:[{code:"CAN",name:"Canadá"},{code:"BIH",name:"Bósnia"},{code:"QAT",name:"Catar"},{code:"SUI",name:"Suíça"}]},
  {letter:"C",teams:[{code:"BRA",name:"Brasil"},{code:"MAR",name:"Marrocos"},{code:"HAI",name:"Haiti"},{code:"SCO",name:"Escócia"}]},
  {letter:"D",teams:[{code:"USA",name:"Estados Unidos"},{code:"PAR",name:"Paraguai"},{code:"AUS",name:"Austrália"},{code:"TUR",name:"Turquia"}]},
  {letter:"E",teams:[{code:"GER",name:"Alemanha"},{code:"CUW",name:"Curaçao"},{code:"CIV",name:"Costa do Marfim"},{code:"ECU",name:"Equador"}]},
  {letter:"F",teams:[{code:"NED",name:"Holanda"},{code:"JPN",name:"Japão"},{code:"SWE",name:"Suécia"},{code:"TUN",name:"Tunísia"}]},
  {letter:"G",teams:[{code:"BEL",name:"Bélgica"},{code:"EGY",name:"Egito"},{code:"IRN",name:"Irã"},{code:"NZL",name:"Nova Zelândia"}]},
  {letter:"H",teams:[{code:"ESP",name:"Espanha"},{code:"CPV",name:"Cabo Verde"},{code:"KSA",name:"Arábia Saudita"},{code:"URU",name:"Uruguai"}]},
  {letter:"I",teams:[{code:"FRA",name:"França"},{code:"SEN",name:"Senegal"},{code:"IRQ",name:"Iraque"},{code:"NOR",name:"Noruega"}]},
  {letter:"J",teams:[{code:"ARG",name:"Argentina"},{code:"ALG",name:"Argélia"},{code:"AUT",name:"Áustria"},{code:"JOR",name:"Jordânia"}]},
  {letter:"K",teams:[{code:"POR",name:"Portugal"},{code:"COD",name:"RD Congo"},{code:"UZB",name:"Uzbequistão"},{code:"COL",name:"Colômbia"}]},
  {letter:"L",teams:[{code:"ENG",name:"Inglaterra"},{code:"CRO",name:"Croácia"},{code:"GHA",name:"Gana"},{code:"PAN",name:"Panamá"}]},
];

const GROUPS = GROUPS_RAW.map((group) => ({
  ...group,
  fixtures: GROUP_PAIRINGS[group.letter].map((pair, idx) => ({
    id:`${group.letter}-${idx}`, home:pair[0], away:pair[1],
    meta:GROUP_FIXTURES_META[group.letter][idx],
  })),
}));

// ─── LÓGICA DE CLASSIFICAÇÃO ──────────────────────────────────────────────────
const collator = new Intl.Collator("pt-BR", { sensitivity:"base" });

function parseGoals(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

function createInitialScores() {
  const initial = {};
  for (const group of GROUPS) {
    initial[group.letter] = {};
    for (const fixture of group.fixtures) {
      initial[group.letter][fixture.id] = { home:"", away:"" };
    }
  }
  return initial;
}

function statTemplate(team) {
  return { ...team, j:0, v:0, e:0, d:0, gp:0, gc:0, sg:0, pts:0 };
}

// Desempate: Pts → SG → GP → Confronto direto → Alfabético
function sortWithHeadToHead(stats, fixtures, scores, groupLetter, allTeams) {
  return [...stats].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.sg !== a.sg) return b.sg - a.sg;
    if (b.gp !== a.gp) return b.gp - a.gp;
    // Confronto direto
    const h2h = getH2H([a, b], fixtures, scores, groupLetter, allTeams);
    const ha = h2h[a.code], hb = h2h[b.code];
    if (hb.pts !== ha.pts) return hb.pts - ha.pts;
    if (hb.sg !== ha.sg) return hb.sg - ha.sg;
    if (hb.gp !== ha.gp) return hb.gp - ha.gp;
    return collator.compare(a.name, b.name);
  });
}

function computeStandings(scores) {
  return GROUPS.map((group) => {
    // Cria stats indexados por posição DO TIME no array (0-3)
    const stats = group.teams.map(statTemplate);

    for (const fixture of group.fixtures) {
      const result = scores[group.letter]?.[fixture.id];
      if (!result) continue;
      const hg = parseGoals(result.home);
      const ag = parseGoals(result.away);
      if (hg === null || ag === null) continue;

      // fixture.home e fixture.away são índices do array group.teams
      const home = stats[fixture.home];
      const away = stats[fixture.away];
      if (!home || !away) continue;

      home.j += 1; away.j += 1;
      home.gp += hg; home.gc += ag;
      away.gp += ag; away.gc += hg;

      if (hg > ag)      { home.v += 1; away.d += 1; home.pts += 3; }
      else if (ag > hg) { away.v += 1; home.d += 1; away.pts += 3; }
      else              { home.e += 1; away.e += 1; home.pts += 1; away.pts += 1; }
    }

    for (const item of stats) item.sg = item.gp - item.gc;

    // Ordena com desempate por confronto direto
    const sorted = sortWithHeadToHead(stats, group.fixtures, scores, group.letter, group.teams);
    return { ...group, standings: sorted };
  });
}

// getH2H recebe o array de times do grupo para resolver índices corretamente
function getH2H(teamsSubset, fixtures, scores, groupLetter, allTeams) {
  const codes = new Set(teamsSubset.map(t => t.code));
  const h2h = {};
  teamsSubset.forEach(t => { h2h[t.code] = { pts:0, gp:0, gc:0, sg:0 }; });

  for (const fixture of fixtures) {
    // Resolve pelo índice numérico usando allTeams (array original do grupo)
    const homeTeam = allTeams[fixture.home];
    const awayTeam = allTeams[fixture.away];
    if (!homeTeam || !awayTeam) continue;
    if (!codes.has(homeTeam.code) || !codes.has(awayTeam.code)) continue;

    const result = scores[groupLetter]?.[fixture.id];
    if (!result) continue;
    const hg = parseGoals(result.home), ag = parseGoals(result.away);
    if (hg === null || ag === null) continue;

    h2h[homeTeam.code].gp += hg; h2h[homeTeam.code].gc += ag;
    h2h[awayTeam.code].gp += ag; h2h[awayTeam.code].gc += hg;
    if (hg > ag)      { h2h[homeTeam.code].pts += 3; }
    else if (ag > hg) { h2h[awayTeam.code].pts += 3; }
    else { h2h[homeTeam.code].pts += 1; h2h[awayTeam.code].pts += 1; }
  }
  for (const k of Object.keys(h2h)) h2h[k].sg = h2h[k].gp - h2h[k].gc;
  return h2h;
}

// ─── MATA-MATA DINÂMICO ───────────────────────────────────────────────────────
// Mapa de quem avança em cada slot do chaveamento conforme classificação
function resolveSlot(slot, standings) {
  const byLetter = {};
  for (const g of standings) byLetter[g.letter] = g.standings;

  // "1A" = 1º do grupo A, "2B" = 2º do grupo B
  const m1 = slot.match(/^([12])([A-L])$/);
  if (m1) {
    const pos = parseInt(m1[1]) - 1;
    const grp = m1[2];
    const grpData = byLetter[grp];
    const team = grpData?.[pos];
    // Só mostra se o grupo tiver pelo menos 1 jogo jogado
    const hasGames = grpData?.some(t => t.j > 0);
    if (team && hasGames) return { code: team.code, name: team.name };
    return null;
  }
  // Melhores terceiros: por ora placeholder
  if (slot.startsWith("3")) return null;
  return null;
}

// Estrutura do chaveamento: cada jogo tem slots que resolvem para times
// Mapeamento dos 16 avos conforme PDF
const R16_SLOTS = [
  { id:"J73", date:"28 jun", homeSlot:"2A", awaySlot:"2B" },
  { id:"J74", date:"29 jun", homeSlot:"1E", awaySlot:"3ABC" },
  { id:"J75", date:"29 jun", homeSlot:"1F", awaySlot:"2C" },
  { id:"J76", date:"29 jun", homeSlot:"1C", awaySlot:"2F" },
  { id:"J77", date:"30 jun", homeSlot:"1I", awaySlot:"3CDF" },
  { id:"J78", date:"30 jun", homeSlot:"2E", awaySlot:"2I" },
  { id:"J79", date:"30 jun", homeSlot:"1A", awaySlot:"3CEF" },
  { id:"J80", date:"01 jul", homeSlot:"1L", awaySlot:"3EHI" },
  { id:"J81", date:"01 jul", homeSlot:"1D", awaySlot:"3BEF" },
  { id:"J82", date:"01 jul", homeSlot:"1G", awaySlot:"3AEH" },
  { id:"J83", date:"02 jul", homeSlot:"2K", awaySlot:"2L" },
  { id:"J84", date:"02 jul", homeSlot:"1H", awaySlot:"2J" },
  { id:"J85", date:"02 jul", homeSlot:"1B", awaySlot:"3EFG" },
  { id:"J86", date:"03 jul", homeSlot:"1J", awaySlot:"2H" },
  { id:"J87", date:"03 jul", homeSlot:"1K", awaySlot:"3DEI" },
  { id:"J88", date:"03 jul", homeSlot:"2D", awaySlot:"2G" },
];

// Oitavas = vencedores dos 16-avos agrupados
const OITAVAS_STRUCTURE = [
  { id:"J89", date:"04 jul", from:[0,3] },  // V74 x V77
  { id:"J90", date:"04 jul", from:[2,1] },  // V73 x V75 (ajuste conforme PDF)
  { id:"J91", date:"05 jul", from:[4,6] },
  { id:"J92", date:"05 jul", from:[7,9] },
  { id:"J93", date:"06 jul", from:[10,11] },
  { id:"J94", date:"06 jul", from:[8,13] },
  { id:"J95", date:"07 jul", from:[12,15] },
  { id:"J96", date:"07 jul", from:[14,5] },
];

function KnockoutTeam({ slot, standings, label, side = "home" }) {
  const team = slot ? resolveSlot(slot, standings) : null;
  const hasTeam = !!team;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6,
      padding:"5px 8px",
      borderBottom: side === "home" ? "1px solid #e5e7eb" : "none",
      minHeight:30,
    }}>
      {hasTeam ? (
        <>
          <Flag code={team.code} size={16} />
          <span style={{ fontSize:11, fontWeight:600, color:"#111827", flex:1 }}>{team.name}</span>
        </>
      ) : (
        <span style={{ fontSize:10, color:"#9ca3af", flex:1, fontStyle:"italic" }}>{label}</span>
      )}
      <span style={{ fontSize:10, color:"#d1d5db", marginLeft:"auto" }}>—</span>
    </div>
  );
}

function KnockoutCard({ id, date, homeSlot, awaySlot, standings, isFinal = false }) {
  return (
    <div style={{
      background: isFinal ? "#111827" : "#f9fafb",
      borderRadius:8,
      border: isFinal ? "2px solid #22c55e" : "1px solid #e5e7eb",
      overflow:"hidden",
      minWidth:130,
    }}>
      <div style={{ padding:"5px 8px", borderBottom:"1px solid rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize:9, fontWeight:800, color: isFinal ? "#22c55e" : "#9ca3af" }}>{id}</span>
        {date && <span style={{ fontSize:9, color:"#9ca3af", marginLeft:4 }}>{date}</span>}
      </div>
      <KnockoutTeam slot={homeSlot} standings={standings} label={homeSlot} side="home" />
      <KnockoutTeam slot={awaySlot} standings={standings} label={awaySlot} side="away" />
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────
function ViewClassificacao({ standings }) {
  const isMobile = window.innerWidth < 700;
  return (
    <div style={{ padding:isMobile?12:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Classificação Geral</h2>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(400px,1fr))", gap:12 }}>
        {standings.map((group) => (
          <div key={group.letter} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" }}>
            <div style={{ background:"#111827", padding:"8px 12px" }}>
              <span style={{ background:"#22c55e", color:"#fff", fontWeight:800, fontSize:11, padding:"2px 8px", borderRadius:4 }}>GRUPO {group.letter}</span>
            </div>
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"22px 1fr 26px 26px 26px 26px 26px 26px 26px 34px", gap:2, padding:"5px 10px", fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" }}>
                <div>#</div><div>Seleção</div>
                <div style={{textAlign:"center"}}>J</div><div style={{textAlign:"center"}}>V</div>
                <div style={{textAlign:"center"}}>E</div><div style={{textAlign:"center"}}>D</div>
                <div style={{textAlign:"center"}}>GP</div><div style={{textAlign:"center"}}>GC</div>
                <div style={{textAlign:"center"}}>SG</div><div style={{textAlign:"center"}}>Pts</div>
              </div>
              {group.standings.map((team, idx) => (
                <div key={team.code} style={{ display:"grid", gridTemplateColumns:"22px 1fr 26px 26px 26px 26px 26px 26px 26px 34px", gap:2, padding:"7px 10px", alignItems:"center", background:idx<2?"#f0fdf4":idx===2?"#fffbeb":"transparent", borderTop:"1px solid #f3f4f6" }}>
                  <div style={{ width:18,height:18,borderRadius:"50%",background:idx<2?"#22c55e":idx===2?"#f59e0b":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:idx<2||idx===2?"#fff":"#6b7280" }}>{idx+1}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,minWidth:0 }}>
                    <Flag code={team.code} size={18} />
                    <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{team.name}</span>
                  </div>
                  {[team.j,team.v,team.e,team.d,team.gp,team.gc,team.sg].map((v,i)=>(
                    <div key={i} style={{textAlign:"center",fontSize:11,color:i===6&&v>0?"#15803d":i===6&&v<0?"#dc2626":"#374151"}}>{v}</div>
                  ))}
                  <div style={{ textAlign:"center",fontSize:12,fontWeight:800,color:idx<2?"#15803d":"#111827" }}>{team.pts}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewTodosJogos({ standings, scores, setScore }) {
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Todos os Jogos</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {standings.map((group) => (
          <div key={group.letter} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden" }}>
            <div style={{ background:"#111827", padding:"8px 12px" }}>
              <span style={{ background:"#22c55e", color:"#fff", fontWeight:800, fontSize:11, padding:"2px 8px", borderRadius:4 }}>GRUPO {group.letter}</span>
            </div>
            <div style={{ padding:"4px 16px" }}>
              {group.fixtures.map((fixture) => {
                const result = scores[group.letter][fixture.id];
                const homeTeam = group.teams[fixture.home];
                const awayTeam = group.teams[fixture.away];
                const filled = parseGoals(result.home)!==null && parseGoals(result.away)!==null;
                return (
                  <div key={fixture.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ color:"#6b7280", fontSize:10, width:105, flexShrink:0 }}>{fixture.meta.date} • {fixture.meta.time}</span>
                    <div style={{ display:"flex",alignItems:"center",gap:4,flex:1,justifyContent:"flex-end" }}>
                      <span style={{ fontSize:12,fontWeight:600 }}>{homeTeam.name}</span>
                      <Flag code={homeTeam.code} size={20} />
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:3,flexShrink:0 }}>
                      <input type="number" min="0" inputMode="numeric" value={result.home} onChange={e=>setScore(group.letter,fixture.id,"home",e.target.value)}
                        style={{ width:32,height:28,textAlign:"center",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,fontWeight:700,outline:"none",background:filled?"#dcfce7":"#f9fafb" }} placeholder="0" />
                      <span style={{ color:"#9ca3af",fontSize:11,fontWeight:700 }}>x</span>
                      <input type="number" min="0" inputMode="numeric" value={result.away} onChange={e=>setScore(group.letter,fixture.id,"away",e.target.value)}
                        style={{ width:32,height:28,textAlign:"center",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,fontWeight:700,outline:"none",background:filled?"#dcfce7":"#f9fafb" }} placeholder="0" />
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:4,flex:1 }}>
                      <Flag code={awayTeam.code} size={20} />
                      <span style={{ fontSize:12,fontWeight:600 }}>{awayTeam.name}</span>
                    </div>
                    {filled && <CheckCircle2 size={14} style={{ color:"#22c55e", flexShrink:0 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewMataMata({ standings }) {
  const rounds16 = R16_SLOTS;
  const oitavas = OITAVAS_STRUCTURE;

  const r16Cards = rounds16.map(m => ({
    ...m,
    homeTeam: resolveSlot(m.homeSlot, standings),
    awayTeam: resolveSlot(m.awaySlot, standings),
  }));

  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:"#111827" }}>Mata-mata</h2>
      <p style={{ margin:"0 0 20px", fontSize:12, color:"#6b7280" }}>Chaveamento atualizado automaticamente conforme os resultados.</p>
      <div style={{ overflowX:"auto" }}>
        <div style={{ display:"flex", gap:12, minWidth:1000, alignItems:"flex-start" }}>
          {/* 16-avos */}
          <div style={{ minWidth:155 }}>
            <RoundHeader label="16-AVOS DE FINAL" dates="28 JUN – 03 JUL" />
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {r16Cards.map(m => (
                <div key={m.id} style={{ background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", overflow:"hidden" }}>
                  <div style={{ padding:"4px 8px", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:9,fontWeight:800,color:"#9ca3af" }}>{m.id}</span>
                    <span style={{ fontSize:9,color:"#9ca3af",marginLeft:4 }}>{m.date}</span>
                  </div>
                  <TeamSlotRow team={m.homeTeam} slot={m.homeSlot} side="home" />
                  <TeamSlotRow team={m.awayTeam} slot={m.awaySlot} side="away" />
                </div>
              ))}
            </div>
          </div>

          {/* Oitavas */}
          <div style={{ minWidth:145 }}>
            <RoundHeader label="OITAVAS DE FINAL" dates="04 JUL – 07 JUL" />
            <div style={{ display:"flex", flexDirection:"column", gap:6, justifyContent:"space-around", paddingTop:8 }}>
              {oitavas.map((m, i) => {
                const homeTeam = r16Cards[m.from[0]]?.homeTeam || r16Cards[m.from[0]]?.awayTeam;
                return (
                  <div key={m.id} style={{ background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", overflow:"hidden" }}>
                    <div style={{ padding:"4px 8px", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ fontSize:9,fontWeight:800,color:"#9ca3af" }}>{m.id}</span>
                      <span style={{ fontSize:9,color:"#9ca3af",marginLeft:4 }}>{m.date}</span>
                    </div>
                    <TeamSlotRow team={null} slot={`V${R16_SLOTS[m.from[0]]?.id?.replace("J","")}`} side="home" />
                    <TeamSlotRow team={null} slot={`V${R16_SLOTS[m.from[1]]?.id?.replace("J","")}`} side="away" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quartas */}
          <div style={{ minWidth:140 }}>
            <RoundHeader label="QUARTAS DE FINAL" dates="09 JUL – 11 JUL" />
            <div style={{ display:"flex", flexDirection:"column", gap:6, justifyContent:"center", paddingTop:48 }}>
              {[{id:"J97",date:"09 jul"},{id:"J98",date:"10 jul"},{id:"J99",date:"11 jul"},{id:"J100",date:"11 jul"}].map(m => (
                <StaticMatch key={m.id} id={m.id} date={m.date} />
              ))}
            </div>
          </div>

          {/* Semis */}
          <div style={{ minWidth:135 }}>
            <RoundHeader label="SEMIFINAIS" dates="14 JUL – 15 JUL" />
            <div style={{ display:"flex", flexDirection:"column", gap:6, justifyContent:"center", paddingTop:128 }}>
              {[{id:"J101",date:"14 jul"},{id:"J102",date:"15 jul"}].map(m => (
                <StaticMatch key={m.id} id={m.id} date={m.date} />
              ))}
            </div>
          </div>

          {/* Final */}
          <div style={{ minWidth:155, flex:1 }}>
            <RoundHeader label="FINAL" dates="19 JUL" />
            <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:250 }}>
              <div style={{ background:"#111827", borderRadius:8, border:"2px solid #22c55e", overflow:"hidden" }}>
                <div style={{ padding:"5px 10px", borderBottom:"1px solid #1f2937" }}>
                  <span style={{ fontSize:9,fontWeight:800,color:"#22c55e" }}>J104</span>
                  <span style={{ fontSize:9,color:"#6b7280",marginLeft:4 }}>19 jul • 16:00</span>
                </div>
                <div style={{ padding:"6px 10px 0", borderBottom:"1px solid #1f2937", minHeight:28, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11,color:"#9ca3af",fontStyle:"italic" }}>W101 <span style={{ color:"#374151" }}>—</span></span>
                </div>
                <div style={{ padding:"6px 10px", minHeight:28, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11,color:"#9ca3af",fontStyle:"italic" }}>W102 <span style={{ color:"#374151" }}>—</span></span>
                </div>
              </div>
              <div style={{ background:"#fff7ed", borderRadius:8, border:"1px solid #fed7aa", overflow:"hidden", marginTop:8 }}>
                <div style={{ padding:"5px 10px", borderBottom:"1px solid #fed7aa" }}>
                  <span style={{ fontSize:8,fontWeight:800,color:"#92400e",textTransform:"uppercase" }}>Disputa de 3º Lugar</span>
                </div>
                <div style={{ padding:"4px 10px", fontSize:9, color:"#78350f",fontWeight:600 }}>18 jul • 18:00 • Miami</div>
                <div style={{ padding:"4px 10px 0", borderBottom:"1px solid #fed7aa", minHeight:26, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11,color:"#9ca3af" }}>L101 <span style={{ color:"#d1d5db" }}>—</span></span>
                </div>
                <div style={{ padding:"4px 10px 6px", minHeight:26, display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11,color:"#9ca3af" }}>L102 <span style={{ color:"#d1d5db" }}>—</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundHeader({ label, dates }) {
  return (
    <div style={{ textAlign:"center", paddingBottom:10 }}>
      <div style={{ fontSize:9, fontWeight:800, letterSpacing:0.8, color:"#374151", textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontSize:8, color:"#9ca3af", marginTop:2 }}>{dates}</div>
    </div>
  );
}

function TeamSlotRow({ team, slot, side }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 8px",
      borderBottom: side === "home" ? "1px solid #f3f4f6" : "none", minHeight:28 }}>
      {team ? (
        <>
          <Flag code={team.code} size={16} />
          <span style={{ fontSize:10, fontWeight:600, color:"#111827", flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{team.name}</span>
        </>
      ) : (
        <span style={{ fontSize:10, color:"#9ca3af", flex:1, fontStyle:"italic" }}>{slot}</span>
      )}
      <span style={{ fontSize:10, color:"#d1d5db" }}>—</span>
    </div>
  );
}

function StaticMatch({ id, date, homeLbl, awayLbl }) {
  return (
    <div style={{ background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", overflow:"hidden" }}>
      <div style={{ padding:"4px 8px", borderBottom:"1px solid #f3f4f6" }}>
        <span style={{ fontSize:9,fontWeight:800,color:"#9ca3af" }}>{id}</span>
        <span style={{ fontSize:9,color:"#9ca3af",marginLeft:4 }}>{date}</span>
      </div>
      <div style={{ padding:"5px 8px", borderBottom:"1px solid #f3f4f6", fontSize:10, color:"#9ca3af", fontStyle:"italic", minHeight:28, display:"flex", alignItems:"center" }}>
        {homeLbl || "—"} <span style={{ marginLeft:"auto", color:"#d1d5db" }}>—</span>
      </div>
      <div style={{ padding:"5px 8px", fontSize:10, color:"#9ca3af", fontStyle:"italic", minHeight:28, display:"flex", alignItems:"center" }}>
        {awayLbl || "—"} <span style={{ marginLeft:"auto", color:"#d1d5db" }}>—</span>
      </div>
    </div>
  );
}

function ViewFavoritos({ standings }) {
  const firsts = standings.map(g => g.standings[0]);
  const seconds = standings.map(g => g.standings[1]);
  const thirds = standings.map(g => ({ ...g.standings[2], group: g.letter }))
    .filter(t => t.j > 0).sort((a,b) => b.pts-a.pts || b.sg-a.sg || b.gp-a.gp).slice(0,8);
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Classificados</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {[{label:"🥇 1ºs colocados",teams:firsts,color:"#22c55e"},{label:"🥈 2ºs colocados",teams:seconds,color:"#3b82f6"},{label:"🥉 Melhores 3ºs (8)",teams:thirds,color:"#f59e0b"}].map(({label,teams,color})=>(
          <div key={label} style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>{label}</div>
            {teams.map(team => team && (
              <div key={team.code} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#f9fafb",borderRadius:8,borderLeft:`3px solid ${color}`,marginBottom:4 }}>
                <Flag code={team.code} size={20} />
                <span style={{ fontSize:12,fontWeight:600,flex:1 }}>{team.name}</span>
                <span style={{ fontSize:11,color:"#6b7280",fontWeight:700 }}>{team.pts}pts</span>
              </div>
            ))}
            {teams.filter(Boolean).length === 0 && (
              <div style={{ fontSize:12, color:"#9ca3af", textAlign:"center", padding:12 }}>Preencha os resultados</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewEstatisticas({ standings, scores }) {
  const allTeams = standings.flatMap(g => g.standings);
  const topGols = [...allTeams].sort((a,b) => b.gp-a.gp).slice(0,10);
  const topPts = [...allTeams].sort((a,b) => b.pts-a.pts||b.sg-a.sg).slice(0,10);
  const totalPlayed = GROUPS.reduce((acc,group) => acc+group.fixtures.filter(f=>{
    const r=scores[group.letter][f.id]; return parseGoals(r.home)!==null&&parseGoals(r.away)!==null;
  }).length,0);
  const totalGols = allTeams.reduce((s,t)=>s+t.gp,0);
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Estatísticas</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:20 }}>
        {[{label:"Jogos realizados",val:`${totalPlayed}/${GROUPS.length*6}`},{label:"Total de gols",val:totalGols},{label:"Média por jogo",val:totalPlayed>0?(totalGols/totalPlayed).toFixed(1):"—"}].map(({label,val})=>(
          <div key={label} style={{ background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:16 }}>
            <div style={{ fontSize:10,color:"#6b7280",fontWeight:600,textTransform:"uppercase" }}>{label}</div>
            <div style={{ fontSize:24,fontWeight:800,color:"#111827",marginTop:4 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[{title:"Top 10 — Pontos",teams:topPts,val:t=>t.pts},{title:"Top 10 — Gols Pró",teams:topGols,val:t=>t.gp}].map(({title,teams,val})=>(
          <div key={title} style={{ background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:16 }}>
            <div style={{ fontSize:14,fontWeight:700,marginBottom:12 }}>{title}</div>
            {teams.map((team,idx)=>(
              <div key={team.code} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid #f3f4f6" }}>
                <span style={{ width:16,fontSize:10,color:"#9ca3af",fontWeight:700 }}>{idx+1}</span>
                <Flag code={team.code} size={18} />
                <span style={{ fontSize:12,fontWeight:600,flex:1 }}>{team.name}</span>
                <span style={{ fontSize:13,fontWeight:800,color:"#22c55e" }}>{val(team)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewConfiguracoes({ resetAll }) {
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Configurações</h2>
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:20, maxWidth:480 }}>
        <div style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:6 }}>Dados do simulador</div>
        <p style={{ fontSize:13,color:"#6b7280",marginBottom:16 }}>Apaga todos os resultados e reinicia a simulação. Os dados são salvos automaticamente no navegador a cada alteração.</p>
        <button onClick={resetAll} style={{ display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"#ef4444",border:"none",borderRadius:8,fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer" }}>
          <Trash2 size={14}/> Limpar todos os resultados
        </button>
      </div>
    </div>
  );
}

function ViewComoFunciona() {
  const items = [
    {q:"Como funciona o simulador?",a:"Selecione um grupo e insira os placares de cada jogo. A classificação e o chaveamento do mata-mata são atualizados em tempo real."},
    {q:"Os dados são salvos?",a:"Sim. Os resultados são salvos automaticamente no seu navegador (localStorage). Ao recarregar a página, os dados são restaurados."},
    {q:"Qual o critério de desempate?",a:"Pontos → Saldo de gols → Gols pró → Confronto direto (pontos, saldo, gols) → Ordem alfabética."},
    {q:"Quantas seleções avançam?",a:"Os 2 primeiros de cada grupo avançam diretamente. Os 8 melhores terceiros colocados também avançam, totalizando 32 seleções no mata-mata."},
    {q:"Como compartilhar minha simulação?",a:"Use o botão 'Compartilhar' no topo — ele copia um link com todos os seus resultados codificados na URL."},
  ];
  return (
    <div style={{ padding:24 }}>
      <h2 style={{ margin:"0 0 16px", fontSize:20, fontWeight:800, color:"#111827" }}>Como funciona</h2>
      <div style={{ display:"flex",flexDirection:"column",gap:10,maxWidth:640 }}>
        {items.map(({q,a})=>(
          <div key={q} style={{ background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:16 }}>
            <div style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:6 }}>{q}</div>
            <div style={{ fontSize:13,color:"#4b5563",lineHeight:1.6 }}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"grupos",label:"Fase de Grupos",icon:LayoutDashboard},
  {id:"classificacao",label:"Classificação",icon:BarChart2},
  {id:"matamata",label:"Mata-mata",icon:GitMerge},
  {id:"todos",label:"Todos os Jogos",icon:Calendar},
  {id:"favoritos",label:"Favoritos",icon:Heart},
  {id:"estatisticas",label:"Estatísticas",icon:PieChart},
  {id:"configuracoes",label:"Configurações",icon:Settings},
  {id:"comofunciona",label:"Como funciona",icon:HelpCircle},
];

const PAGE_HEADERS = {
  grupos:{title:"Fase de Grupos",sub:"Preencha os resultados dos jogos da fase de grupos"},
  classificacao:{title:"Classificação",sub:"Tabela de todos os grupos"},
  matamata:{title:"Mata-mata",sub:"Chaveamento completo — atualizado automaticamente"},
  todos:{title:"Todos os Jogos",sub:"Lista completa de jogos da fase de grupos"},
  favoritos:{title:"Classificados",sub:"Seleções por posição"},
  estatisticas:{title:"Estatísticas",sub:"Números do torneio"},
  configuracoes:{title:"Configurações",sub:"Gerencie os dados do simulador"},
  comofunciona:{title:"Como funciona",sub:"Guia de uso"},
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ① Inicialização: URL compartilhada tem prioridade, depois localStorage
  // v2 = nova chave para invalidar cache antigo com bug de pontos
  const LS_KEY = "copa2026_scores_v2";

  const [scores, setScores] = useState(() => {
    try {
      // Tenta carregar da URL (?s=...)
      const params = new URLSearchParams(window.location.search);
      const urlData = params.get("s");
      if (urlData) {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(urlData)))));
        if (parsed && typeof parsed === "object" && parsed["A"]) return parsed;
      }
    } catch { /* URL inválida, ignora */ }
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed["A"]) return parsed;
      }
    } catch { /* localStorage corrompido, ignora */ }
    // Limpa chave antiga se existir
    try { localStorage.removeItem("copa2026_scores"); } catch {}
    return createInitialScores();
  });

  // ② localStorage: persiste a cada mudança de score
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(scores)); }
    catch { /* quota exceeded */ }
  }, [scores]);

  const [activeNav, setActiveNav] = useState("grupos");
  const [activeGroup, setActiveGroup] = useState("A");
  const [shareToast, setShareToast] = useState(false);
  const isMobile = window.innerWidth < 900;

  const standings = useMemo(() => computeStandings(scores), [scores]);

  const totalPlayed = useMemo(() =>
    GROUPS.reduce((acc,g) => acc+g.fixtures.filter(f=>{
      const r=scores[g.letter][f.id]; return parseGoals(r.home)!==null&&parseGoals(r.away)!==null;
    }).length,0)
  ,[scores]);

  const totalMatches = GROUPS.length * 6;
  const progressPct = Math.round((totalPlayed/totalMatches)*100);
  const circumference = 2*Math.PI*28;
  const strokeDashoffset = circumference - (progressPct/100)*circumference;

  const setScore = useCallback((groupLetter, fixtureId, side, value) => {
    setScores(prev => ({
      ...prev,
      [groupLetter]:{...prev[groupLetter],[fixtureId]:{...prev[groupLetter][fixtureId],[side]:value}},
    }));
  }, []);

  const resetAll = () => {
    setScores(createInitialScores());
    localStorage.removeItem(LS_KEY);
  };

  // ⑤ Compartilhar via URL (encodeURIComponent para suportar acentos)
  const handleShare = () => {
    try {
      const json = JSON.stringify(scores);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
      const url = window.location.origin + window.location.pathname + "?s=" + encoded;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          setShareToast(true);
          setTimeout(() => setShareToast(false), 3000);
        }).catch(() => {
          // Fallback para navegadores sem permissão de clipboard
          prompt("Copie o link abaixo:", url);
        });
      } else {
        prompt("Copie o link abaixo:", url);
      }
    } catch(e) { alert("Erro ao gerar link: " + e.message); }
  };

  const currentGroupData = standings.find(g => g.letter === activeGroup);

  // Renderiza a fase de grupos
  const renderGrupos = () => (
    <>
      {/* Abas */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 16px", display:"flex", gap:2, overflowX:"auto", flexWrap:isMobile?"wrap":"nowrap" }}>
        {GROUPS.map(g => (
          <button key={g.letter} onClick={()=>setActiveGroup(g.letter)} style={{
            padding:"9px 12px", background:activeGroup===g.letter?"#22c55e":"transparent",
            border:"none", borderRadius:6, fontSize:12, fontWeight:600,
            color:activeGroup===g.letter?"#fff":"#374151", cursor:"pointer",
            margin:"6px 0", whiteSpace:"nowrap", transition:"background 0.15s",
            boxShadow:activeGroup===g.letter?"0 0 0 2px #16a34a":"none",
          }}>Grupo {g.letter}</button>
        ))}
      </div>

      <div style={{ flex:1, padding:isMobile?12:24, display:"flex", flexDirection:"column", gap:20 }}>
        {currentGroupData && (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:16 }}>

            {/* Jogos */}
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:20 }}>
              <h2 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700, color:"#111827" }}>Jogos do Grupo {activeGroup}</h2>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {currentGroupData.fixtures.map((fixture) => {
                  const result = scores[activeGroup][fixture.id];
                  const homeTeam = currentGroupData.teams[fixture.home];
                  const awayTeam = currentGroupData.teams[fixture.away];
                  const filled = parseGoals(result.home)!==null && parseGoals(result.away)!==null;
                  return (
                    <div key={fixture.id} style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"10px 6px",
                      borderBottom:"1px solid #f3f4f6",
                      background: filled ? "#f0fdf4" : "transparent",
                      borderRadius:6, marginBottom:2,
                    }}>
                      {/* Data/hora */}
                      <span style={{ color:"#6b7280", fontSize:10, width:100, flexShrink:0 }}>
                        {fixture.meta.date} • {fixture.meta.time}
                      </span>
                      {/* Casa: nome + bandeira */}
                      <span style={{ flex:1.4, fontSize:12, fontWeight:600, color:"#111827", textAlign:"right", paddingRight:4, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {homeTeam.name}
                      </span>
                      <Flag code={homeTeam.code} size={28} />
                      {/* Placar */}
                      <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                        <input type="number" min="0" inputMode="numeric" value={result.home}
                          onChange={e=>setScore(activeGroup,fixture.id,"home",e.target.value)}
                          style={{ width:44,height:38,textAlign:"center",border:`1px solid ${filled?"#86efac":"#d1d5db"}`,borderRadius:6,fontSize:18,fontWeight:700,outline:"none",background:filled?"#dcfce7":"#f9fafb" }}
                          placeholder="0" />
                        <span style={{ color:"#9ca3af",fontWeight:700,fontSize:13 }}>x</span>
                        <input type="number" min="0" inputMode="numeric" value={result.away}
                          onChange={e=>setScore(activeGroup,fixture.id,"away",e.target.value)}
                          style={{ width:44,height:38,textAlign:"center",border:`1px solid ${filled?"#86efac":"#d1d5db"}`,borderRadius:6,fontSize:18,fontWeight:700,outline:"none",background:filled?"#dcfce7":"#f9fafb" }}
                          placeholder="0" />
                      </div>
                      {/* Visitante: bandeira + nome */}
                      <Flag code={awayTeam.code} size={28} />
                      <span style={{ flex:1.4, fontSize:12, fontWeight:600, color:"#111827", paddingLeft:4, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {awayTeam.name}
                      </span>
                      {/* ⑦ Indicador visual */}
                      {filled
                        ? <CheckCircle2 size={15} style={{ color:"#22c55e", flexShrink:0 }} />
                        : <span style={{ width:15, flexShrink:0 }} />
                      }
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ⑧ Classificação com coluna PTS */}
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", padding:20 }}>
              <h2 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700, color:"#111827" }}>Classificação do Grupo {activeGroup}</h2>
              <div style={{ display:"grid", gridTemplateColumns:"24px 1fr 26px 26px 26px 26px 26px 26px 26px 34px", gap:2, padding:"4px 6px", fontSize:9, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" }}>
                <div>Pos</div><div>Seleção</div>
                <div style={{textAlign:"center"}}>J</div><div style={{textAlign:"center"}}>V</div>
                <div style={{textAlign:"center"}}>E</div><div style={{textAlign:"center"}}>D</div>
                <div style={{textAlign:"center"}}>GP</div><div style={{textAlign:"center"}}>GC</div>
                <div style={{textAlign:"center"}}>SG</div><div style={{textAlign:"center",color:"#111827",fontWeight:800}}>Pts</div>
              </div>
              {currentGroupData.standings.map((team,idx) => (
                <div key={team.code} style={{ display:"grid", gridTemplateColumns:"24px 1fr 26px 26px 26px 26px 26px 26px 26px 34px", gap:2, padding:"9px 6px", alignItems:"center", background:idx<2?"#f0fdf4":idx===2?"#fffbeb":"transparent", borderTop:"1px solid #f3f4f6", borderRadius:4, marginTop:2 }}>
                  <div style={{ width:20,height:20,borderRadius:"50%",background:idx<2?"#22c55e":idx===2?"#f59e0b":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:idx<2||idx===2?"#fff":"#6b7280" }}>{idx+1}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,minWidth:0 }}>
                    <Flag code={team.code} size={22} />
                    <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{team.name}</span>
                  </div>
                  {[team.j,team.v,team.e,team.d,team.gp,team.gc,team.sg].map((val,i)=>(
                    <div key={i} style={{ textAlign:"center",fontSize:11,fontWeight:i===6?700:400,color:i===6&&val>0?"#15803d":i===6&&val<0?"#dc2626":"#374151" }}>{val}</div>
                  ))}
                  <div style={{ textAlign:"center",fontSize:13,fontWeight:800,color:idx<2?"#15803d":"#111827",background:idx<2?"#dcfce7":idx===2?"#fef3c7":"#f3f4f6",borderRadius:4,padding:"1px 0" }}>{team.pts}</div>
                </div>
              ))}
              <div style={{ marginTop:12,background:"#f0fdf4",borderRadius:8,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-start" }}>
                <Info size={13} style={{ color:"#22c55e",flexShrink:0,marginTop:2 }} />
                <p style={{ margin:0,fontSize:10,color:"#374151",lineHeight:1.5 }}>
                  Os 2 primeiros colocados avançam diretamente.<br/>Os 8 melhores terceiros colocados também avançam.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prévia mata-mata */}
        <div style={{ background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:20 }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
            <div>
              <h2 style={{ margin:0,fontSize:15,fontWeight:700,color:"#111827" }}>Mata-mata (Prévia)</h2>
              <p style={{ margin:"3px 0 0",fontSize:11,color:"#6b7280" }}>Atualizado automaticamente conforme os resultados.</p>
            </div>
            <button onClick={()=>setActiveNav("matamata")} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:"#fff",border:"1px solid #d1d5db",borderRadius:8,fontSize:12,fontWeight:600,color:"#374151",cursor:"pointer" }}>
              Ver mata-mata completo <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ overflowX:"auto" }}>
            <div style={{ display:"flex",gap:8,minWidth:860 }}>
              {[
                {label:"16 AVOS",dates:"28 JUN–03 JUL",cards:R16_SLOTS.slice(0,4),more:R16_SLOTS.length-4},
                {label:"OITAVAS",dates:"04–07 JUL",cards:[{id:"J89",date:"04 jul",homeSlot:"V74",awaySlot:"V77"},{id:"J90",date:"04 jul",homeSlot:"V73",awaySlot:"V75"},{id:"J91",date:"05 jul",homeSlot:"V76",awaySlot:"V78"},{id:"J92",date:"05 jul",homeSlot:"V79",awaySlot:"V80"}]},
                {label:"QUARTAS",dates:"09–11 JUL",cards:[{id:"J97",date:"09 jul",homeSlot:"V89",awaySlot:"V90"},{id:"J98",date:"10 jul",homeSlot:"V93",awaySlot:"V94"}]},
                {label:"SEMIFINAIS",dates:"14–15 JUL",cards:[{id:"J101",date:"14 jul",homeSlot:"V97",awaySlot:"V98"},{id:"J102",date:"15 jul",homeSlot:"V99",awaySlot:"V100"}]},
                {label:"FINAL",dates:"19 JUL",cards:[{id:"J104",date:"19 jul",homeSlot:"W101",awaySlot:"W102",isFinal:true}]},
              ].map((round,ri) => (
                <div key={round.label} style={{ flex:ri===4?1.2:1,minWidth:ri===0?155:125 }}>
                  <RoundHeader label={round.label} dates={round.dates} />
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {round.cards.map(m => {
                      const homeTeam = m.homeSlot?.match(/^[12][A-L]$/) ? resolveSlot(m.homeSlot, standings) : null;
                      const awayTeam = m.awaySlot?.match(/^[12][A-L]$/) ? resolveSlot(m.awaySlot, standings) : null;
                      return (
                        <div key={m.id} style={{ background:m.isFinal?"#111827":"#f9fafb",borderRadius:8,border:m.isFinal?"2px solid #22c55e":"1px solid #e5e7eb",overflow:"hidden" }}>
                          <div style={{ padding:"4px 8px",borderBottom:`1px solid ${m.isFinal?"#1f2937":"#f3f4f6"}` }}>
                            <span style={{ fontSize:9,fontWeight:800,color:m.isFinal?"#22c55e":"#9ca3af" }}>{m.id}</span>
                            <span style={{ fontSize:9,color:"#9ca3af",marginLeft:4 }}>{m.date}</span>
                          </div>
                          <TeamSlotRow team={homeTeam} slot={m.homeSlot} side="home" />
                          <TeamSlotRow team={awayTeam} slot={m.awaySlot} side="away" />
                        </div>
                      );
                    })}
                    {round.more > 0 && (
                      <div style={{ fontSize:9,color:"#9ca3af",textAlign:"center",padding:"4px 0" }}>+{round.more} jogos...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const header = PAGE_HEADERS[activeNav];

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#f3f4f6",fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Sidebar */}
      {!isMobile && (
        <aside style={{ width:200,minHeight:"100vh",background:"#111827",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:10 }}>
          <div style={{ padding:"20px 16px 16px",borderBottom:"1px solid #1f2937" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:44,height:44,borderRadius:8,overflow:"hidden",flexShrink:0,position:"relative",background:"linear-gradient(135deg,#16a34a,#15803d)" }}>
                <img src="/logo-copa2026.png" alt="Copa 2026" width={44} height={44}
                  style={{ objectFit:"contain", display:"block" }}
                  onError={e => { e.target.style.display="none"; document.getElementById("logo-fallback").style.display="flex"; }} />
                <span id="logo-fallback" style={{ fontSize:22,display:"none",alignItems:"center",justifyContent:"center",position:"absolute",inset:0 }}>🏆</span>
              </div>
              <div>
                <div style={{ color:"#22c55e",fontWeight:800,fontSize:11,lineHeight:1.1 }}>COPA DO MUNDO</div>
                <div style={{ color:"#fff",fontWeight:900,fontSize:18,lineHeight:1.1 }}>2026</div>
                <div style={{ color:"#6b7280",fontSize:8,fontWeight:600,letterSpacing:2,marginTop:1 }}>TABELINHA</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1,padding:"10px 0" }}>
            {NAV_ITEMS.map(({id,label,icon:Icon})=>{
              const active=activeNav===id;
              return (
                <button key={id} onClick={()=>setActiveNav(id)} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",background:active?"#22c55e":"transparent",border:"none",cursor:"pointer",color:active?"#fff":"#9ca3af",fontWeight:active?700:500,fontSize:12,textAlign:"left",transition:"background 0.15s" }}>
                  <Icon size={15}/>{label}
                </button>
              );
            })}
          </nav>
          <div style={{ padding:16,borderTop:"1px solid #1f2937" }}>
            <div style={{ color:"#9ca3af",fontSize:9,fontWeight:700,letterSpacing:1,marginBottom:10,textTransform:"uppercase" }}>Progresso</div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
              <div style={{ position:"relative",width:68,height:68 }}>
                <svg width={68} height={68} style={{ transform:"rotate(-90deg)" }}>
                  <circle cx={34} cy={34} r={28} fill="none" stroke="#1f2937" strokeWidth={5}/>
                  <circle cx={34} cy={34} r={28} fill="none" stroke="#22c55e" strokeWidth={5}
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.4s ease" }}/>
                </svg>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13 }}>{progressPct}%</div>
              </div>
              <div style={{ color:"#6b7280",fontSize:10,textAlign:"center",marginTop:4 }}>{totalPlayed} de {totalMatches} jogos<br/>preenchidos</div>
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <main style={{ marginLeft:isMobile?0:200,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh" }}>
        {/* Header */}
        <div style={{ background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:5 }}>
          <div>
            <h1 style={{ margin:0,fontSize:18,fontWeight:800,color:"#111827" }}>{header.title}</h1>
            <p style={{ margin:"1px 0 0",fontSize:11,color:"#6b7280" }}>{header.sub}</p>
          </div>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            {shareToast && (
              <span style={{ fontSize:11,color:"#22c55e",fontWeight:600,padding:"4px 10px",background:"#f0fdf4",borderRadius:8,border:"1px solid #86efac" }}>
                ✓ Link copiado!
              </span>
            )}
            <button onClick={resetAll} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:"#fff",border:"1px solid #d1d5db",borderRadius:8,fontSize:12,fontWeight:600,color:"#374151",cursor:"pointer" }}>
              <Trash2 size={13}/> Limpar
            </button>
            <button onClick={handleShare} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:"#22c55e",border:"none",borderRadius:8,fontSize:12,fontWeight:600,color:"#fff",cursor:"pointer" }}>
              <Link size={13}/> Compartilhar
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobile && (
          <div style={{ background:"#111827",display:"flex",overflowX:"auto",padding:"8px 4px" }}>
            {NAV_ITEMS.map(({id,label,icon:Icon})=>{
              const active=activeNav===id;
              return (
                <button key={id} onClick={()=>setActiveNav(id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 10px",background:active?"#22c55e":"transparent",border:"none",cursor:"pointer",color:active?"#fff":"#9ca3af",fontSize:9,fontWeight:600,whiteSpace:"nowrap",borderRadius:6,margin:"0 2px" }}>
                  <Icon size={14}/>{label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
          {activeNav==="grupos" && renderGrupos()}
          {activeNav==="classificacao" && <ViewClassificacao standings={standings}/>}
          {activeNav==="matamata" && <ViewMataMata standings={standings}/>}
          {activeNav==="todos" && <ViewTodosJogos standings={standings} scores={scores} setScore={setScore}/>}
          {activeNav==="favoritos" && <ViewFavoritos standings={standings}/>}
          {activeNav==="estatisticas" && <ViewEstatisticas standings={standings} scores={scores}/>}
          {activeNav==="configuracoes" && <ViewConfiguracoes resetAll={resetAll}/>}
          {activeNav==="comofunciona" && <ViewComoFunciona/>}
        </div>

        <footer style={{ background:"#fff",borderTop:"1px solid #e5e7eb",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:10,color:"#6b7280" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            Copa do Mundo 2026 • 48 seleções • 104 jogos • 16 sedes
            <Flag code="CAN" size={14}/><Flag code="MEX" size={14}/><Flag code="USA" size={14}/>
          </div>
          <div>Simulador não oficial ⚽</div>
        </footer>
      </main>
    </div>
  );
}
