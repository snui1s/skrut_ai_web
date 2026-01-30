
"use client";

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReactMarkdown from 'react-markdown';

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
            
             <div className="flex justify-end">
                <button 
                  onClick={() => alert("feature coming soon!")}
                  className="text-secondary/40 text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Results to CSV
                </button>
            </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
