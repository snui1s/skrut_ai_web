
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
        <div className="flex flex-col min-h-screen bg-background items-center justify-center">
             <Header />
            <p className="text-secondary animate-pulse mt-20">Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary">Candidate Evaluation Results</h1>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">
                    {results.length} Processed
                </span>
            </div>

            <div className="bg-white rounded-3xl border border-secondary/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
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
                                                    Example: {res.filename}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
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
                                            <button className="text-sm font-bold text-primary hover:underline">
                                                {expandedRow === idx ? 'Close Details' : 'View Details'}
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Detail Row */}
                                    {expandedRow === idx && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={5} className="p-0">
                                                <div className="p-8 border-t border-secondary/5 space-y-8 animate-fade-in-down">
                                                    
                                                    {/* Full Analysis Block */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                        <div className="lg:col-span-1">
                                                            <h3 className="text-sm font-bold uppercase text-secondary/50 mb-3">AI Verdict</h3>
                                                            <div className="bg-white p-5 rounded-xl border border-secondary/10 shadow-sm text-sm text-secondary leading-relaxed prose prose-sm">
                                                                <ReactMarkdown>{res.analysis}</ReactMarkdown>
                                                            </div>
                                                        </div>

                                                        {/* Conversation Log */}
                                                        <div className="lg:col-span-2">
                                                             <div className="flex items-center justify-between mb-3">
                                                                <h3 className="text-sm font-bold uppercase text-secondary/50">Agent Discussion Log</h3>
                                                                <span className="text-[10px] bg-secondary/5 px-2 py-1 rounded text-secondary/40">Powered by ResumeJudgeGraph</span>
                                                             </div>
                                                             
                                                             <div className="bg-white rounded-xl border border-secondary/10 shadow-sm overflow-hidden">
                                                                <div className="max-h-96 overflow-y-auto p-5 space-y-6">
                                                                     {res.conversation_log && res.conversation_log.map((msg, i) => (
                                                                        <div key={i} className={`flex gap-3 ${msg.role === 'Auditor' ? 'flex-row-reverse' : ''}`}>
                                                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                                                               msg.role === 'Reviewer' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                                            }`}>
                                                                                {msg.role[0]}
                                                                            </div>
                                                                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                                                               msg.role === 'Reviewer' ? 'bg-gray-50 text-secondary' : 'bg-orange-50/50 text-secondary'
                                                                            }`}>
                                                                                <div className="mb-1 text-xs font-bold opacity-50">{msg.role}</div>
                                                                                 <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                                            </div>
                                                                        </div>
                                                                     ))}
                                                                     {(!res.conversation_log || res.conversation_log.length === 0) && (
                                                                         <p className="text-center text-secondary/40 text-sm">No discussion log available.</p>
                                                                     )}
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
            </div>
            
             <div className="flex justify-end relative" ref={dropdownRef}>
                <div className="inline-flex rounded-xl shadow-md overflow-hidden border border-primary/20">
                    <button 
                        onClick={exportToXLSX}
                        className="bg-primary text-white px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 border-r border-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export Results
                    </button>
                    <button 
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="bg-primary text-white px-3 py-2.5 hover:bg-primary/90 transition-all flex items-center"
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
