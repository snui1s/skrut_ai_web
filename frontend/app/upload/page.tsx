
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
    fetch('http://localhost:8000/job-description')
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
      const jdRes = await fetch('http://localhost:8000/job-description?content=' + encodeURIComponent(jobDescription), {
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
            const response = await fetch('http://localhost:8000/evaluate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Analysis failed for ${file.name}`);

            const result = await response.json();
            results.push({
                filename: file.name,
                ...result
            });

        } catch (err) {
            console.error(err);
             // FALLBACK: If total failure (e.g. 500 error), still try to show something useful
             // For a real app, maybe we parse the partial response if possible, but here we just give a generic error state
             // User requested "latest score if fail", but since this is a fetch failure, we don't have ANY score from the backend.
             // We will stick to "0" or "Error" here, as we literally have nothing. 
             // BUT, if the user meant "If the Agent FAILS to pass", the backend already returns the latest score anyway!
             // So this catch block is only for NETWORK/SERVER errors.
            results.push({
                filename: file.name,
                score: '0', // Or "Error"
                analysis: 'System Error: Failed to process this file. Please try again.',
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

      <main className="flex-grow py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
              Start Evaluation
            </h1>
            <p className="text-muted text-lg">
              Paste the Job Description and upload resumes. <br/>
              <span className="text-primary font-semibold text-sm">Files are processed in-memory and deleted immediately.</span>
            </p>
          </div>
          
          {/* Main Card Content */}
          <div className={`space-y-8 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-secondary/10 shadow-sm transition-all duration-500 ${isUploading ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
            
            {/* Step 1: Job Description */}
            <div className="space-y-4">
              <label className="block text-xl font-bold text-secondary">
                1. Job Description (JD)
              </label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 p-4 rounded-xl border border-secondary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y text-secondary placeholder:text-muted/50"
              />
            </div>

            {/* Step 2: Upload Resume */}
            <div className="space-y-4">
              <label className="block text-xl font-bold text-secondary">
                2. Upload Resumes
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                  files.length > 0 ? 'border-primary/50 bg-primary/5' : 'border-secondary/20 hover:border-primary/50 hover:bg-white'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  multiple
                  onChange={handleFileChange}
                />
                
                <div className="w-16 h-16 bg-secondary/5 text-secondary/40 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div>
                   <p className="font-semibold text-secondary text-lg">Click to Upload or Drag & Drop</p>
                   <p className="text-sm text-muted">Supports PDF, PNG, JPG (Multiple files allowed)</p>
                </div>
              </div>

              {/* File List with Status */}
              {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                      {files.map((file, index) => {
                          // Determine status for this specific file
                          let statusIcon = (
                             <div className="p-2 bg-red-50 text-red-500 rounded-md flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                             </div>
                          );
                          let rowClass = "bg-white border-secondary/10";
                          
                          if (isUploading) {
                              if (index < processedCount) {
                                  // Completed
                                  statusIcon = (
                                      <div className="p-2 bg-green-100 text-green-600 rounded-md flex-shrink-0">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      </div>
                                  );
                                  rowClass = "bg-green-50/30 border-green-200";
                              } else if (index === processedCount) {
                                  // Processing (Current)
                                  statusIcon = (
                                      <div className="p-2 bg-primary/10 text-primary rounded-md flex-shrink-0 animate-pulse">
                                          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                                      </div>
                                  );
                                  rowClass = "bg-primary/5 border-primary/30 ring-1 ring-primary/20";
                              } else {
                                  // Pending
                                  statusIcon = (
                                      <div className="p-2 bg-gray-100 text-gray-400 rounded-md flex-shrink-0">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                      </div>
                                  );
                                  rowClass = "bg-gray-50 border-gray-100 opacity-60";
                              }
                          }

                          return (
                            <div key={index} className={`flex items-center justify-between p-3 border rounded-lg shadow-sm transition-all duration-300 ${rowClass}`}>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {statusIcon}
                                    <div className="truncate">
                                        <p className={`text-sm font-medium truncate ${index === processedCount && isUploading ? 'text-primary' : 'text-secondary'}`}>
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                {!isUploading && (
                                    <button 
                                        onClick={() => handleRemoveFile(index)}
                                        className="p-2 hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </div>
                          );
                      })}
                  </div>
              )}
            </div>
            
            {/* Submit Button (Hidden when uploading to show cleaner UI) */}
             {!isUploading && (
                <div className="pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={isUploading || files.length === 0}
                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isUploading || files.length === 0
                        ? 'bg-secondary/10 text-secondary/40 cursor-not-allowed shadow-none' 
                        : 'bg-primary text-white hover:bg-opacity-90 hover:-translate-y-1 hover:shadow-primary/25'
                    }`}
                >
                     {files.length > 1 ? `Analyze ${files.length} Resumes` : "Analyze Resume"}
                </button>
                </div>
             )}

          </div>
          
          {/* --- PROGRESS UI SECTION --- */}
          {isUploading && (
              <div className="fixed inset-x-0 bottom-0 md:static md:mt-8 p-6 md:p-0 bg-white md:bg-transparent border-t md:border-t-0 border-secondary/10 shadow-2xl md:shadow-none z-50 animate-fade-in-up">
                  <div className="bg-white p-8 rounded-3xl border border-secondary/10 shadow-lg md:shadow-sm space-y-6 max-w-3xl mx-auto">
                      
                      {/* Header Status */}
                      <div className="flex items-center justify-between">
                          <div>
                              <h3 className="text-xl font-bold text-secondary">
                                  {loadingStatus === 'completed' ? "Analysis Complete!" : "AI Analysis in Progress"}
                              </h3>
                              <p className="text-muted text-sm mt-1">
                                  {loadingStatus === 'saving_jd' && "Initializing Job Description..."}
                                  {loadingStatus === 'analyzing' && `Analyzing... ${currentFileName}`}
                                  {loadingStatus === 'completed' && "Redirecting to results..."}
                              </p>
                          </div>
                          <div className="text-right">
                               <span className="text-3xl font-black text-primary">
                                   {Math.round((processedCount / files.length) * 100)}%
                               </span>
                          </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-secondary/5 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(processedCount / files.length) * 100}%` }}
                          ></div>
                      </div>
                      
                      {/* Fun Fact / Messages */}
                      <div className="flex items-center gap-3 text-sm text-secondary/60 bg-secondary/5 p-4 rounded-xl">
                          <div className="w-5 h-5 flex items-center justify-center">
                              {loadingStatus === 'completed' ? '✅' : <span className="animate-spin">⏳</span>}
                          </div>
                          <p className="italic">
                              {loadingStatus === 'analyzing' 
                                ? "Reviewer and Auditor are debating this candidate's qualifications..." 
                                : "Skrut AI is ensuring fair and unbiased evaluations."}
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
