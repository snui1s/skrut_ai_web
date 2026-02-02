
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function UploadPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Progress State
  const [processedCount, setProcessedCount] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [loadingStatus, setLoadingStatus] = useState<"idle" | "saving_jd" | "analyzing" | "completed">("idle");


  // Fetch existing JD on mount
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/job-description`)
      .then(res => res.json())
      .then(data => {
        if (data.content) setJobDescription(data.content);
      })
      .catch(err => console.error("Failed to fetch JD:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      // Reset input value to allow selecting the same file again if needed
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Define Strict Types
  interface ChatMessage {
    role: "Reviewer" | "Auditor";
    content: string;
    timestamp: number;
  }

  interface AnalysisResult {
    filename: string;
    score: string;
    analysis: string;
    conversation_log: ChatMessage[];
    status?: string;
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    setIsUploading(true);
    setLoadingStatus("saving_jd");
    setProcessedCount(0);
    const results: AnalysisResult[] = [];

    try {
      // 1. Update Job Description (Once)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const jdRes = await fetch(`${apiUrl}/job-description?content=` + encodeURIComponent(jobDescription), {
        method: 'POST',
      });
      
      if (!jdRes.ok) throw new Error("Failed to save Job Description");

      // 2. Process Files sequentially
      setLoadingStatus("analyzing");
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileName(file.name);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/evaluate`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Analysis failed for ${file.name}`);

            // Handle Streaming Response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            
            if (!reader) throw new Error("Could not get stream reader");

            let done = false;
            let buffer = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
                buffer += chunk;

                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const event = JSON.parse(line);
                        
                        if (event.status === "progress") {
                            // Update the UI with the detailed agent status
                            setLoadingStatus("analyzing");
                            setCurrentFileName(`${file.name} — ${event.message}`);
                        } else if (event.status === "completed") {
                            results.push({
                                filename: file.name,
                                ...event
                            });
                        } else if (event.status === "error") {
                            console.error(`Error analyzing ${file.name}: ${event.message}`);
                            throw new Error(event.message);
                        }
                    } catch (e) {
                        console.error("Failed to parse stream line:", line, e);
                    }
                }
            }

        } catch (err) {
            console.error(err);
            results.push({
                filename: file.name,
                score: '0',
                analysis: `Error: ${err instanceof Error ? err.message : 'Failed to process this file.'}`,
                conversation_log: []
            });
        }
        
        setProcessedCount(i + 1);
      }
      
      setLoadingStatus("completed");
      
      // Short delay to show completion 100%
      setTimeout(() => {
          // 3. Store Result in SessionStorage (Array)
          sessionStorage.setItem('latest_analysis_results', JSON.stringify(results));
    
          // 4. Navigate to Result Page
          router.push(`/results/latest`);
      }, 1000); 


    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setIsUploading(false);
      setLoadingStatus("idle");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main className="flex-grow py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
              Start Evaluation
            </h1>
            <p className="text-base md:text-lg text-muted px-2">
              Paste the Job Description and upload resumes. <br className="hidden sm:block"/>
              <span className="text-primary font-bold text-xs sm:text-sm">Processed in-memory & deleted instantly.</span>
            </p>
          </div>
          
          {/* Main Card Content */}
          <div className={`space-y-6 md:space-y-8 bg-white/50 backdrop-blur-sm p-5 md:p-8 rounded-3xl border border-secondary/10 shadow-sm transition-all duration-500 ${isUploading ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
            
            {/* Step 1: Job Description */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-lg md:text-xl font-bold text-secondary">
                1. Job Description (JD)
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-32 md:h-40 p-4 rounded-xl border border-secondary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y text-sm md:text-base text-secondary placeholder:text-muted/50 transition-all font-medium"
              />
            </div>

            {/* Step 2: Upload Resume */}
            <div className="space-y-3 md:space-y-4">
              <label className="block text-lg md:text-xl font-bold text-secondary">
                2. Upload Resumes
              </label>
              <label 
                className={`border-2 border-dashed rounded-xl p-6 md:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 md:gap-4 ${
                  files.length > 0 ? 'border-primary/50 bg-primary/5 shadow-inner' : 'border-secondary/20 hover:border-primary/50 hover:bg-white shadow-sm'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  multiple
                  onChange={handleFileChange}
                />
                
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/5 text-secondary/40 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div>
                   <p className="font-bold text-secondary text-base md:text-lg">Click or Drag & Drop</p>
                   <p className="text-[10px] md:text-sm text-muted mt-1 uppercase tracking-wider font-semibold">PDF files only (Digital)</p>
                </div>
              </label>

              {/* File List with Status */}
              {files.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                      {files.map((file, index) => {
                          // Note: Same logic for statusIcon and rowClass
                          let statusIcon = (
                             <div className="p-1.5 md:p-2 bg-red-50 text-red-500 rounded-lg flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                             </div>
                          );
                          let rowClass = "bg-white border-secondary/10";
                          
                          if (isUploading) {
                              if (index < processedCount) {
                                  statusIcon = (
                                      <div className="p-1.5 md:p-2 bg-green-100 text-green-600 rounded-lg flex-shrink-0">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      </div>
                                  );
                                  rowClass = "bg-green-50/30 border-green-200";
                              } else if (index === processedCount) {
                                  statusIcon = (
                                      <div className="p-1.5 md:p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0 animate-pulse">
                                          <svg className="animate-spin w-[14px] h-[14px] md:w-4 md:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                                      </div>
                                  );
                                  rowClass = "bg-primary/5 border-primary/30 ring-1 ring-primary/20";
                              } else {
                                  statusIcon = (
                                      <div className="p-1.5 md:p-2 bg-gray-100 text-gray-400 rounded-lg flex-shrink-0">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                      </div>
                                  );
                                  rowClass = "bg-border border-gray-100 opacity-60";
                              }
                          }

                          return (
                            <div key={index} className={`flex items-center justify-between p-2.5 md:p-3 border rounded-xl shadow-sm transition-all duration-300 ${rowClass}`}>
                                <div className="flex items-center gap-2.5 md:gap-3 overflow-hidden">
                                    {statusIcon}
                                    <div className="truncate">
                                        <p className={`text-xs md:text-sm font-bold truncate ${index === processedCount && isUploading ? 'text-primary' : 'text-secondary'}`}>
                                            {file.name}
                                        </p>
                                        <p className="text-[10px] md:text-xs text-muted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                {!isUploading && (
                                    <button 
                                        onClick={() => handleRemoveFile(index)}
                                        className="p-1.5 md:p-2 hover:bg-red-50 text-secondary/30 hover:text-red-500 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </div>
                          );
                      })}
                  </div>
              )}
            </div>
            
            {/* Submit Button */}
             {!isUploading && (
                <div className="pt-2">
                <button 
                    onClick={handleSubmit}
                    disabled={isUploading || files.length === 0}
                    className={`w-full py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isUploading || files.length === 0
                        ? 'bg-secondary/10 text-secondary/40 cursor-not-allowed shadow-none' 
                        : 'bg-primary text-white hover:bg-opacity-90 hover:-translate-y-1 hover:shadow-primary/25 shadow-primary/20'
                    }`}
                >
                     {files.length > 1 ? `Analyze ${files.length} Resumes` : "Analyze Resume"}
                </button>
                </div>
             )}

          </div>
          
          {/* --- PROGRESS UI SECTION --- */}
          {isUploading && (
              <div className="fixed inset-x-0 bottom-0 md:static md:mt-8 p-4 md:p-0 bg-background/80 backdrop-blur-lg md:bg-transparent border-t md:border-t-0 border-secondary/5 shadow-2xl md:shadow-none z-50 animate-fade-in-up">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-secondary/10 shadow-lg md:shadow-sm space-y-5 md:space-y-6 max-w-3xl mx-auto">
                      
                      {/* Header Status */}
                      <div className="flex items-center justify-between">
                          <div className="overflow-hidden">
                              <h3 className="text-lg md:text-xl font-bold text-secondary truncate">
                                  {loadingStatus === 'completed' ? "Analysis Complete!" : "AI Analysis Running"}
                              </h3>
                              <p className="text-muted text-[10px] md:text-sm mt-0.5 md:mt-1 truncate">
                                  {loadingStatus === 'saving_jd' && "Initializing Job Description..."}
                                  {loadingStatus === 'analyzing' && `Analyzing... ${currentFileName}`}
                                  {loadingStatus === 'completed' && "Redirecting to results..."}
                              </p>
                          </div>
                          <div className="text-right pl-4">
                               <span className="text-2xl md:text-3xl font-black text-primary">
                                   {Math.round((processedCount / files.length) * 100)}%
                               </span>
                          </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-secondary/5 rounded-full h-2 md:h-3 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                            style={{ width: `${(processedCount / files.length) * 100}%` }}
                          ></div>
                      </div>
                      
                      {/* Fun Fact / Messages */}
                      <div className="flex items-center gap-3 text-[11px] md:text-sm text-secondary/60 bg-secondary/5 p-3 md:p-4 rounded-xl">
                          <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center flex-shrink-0">
                              {loadingStatus === 'completed' ? '✅' : <span className="animate-spin text-xs">⏳</span>}
                          </div>
                          <p className="italic leading-snug">
                              {loadingStatus === 'analyzing' 
                                ? "Agents are cross-referencing candidate skills..." 
                                : "Ensuring honest and precise evaluations."}
                          </p>
                      </div>

                  </div>
              </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
