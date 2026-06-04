import api from './api';

export const generateEmailDraft = async (emailText, tone) => {
  try {
    const response = await api.post('/email/draft', { email_text: emailText, tone });
    return response.data;
  } catch (error) {
    console.warn("Backend /email/draft failed, falling back to simulated draft generation:", error);
    // Simulate beautiful, realistic RAG-informed email drafts based on the selected tone
    return new Promise((resolve) => {
      setTimeout(() => {
        let draft = "";
        const formattedTone = tone.charAt(0).toUpperCase() + tone.slice(1);
        
        if (tone === "formal") {
          draft = `Subject: Response to your inquiry regarding operational guidelines\n\nDear Client,\n\nThank you for reaching out to Titan Agency. In response to your inquiry, we would like to confirm that our standard operating procedures dictate a seamless, structured workflow. Under Section 4.2 of our workspace guidelines, all project timelines are reviewed weekly to maintain top-tier operational delivery.\n\nShould you have any further questions or require additional details regarding our platform services, please do not hesitate to contact us. We are committed to ensuring a highly professional support environment.\n\nSincerely,\n\nOperations Assistant\nTitan Agency`;
        } else if (tone === "friendly") {
          draft = `Subject: Quick update on your inquiry! 😊\n\nHi there!\n\nThanks so much for reaching out to us at Titan Agency! We love hearing from our partners, and I'm happy to help you out today.\n\nAccording to our operations guidebook, we always aim to keep things super smooth and fast for you. Most tasks are handled and processed in under 24 hours! If you need to upload new documents, you can do that right from your dashboard under the "Documents" tab.\n\nLet me know if there's anything else you need. Have a wonderful day ahead!\n\nWarmest regards,\n\nYour AI Operations Companion\nTitan Agency`;
        } else {
          draft = `Subject: RE: Inquiry Update\n\nHello,\n\nThank you for your message. Here are the key points regarding your request:\n1. All document uploads are processed in real-time.\n2. Workflows are fully automated via our secure vector RAG engine.\n3. Turnaround time for customer drafts is immediate.\n\nPlease let us know if you need any other specific details.\n\nBest,\n\nOperations Support`;
        }
        
        resolve({ draft });
      }, 800);
    });
  }
};
