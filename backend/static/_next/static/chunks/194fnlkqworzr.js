(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71471,e=>{e.v({analyzeWrap:"CodeEditor-module__CSe3fa__analyzeWrap",editor:"CodeEditor-module__CSe3fa__editor",editorArea:"CodeEditor-module__CSe3fa__editorArea",exampleChip:"CodeEditor-module__CSe3fa__exampleChip",examplesLabel:"CodeEditor-module__CSe3fa__examplesLabel",examplesRow:"CodeEditor-module__CSe3fa__examplesRow",headerControls:"CodeEditor-module__CSe3fa__headerControls",kbd:"CodeEditor-module__CSe3fa__kbd",langSelect:"CodeEditor-module__CSe3fa__langSelect",lineNumbers:"CodeEditor-module__CSe3fa__lineNumbers",textarea:"CodeEditor-module__CSe3fa__textarea"})},18327,e=>{e.v({chevron:"TokenOutput-module__7SvuUW__chevron",chevronOpen:"TokenOutput-module__7SvuUW__chevronOpen",colIdx:"TokenOutput-module__7SvuUW__colIdx",colLine:"TokenOutput-module__7SvuUW__colLine",colVal:"TokenOutput-module__7SvuUW__colVal",content:"TokenOutput-module__7SvuUW__content",countSup:"TokenOutput-module__7SvuUW__countSup",empty:"TokenOutput-module__7SvuUW__empty",emptyIcon:"TokenOutput-module__7SvuUW__emptyIcon",emptySub:"TokenOutput-module__7SvuUW__emptySub",emptyTitle:"TokenOutput-module__7SvuUW__emptyTitle",errorBox:"TokenOutput-module__7SvuUW__errorBox","fade-up":"TokenOutput-module__7SvuUW__fade-up",group:"TokenOutput-module__7SvuUW__group",groupBody:"TokenOutput-module__7SvuUW__groupBody",groupCount:"TokenOutput-module__7SvuUW__groupCount",groupDot:"TokenOutput-module__7SvuUW__groupDot",groupHeader:"TokenOutput-module__7SvuUW__groupHeader",groupLabel:"TokenOutput-module__7SvuUW__groupLabel",groupTitleRow:"TokenOutput-module__7SvuUW__groupTitleRow",groups:"TokenOutput-module__7SvuUW__groups",headerRight:"TokenOutput-module__7SvuUW__headerRight",inlineView:"TokenOutput-module__7SvuUW__inlineView",loading:"TokenOutput-module__7SvuUW__loading",output:"TokenOutput-module__7SvuUW__output","pulse-glow":"TokenOutput-module__7SvuUW__pulse-glow",table:"TokenOutput-module__7SvuUW__table",tableWrap:"TokenOutput-module__7SvuUW__tableWrap",warnItem:"TokenOutput-module__7SvuUW__warnItem",warnings:"TokenOutput-module__7SvuUW__warnings"})},29364,e=>{e.v({bar:"StatsBar-module__ae-4zq__bar",card:"StatsBar-module__ae-4zq__card","count-up":"StatsBar-module__ae-4zq__count-up",label:"StatsBar-module__ae-4zq__label",num:"StatsBar-module__ae-4zq__num"})},8363,e=>{e.v({container:"page-module__0InSfW__container",grid:"page-module__0InSfW__grid",legend:"page-module__0InSfW__legend",legendLabel:"page-module__0InSfW__legendLabel",pageBadge:"page-module__0InSfW__pageBadge",pageDesc:"page-module__0InSfW__pageDesc",pageHeader:"page-module__0InSfW__pageHeader",pageHeaderLeft:"page-module__0InSfW__pageHeaderLeft",pageTitle:"page-module__0InSfW__pageTitle",panelWrap:"page-module__0InSfW__panelWrap"})},57826,e=>{"use strict";var a=e.i(43476),l=e.i(71645),t=e.i(71471);let n={c_basic:{lang:"c",code:`#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 10;
    float y = 3.14;
    char name[] = "OtomataLab";
    if (x > 5 && y < 10.0) {
        printf("Hello, %s!\\n", name);
    }
    return 0;
}`},c_math:{lang:"c",code:`#include <math.h>
#include <stdio.h>

/* Kalkulator ekspresi matematika */
double quadratic(double a, double b, double c) {
    double disc = b * b - 4.0 * a * c;
    return (-b + sqrt(disc)) / (2.0 * a);
}

int main() {
    double x = 2.5 * 3.0 + 1.0 / 4.0 - 0.75;
    int y = (10 % 3) * 2 + 5;
    int z = y << 2 | 0xFF & 0x0F;
    printf("x=%.2f y=%d z=%d\\n", x, y, z);
    return 0;
}`},python:{lang:"python",code:`# Kelas Mahasiswa
class Mahasiswa:
    def __init__(self, nama: str, ipk: float):
        self.nama = nama
        self.ipk  = ipk

    def lulus(self) -> bool:
        return self.ipk >= 2.0

    def grade(self) -> str:
        if self.ipk >= 3.5:
            return "A"
        elif self.ipk >= 3.0:
            return "B"
        else:
            return "C"

mhs = Mahasiswa("Alice", 3.75)
print(f"{mhs.nama}: {mhs.grade()}")`},java:{lang:"java",code:`import java.util.ArrayList;

public class NilaiManager {
    private ArrayList<Double> nilai;

    public NilaiManager() {
        this.nilai = new ArrayList<>();
    }

    public void tambah(double n) {
        if (n >= 0 && n <= 100) nilai.add(n);
    }

    public double rata() {
        double total = 0;
        for (double n : nilai) total += n;
        return nilai.isEmpty() ? 0 : total / nilai.size();
    }

    public static void main(String[] args) {
        NilaiManager nm = new NilaiManager();
        int[] data = {85, 90, 78, 92};
        for (int n : data) nm.tambah(n);
        System.out.printf("Rata-rata: %.2f%n", nm.rata());
    }
}`}};function r({code:e,lang:s,onCodeChange:o,onLangChange:i,onAnalyze:d,loading:u}){let c=(0,l.useRef)(null),p=(0,l.useRef)(null),m=Array.from({length:e.split("\n").length},(e,a)=>a+1).join("\n"),_=(0,l.useCallback)(()=>{c.current&&p.current&&(p.current.scrollTop=c.current.scrollTop)},[]),h=(0,l.useCallback)(e=>{if("Tab"===e.key){e.preventDefault();let a=e.currentTarget,{selectionStart:l,selectionEnd:t}=a;o(a.value.slice(0,l)+"    "+a.value.slice(t)),requestAnimationFrame(()=>{a.selectionStart=a.selectionEnd=l+4})}(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&(e.preventDefault(),d())},[o,d]);return(0,a.jsxs)("div",{className:`panel ${t.default.editor}`,children:[(0,a.jsxs)("div",{className:"panel-header",children:[(0,a.jsxs)("h2",{className:"panel-title",children:[(0,a.jsx)("span",{children:"📝"})," Kode Sumber"]}),(0,a.jsxs)("div",{className:t.default.headerControls,children:[(0,a.jsxs)("select",{className:t.default.langSelect,value:s,onChange:e=>i(e.target.value),title:"Pilih bahasa",children:[(0,a.jsx)("option",{value:"c",children:"C / C++"}),(0,a.jsx)("option",{value:"python",children:"Python"}),(0,a.jsx)("option",{value:"java",children:"Java"}),(0,a.jsx)("option",{value:"custom",children:"Kustom"})]}),(0,a.jsxs)("button",{className:"btn btn-ghost",onClick:()=>o(""),title:"Hapus kode",children:[(0,a.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 13 13",fill:"none",children:(0,a.jsx)("path",{d:"M1 1l11 11M12 1L1 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),"Hapus"]})]})]}),(0,a.jsxs)("div",{className:t.default.editorArea,children:[(0,a.jsx)("div",{ref:p,className:t.default.lineNumbers,"aria-hidden":"true",children:m}),(0,a.jsx)("textarea",{ref:c,className:t.default.textarea,value:e,onChange:e=>o(e.target.value),onScroll:_,onKeyDown:h,spellCheck:!1,autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",placeholder:"// Ketik atau paste kode program di sini..."})]}),(0,a.jsxs)("div",{className:t.default.examplesRow,children:[(0,a.jsx)("span",{className:t.default.examplesLabel,children:"Contoh:"}),Object.keys(n).map(e=>(0,a.jsx)("button",{className:t.default.exampleChip,onClick:()=>{let a;(a=n[e])&&(i(a.lang),o(a.code))},children:e.replace("_"," ")},e))]}),(0,a.jsx)("div",{className:t.default.analyzeWrap,children:(0,a.jsx)("button",{className:"btn btn-primary",style:{width:"100%"},onClick:d,disabled:u||!e.trim(),children:u?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"dot-flashing",children:[(0,a.jsx)("span",{}),(0,a.jsx)("span",{}),(0,a.jsx)("span",{})]}),"Menganalisis..."]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("svg",{width:"17",height:"17",viewBox:"0 0 17 17",fill:"none",children:[(0,a.jsx)("circle",{cx:"8.5",cy:"8.5",r:"6.5",stroke:"white",strokeWidth:"1.5"}),(0,a.jsx)("path",{d:"M5.5 8.5l2 2 4-4",stroke:"white",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),"Analisis Token",(0,a.jsx)("kbd",{className:t.default.kbd,children:"Ctrl+↵"})]})})})]})}var s=e.i(18327);let o={reserved:{label:"a. Reserved Words",dot:"#f59e0b",cls:"token-reserved",order:1},symbol:{label:"b. Simbol & Tanda Baca",dot:"#e879f9",cls:"token-symbol",order:2},variable:{label:"c. Variabel / Identifier",dot:"#34d399",cls:"token-variable",order:3},math:{label:"d. Ekspresi Matematika",dot:"#fb923c",cls:"token-math",order:4},number:{label:"Literal Angka",dot:"#60a5fa",cls:"token-number",order:5},string:{label:"Literal String / Char",dot:"#f87171",cls:"token-string",order:6},comment:{label:"Komentar",dot:"#6b7280",cls:"token-comment",order:7}};function i({result:e,loading:t,error:n}){let[r,p]=(0,l.useState)("grouped"),[m,_]=(0,l.useState)({}),h=(0,l.useCallback)(e=>{_(a=>({...a,[e]:!a[e]}))},[]),f=(0,l.useCallback)(()=>{if(!e)return;let a="========================================\n";a+=`   OTOMATALAB — HASIL ANALISIS LEKSIKAL
========================================
Total Token: ${e.stats.total}

`,Object.entries(o).sort((e,a)=>e[1].order-a[1].order).forEach(([l,t])=>{let n=e.groups[l]??[];if(!n.length)return;a+=`----------------------------------------
${t.label.toUpperCase()} (${n.length} token)
----------------------------------------
`;let r=new Map;n.forEach(e=>r.set(e.value,(r.get(e.value)??0)+1)),[...r.entries()].forEach(([e,l],t)=>{a+=`  [${String(t+1).padStart(3)}] "${e}"${l>1?` (\xd7${l})`:""}
`}),a+="\n"});let l=new Blob([a],{type:"text/plain;charset=utf-8"}),t=URL.createObjectURL(l),n=document.createElement("a");n.href=t,n.download=`otomatalab_result_${Date.now()}.txt`,n.click(),URL.revokeObjectURL(t)},[e]);return(0,a.jsxs)("div",{className:`panel ${s.default.output}`,children:[(0,a.jsxs)("div",{className:"panel-header",children:[(0,a.jsxs)("h2",{className:"panel-title",children:[(0,a.jsx)("span",{children:"🔍"})," Hasil Analisis"]}),(0,a.jsxs)("div",{className:s.default.headerRight,children:[(0,a.jsxs)("button",{className:"btn btn-ghost",onClick:f,disabled:!e,title:"Export ke .txt",children:[(0,a.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 13 13",fill:"none",children:(0,a.jsx)("path",{d:"M6.5 1v7M4 6l2.5 2.5L9 6M2 9.5v.5a1 1 0 001 1h7a1 1 0 001-1v-.5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),"Export"]}),(0,a.jsx)("div",{className:"view-toggle",children:["grouped","table","inline"].map(e=>(0,a.jsx)("button",{className:`view-btn ${r===e?"active":""}`,onClick:()=>p(e),children:"grouped"===e?"Grouped":"table"===e?"Tabel":"Inline"},e))})]})]}),(0,a.jsxs)("div",{className:s.default.content,children:[t&&(0,a.jsxs)("div",{className:s.default.loading,children:[(0,a.jsxs)("div",{className:"dot-flashing",children:[(0,a.jsx)("span",{}),(0,a.jsx)("span",{}),(0,a.jsx)("span",{})]}),(0,a.jsx)("span",{children:"Menganalisis token..."})]}),n&&!t&&(0,a.jsxs)("div",{className:s.default.errorBox,children:[(0,a.jsx)("span",{children:"⚠️"})," ",n]}),!e&&!t&&!n&&(0,a.jsxs)("div",{className:s.default.empty,children:[(0,a.jsx)("div",{className:s.default.emptyIcon,children:"⚡"}),(0,a.jsx)("p",{className:s.default.emptyTitle,children:"Siap menganalisis!"}),(0,a.jsxs)("p",{className:s.default.emptySub,children:["Masukkan kode lalu tekan ",(0,a.jsx)("strong",{children:"Analisis Token"})]})]}),e&&!t&&(0,a.jsxs)(a.Fragment,{children:[e.errors?.length>0&&(0,a.jsx)("div",{className:s.default.warnings,children:e.errors.map((e,l)=>(0,a.jsxs)("div",{className:s.default.warnItem,children:["⚠️ ",e]},l))}),"grouped"===r&&(0,a.jsx)(d,{groups:e.groups,collapsed:m,onToggle:h}),"table"===r&&(0,a.jsx)(u,{tokens:e.tokens}),"inline"===r&&(0,a.jsx)(c,{tokens:e.tokens})]})]})]})}function d({groups:e,collapsed:l,onToggle:t}){let n=Object.entries(o).sort((e,a)=>e[1].order-a[1].order);return(0,a.jsx)("div",{className:s.default.groups,children:n.map(([n,r])=>{let o=e[n]??[];if(!o.length)return null;let i=l[n],d=new Map;o.forEach(e=>d.set(e.value,(d.get(e.value)??0)+1));let u=[...d.entries()];return(0,a.jsxs)("div",{className:s.default.group,children:[(0,a.jsxs)("button",{className:s.default.groupHeader,onClick:()=>t(n),children:[(0,a.jsxs)("div",{className:s.default.groupTitleRow,children:[(0,a.jsx)("span",{className:s.default.groupDot,style:{background:r.dot}}),(0,a.jsx)("span",{className:s.default.groupLabel,children:r.label}),(0,a.jsxs)("span",{className:s.default.groupCount,children:[o.length," token · ",u.length," unik"]})]}),(0,a.jsx)("span",{className:`${s.default.chevron} ${i?"":s.default.chevronOpen}`,children:"▼"})]}),!i&&(0,a.jsx)("div",{className:s.default.groupBody,children:u.map(([e,l])=>(0,a.jsxs)("span",{className:`token-badge ${r.cls}`,title:`"${e}" (${l}\xd7)`,children:[e.length>40?e.slice(0,37)+"…":e,l>1&&(0,a.jsxs)("sup",{className:s.default.countSup,children:["×",l]})]},e))})]},n)})})}function u({tokens:e}){return(0,a.jsx)("div",{className:s.default.tableWrap,children:(0,a.jsxs)("table",{className:s.default.table,children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"#"}),(0,a.jsx)("th",{children:"Token"}),(0,a.jsx)("th",{children:"Kategori"}),(0,a.jsx)("th",{children:"Baris"})]})}),(0,a.jsx)("tbody",{children:e.map((e,l)=>{let t=o[e.type];return(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:s.default.colIdx,children:l+1}),(0,a.jsx)("td",{className:s.default.colVal,children:(0,a.jsx)("code",{children:e.value.length>48?e.value.slice(0,45)+"…":e.value})}),(0,a.jsx)("td",{children:(0,a.jsx)("span",{className:`token-badge ${t?.cls??""}`,style:{fontSize:"0.68rem"},children:t?.label.replace(/^[a-d]\. /,"")??e.type})}),(0,a.jsx)("td",{className:s.default.colLine,children:e.line})]},l)})})]})})}function c({tokens:e}){return(0,a.jsx)("div",{className:s.default.inlineView,children:e.map((e,l)=>{let t=o[e.type];return(0,a.jsx)("span",{className:`token-badge ${t?.cls??""}`,title:`${t?.label??e.type} \xb7 baris ${e.line}`,style:{margin:"2px"},children:e.value.replace(/\n/g,"↵")},l)})})}var p=e.i(29364);let m=[{key:"total",label:"Total Token",color:"#818cf8"},{key:"reserved",label:"Reserved Words",color:"#f59e0b"},{key:"symbol",label:"Simbol",color:"#e879f9"},{key:"variable",label:"Variabel",color:"#34d399"},{key:"math",label:"Matematika",color:"#fb923c"},{key:"number",label:"Angka",color:"#60a5fa"},{key:"string",label:"String",color:"#f87171"},{key:"comment",label:"Komentar",color:"#6b7280"}];function _({stats:e}){return(0,a.jsx)("div",{className:p.default.bar,children:m.map(l=>(0,a.jsx)(h,{label:l.label,value:e?.[l.key]??null,color:l.color},l.key))})}function h({label:e,value:t,color:n}){let r=(0,l.useRef)(null),s=(0,l.useRef)(0);return(0,l.useEffect)(()=>{if(null===t)return;let e=r.current;if(!e)return;let a=s.current;if(s.current=t,a===t)return;let l=(t-a)/20,n=a,o=0,i=setInterval(()=>{n+=l,o++,e.textContent=String(Math.round(n)),o>=20&&(e.textContent=String(t),clearInterval(i))},25);return()=>clearInterval(i)},[t]),(0,a.jsxs)("div",{className:p.default.card,style:{"--stat-color":n},children:[(0,a.jsx)("span",{ref:r,className:p.default.num,children:null===t?"—":t}),(0,a.jsx)("span",{className:p.default.label,children:e})]})}async function f(e,a){let l=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:e,lang:a})});if(!l.ok){let e=await l.text();throw Error(`API error ${l.status}: ${e}`)}return l.json()}e.i(47167);var g=e.i(8363);let b=[{cls:"token-reserved",label:"Reserved Word"},{cls:"token-symbol",label:"Simbol"},{cls:"token-variable",label:"Variabel"},{cls:"token-math",label:"Matematika"},{cls:"token-number",label:"Angka"},{cls:"token-string",label:"String"},{cls:"token-comment",label:"Komentar"}],x=`#include <stdio.h>

// Menghitung faktorial secara rekursif
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 10;
    float y = 3.14;
    char name[] = "OtomataLab";

    if (x > 5 && y < 10.0) {
        printf("Hello, %s!\\n", name);
        printf("Factorial(%d) = %d\\n", x, factorial(x));
    }

    for (int i = 0; i < 5; i++) {
        printf("i = %d\\n", i);
    }

    return 0;
}`;e.s(["default",0,function(){let[e,t]=(0,l.useState)(x),[n,s]=(0,l.useState)("c"),[o,d]=(0,l.useState)(null),[u,c]=(0,l.useState)(!1),[p,m]=(0,l.useState)(null),h=(0,l.useCallback)(async()=>{if(e.trim()){c(!0),m(null);try{let a=await f(e,n);d(a)}catch(e){m(e instanceof Error?e.message:"Terjadi kesalahan")}finally{c(!1)}}},[e,n]);return(0,a.jsxs)("div",{className:g.default.container,children:[(0,a.jsx)("div",{className:`${g.default.pageHeader} animate-fade-up`,children:(0,a.jsxs)("div",{className:g.default.pageHeaderLeft,children:[(0,a.jsx)("span",{className:g.default.pageBadge,children:"Praktikum 1"}),(0,a.jsx)("h1",{className:g.default.pageTitle,children:"Lexical Analyzer"}),(0,a.jsx)("p",{className:g.default.pageDesc,children:"Analisis kode program dan kelompokkan token berdasarkan kategori menggunakan algoritma DFA (Deterministic Finite Automaton)."})]})}),(0,a.jsx)("div",{className:"animate-fade-up-1",children:(0,a.jsx)(_,{stats:o?.stats??null})}),(0,a.jsxs)("div",{className:g.default.grid,children:[(0,a.jsx)("div",{className:`${g.default.panelWrap} animate-fade-up-2`,children:(0,a.jsx)(r,{code:e,lang:n,onCodeChange:t,onLangChange:s,onAnalyze:h,loading:u})}),(0,a.jsx)("div",{className:`${g.default.panelWrap} animate-fade-up-3`,children:(0,a.jsx)(i,{result:o,loading:u,error:p})})]}),(0,a.jsxs)("div",{className:`${g.default.legend} animate-fade-up-4`,children:[(0,a.jsx)("span",{className:g.default.legendLabel,children:"Legenda:"}),b.map(e=>(0,a.jsx)("span",{className:`token-badge ${e.cls}`,children:e.label},e.cls))]})]})}],57826)}]);