
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReactMarkdown from 'react-markdown';
import * as XLSX from 'xlsx';

interface ChatMessage {
  role: "Reviewer" | "Auditor";
  content: string;
  timestamp: number;
}

interface AnalysisResult {
    filename: string;
    candidate_name: string; // New
    email: string;          // New
    score: string;
    analysis: string;
    conversation_log: ChatMessage[];
}

export default function ResultPage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsExportOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    // Load Data
    const storedData = sessionStorage.getItem('latest_analysis_results');
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            let dataArr = Array.isArray(parsed) ? parsed : [parsed];
            
            // Sort by Score Descending
            dataArr.sort((a: AnalysisResult, b: AnalysisResult) => {
                const scoreA = parseFloat(a.score) || 0;
                const scoreB = parseFloat(b.score) || 0;
                return scoreB - scoreA;
            });
            
            setResults(dataArr);
        } catch (e) {
            console.error(e);
        }
    } else {
        const singleData = sessionStorage.getItem('latest_analysis');
        if (singleData) setResults([JSON.parse(singleData)]);
    }
  }, []);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const exportToCSV = () => {
    const headers = ["Candidate", "Email", "Score", "Analysis", "Filename"];
    const rows = results.map(res => [
      res.candidate_name || "Unknown",
      res.email || "N/A",
      res.score,
      res.analysis.replace(/\n/g, " ").replace(/"/g, '""'),
      res.filename
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `evaluation_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLSX = () => {
    const data = results.map(res => ({
      "Candidate": res.candidate_name || "Unknown",
      "Email": res.email || "N/A",
      "Score": res.score,
      "Key Analysis": res.analysis.replace(/[#*]/g, ''),
      "Filename": res.filename
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    
    // Auto-size columns (basic)
    const maxWidths = [20, 30, 10, 50, 20];
    worksheet["!cols"] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, `evaluation_results_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };



  if (results.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
          <p className="text-secondary/60 font-bold animate-pulse tracking-wide uppercase text-xs">Preparing Evaluation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground pb-[env(safe-area-inset-bottom)] antialiased">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-secondary text-balance">Evaluation Results</h1>
                <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                        {results.length} Candidates
                    </span>
                    <span className="bg-secondary/5 text-secondary/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Auto-Sorted by Score
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] md:rounded-3xl border border-secondary/10 shadow-sm overflow-hidden">
                {/* Desktop Version: TABLE (hidden on mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/5 text-secondary border-b border-secondary/10">
                                <th className="p-6 font-bold text-sm uppercase tracking-wider">Candidate</th>
                                <th className="p-6 font-bold text-sm uppercase tracking-wider">Score</th>
                                <th className="p-6 font-bold text-sm uppercase tracking-wider w-1/2">Key Analysis</th>
                                <th className="p-6 font-bold text-sm uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/5">
                            {results.map((res, idx) => (
                                <React.Fragment key={idx}>
                                    <tr 
                                        onClick={() => toggleRow(idx)}
                                        className={`transition-colors cursor-pointer group ${
                                            expandedRow === idx ? 'bg-primary/5' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-secondary text-base group-hover:text-primary transition-colors">
                                                    {res.candidate_name && res.candidate_name !== "Candidate" ? res.candidate_name : "Unknown Candidate"}
                                                </span>
                                                {res.email && res.email !== "N/A" && (
                                                    <span className="text-xs text-secondary/60 mt-0.5">{res.email}</span>
                                                )}
                                                 <span className="text-[10px] text-secondary/30 mt-1 truncate max-w-[150px]" title={res.filename}>
                                                    File: {res.filename}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 tabular-nums">
                                                <span className={`text-2xl font-black ${
                                                    Number(res.score) >= 7 ? 'text-green-600' : 
                                                    Number(res.score) >= 5 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                    {res.score}
                                                </span>
                                                <span className="text-secondary/30 text-xs font-medium">/ 10</span>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <div className="line-clamp-2 text-sm text-secondary/70">
                                                {res.analysis.replace(/[#*]/g, '')}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="text-sm font-bold text-primary relative group/btn overflow-hidden rounded px-2 py-1">
                                                <span className="relative z-10">{expandedRow === idx ? 'Close' : 'View Details'}</span>
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/btn:w-full"></span>
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Detail (Desktop) */}
                                    {expandedRow === idx && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={5} className="p-0">
                                                <div className="p-8 border-t border-secondary/5 space-y-8 animate-fade-in-down">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                        <div className="lg:col-span-1">
                                                            <h3 className="text-sm font-bold uppercase text-secondary/50 mb-3">AI Verdict</h3>
                                                            <div className="bg-white p-5 rounded-xl border border-secondary/10 shadow-sm text-sm text-secondary leading-relaxed prose prose-sm max-w-none">
                                                                <ReactMarkdown>{res.analysis}</ReactMarkdown>
                                                            </div>
                                                        </div>
                                                        <div className="lg:col-span-2">
                                                             <div className="flex items-center justify-between mb-3">
                                                                <h3 className="text-sm font-bold uppercase text-secondary/50">Agent Discussion Log</h3>
                                                             </div>
                                                             <div className="bg-white rounded-xl border border-secondary/10 shadow-sm overflow-hidden">
                                                                <div className="max-h-96 overflow-y-auto p-5 space-y-6">
                                                                     {res.conversation_log && res.conversation_log.map((msg, i) => (
                                                                        <div key={i} className={`flex gap-4 ${msg.role === 'Auditor' ? 'flex-row-reverse' : ''}`}>
                                                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black shadow-sm ${
                                                                               msg.role === 'Reviewer' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                                            }`}>
                                                                                {msg.role[0]}
                                                                            </div>
                                                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                                                               msg.role === 'Reviewer' 
                                                                                ? 'bg-white text-secondary rounded-tl-none border border-secondary/5' 
                                                                                : 'bg-orange-50 text-secondary rounded-tr-none border border-orange-100'
                                                                            }`}>
                                                                                <div className={`mb-2 text-[10px] font-black uppercase tracking-wider ${
                                                                                    msg.role === 'Reviewer' ? 'text-blue-600/50' : 'text-orange-600/50'
                                                                                }`}>{msg.role}</div>
                                                                                 <div className="prose prose-sm max-w-none">
                                                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                                                 </div>
                                                                            </div>
                                                                        </div>
                                                                     ))}
                                                                </div>
                                                             </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Version: CARD LIST (hidden on desktop) */}
                <div className="md:hidden flex flex-col divide-y divide-secondary/5">
                    {results.map((res, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div 
                                onClick={() => toggleRow(idx)}
                                className={`p-4 md:p-5 space-y-4 transition-colors cursor-pointer ${expandedRow === idx ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <h3 className="font-bold text-secondary text-base leading-tight truncate">
                                            {res.candidate_name && res.candidate_name !== "Candidate" ? res.candidate_name : "Unknown"}
                                        </h3>
                                        {res.email && res.email !== "N/A" && (
                                            <span className="text-xs text-secondary/60 mt-1 truncate">{res.email}</span>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-1 bg-white border border-secondary/10 px-2 py-1.5 rounded-xl shadow-sm tabular-nums">
                                        <span className={`text-lg font-black ${
                                            Number(res.score) >= 7 ? 'text-green-600' : 
                                            Number(res.score) >= 5 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {res.score}
                                        </span>
                                        <span className="text-[9px] text-secondary/30 font-bold">/10</span>
                                    </div>
                                </div>
                                <p className="text-sm text-secondary/70 line-clamp-2 italic leading-relaxed text-pretty">
                                    "{res.analysis.replace(/[#*]/g, '').slice(0, 100)}..."
                                </p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[10px] text-secondary/20 font-medium truncate max-w-[150px]">
                                        {res.filename}
                                    </span>
                                    <span className="text-xs font-bold text-primary">
                                        {expandedRow === idx ? 'Hide Results' : 'Read Full Analysis →'}
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Expanded Detail */}
                            {expandedRow === idx && (
                                <div className="p-5 bg-gray-50/50 border-t border-secondary/5 space-y-8 animate-fade-in-up">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-secondary/40">AI Verdict</h4>
                                        <div className="bg-white p-4 rounded-2xl border border-secondary/10 text-sm text-secondary leading-relaxed prose prose-sm max-w-none shadow-sm">
                                            <ReactMarkdown>{res.analysis}</ReactMarkdown>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-secondary/40">Agent Negotiation</h4>
                                        <div className="space-y-4">
                                            {res.conversation_log && res.conversation_log.map((msg, i) => (
                                                <div key={i} className={`flex gap-3 ${msg.role === 'Auditor' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                                                        msg.role === 'Reviewer' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                    }`}>
                                                        {msg.role[0]}
                                                    </div>
                                                    <div className={`p-3 rounded-2xl text-xs ${
                                                        msg.role === 'Reviewer' ? 'bg-white text-secondary' : 'bg-orange-50/80 text-secondary'
                                                    } border border-secondary/5 shadow-sm max-w-[85%]`}>
                                                        <div className="mb-1 font-black opacity-30 uppercase tracking-tighter text-[9px]">{msg.role}</div>
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
              <div className="flex justify-end relative" ref={dropdownRef}>
                 <div className="inline-flex rounded-xl shadow-lg shadow-primary/20 overflow-hidden">
                     <button 
                         onClick={exportToXLSX}
                         className="bg-primary text-white px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 border-r border-white/10 active:scale-95"
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                         Export Results
                     </button>
                     <button 
                         onClick={() => setIsExportOpen(prev => !prev)}
                         className="bg-primary text-white px-3 py-3 hover:bg-primary/90 transition-all flex items-center active:scale-95"
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                     </button>
                 </div>

                {isExportOpen && (
                    <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl border border-secondary/10 shadow-2xl overflow-hidden z-50 animate-fade-in-down">
                        <div className="p-2 space-y-1">
                            <button 
                                onClick={() => { exportToXLSX(); setIsExportOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
                                Excel (.xlsx)
                            </button>
                            <button 
                                onClick={() => { exportToCSV(); setIsExportOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/></svg>
                                CSV (.csv)
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
