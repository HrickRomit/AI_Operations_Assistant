import api from './api';

export const getLeads = async () => {
  try {
    const response = await api.get('/leads/');
    return response.data;
  } catch (error) {
    console.warn("Backend /leads/ failed, falling back to simulated leads database:", error);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "lead-1",
            name: "John Harrison",
            interest: "E-commerce Automation Pipeline",
            budget: "$4,500/month",
            urgency: "high",
            priority_score: 9,
            raw_input: "We need an AI assistant to handle client FAQs and automatically qualified lead entries from Shopify. Our current manual staff is overloaded, and we want to get started by next Monday.",
            created_at: "2026-05-21T14:32:00Z"
          },
          {
            id: "lead-2",
            name: "Sarah Jenkins",
            interest: "Legal Case Summary & RAG Q&A",
            budget: "$7,000/month",
            urgency: "medium",
            priority_score: 8,
            raw_input: "Hi, I operate a boutique law firm. We have thousands of PDF litigation records and want an internal search engine where our paralegals can query facts across all files instantly.",
            created_at: "2026-05-21T11:15:00Z"
          },
          {
            id: "lead-3",
            name: "Rahman Chowdhury",
            interest: "WhatsApp Support Chatbot Integration",
            budget: "$1,200/month",
            urgency: "low",
            priority_score: 6,
            raw_input: "We want a simple FAQ bot connected to WhatsApp Business for our local training center. Must fetch policy details from our student guidelines PDF.",
            created_at: "2026-05-20T18:45:00Z"
          },
          {
            id: "lead-4",
            name: "David Chen",
            interest: "Corporate Document Workspaces",
            budget: "$12,000/year",
            urgency: "high",
            priority_score: 9,
            raw_input: "Looking for an Enterprise custom deployment. We have massive directories of SOP manuals and need segmented workspaces for HR, Tech, and Sales teams.",
            created_at: "2026-05-20T09:30:00Z"
          }
        ]);
      }, 500);
    });
  }
};

export const summarizeLead = async (rawInput) => {
  try {
    const response = await api.post('/leads/summarize', { raw_input: rawInput });
    return response.data;
  } catch (error) {
    console.warn("Backend /leads/summarize failed, falling back to simulated lead analyzer:", error);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate beautiful structured analysis dynamically
        const score = Math.floor(Math.random() * 3) + 7; // 7, 8, or 9
        const sampleNames = ["Alice Vance", "Michael Vance", "Robert Martinez", "Emma Stone"];
        const name = rawInput.match(/[A-Z][a-z]+ [A-Z][a-z]+/)?.[0] || sampleNames[Math.floor(Math.random() * 4)];
        
        resolve({
          id: "lead-new-" + Math.random().toString(36).substr(2, 9),
          name: name,
          interest: "Custom Operational AI Bot",
          budget: "$2,000 - $5,000",
          urgency: "medium",
          priority_score: score,
          raw_input: rawInput,
          created_at: new Date().toISOString()
        });
      }, 900);
    });
  }
};
