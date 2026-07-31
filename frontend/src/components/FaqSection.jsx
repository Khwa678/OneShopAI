import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { translations } from '../utils/translations';

export default function FaqSection({ lang }) {
  const t = translations[lang] || translations.en;

  const faqs = [
    {
      q: "What is the accuracy rate of Docs Playground?",
      a: "Our AI document processing platform boasts a 98.4% accuracy rate for OCR text extraction, legal clause detection, and summary key-point synthesis powered by deep neural network models."
    },
    {
      q: "Who benefits from Docs Playground AI content detector & document tools?",
      a: "Students, legal professionals, recruiters, researchers, enterprise teams, and software engineers benefit daily by saving hours summarizing long contracts, analyzing resumes against ATS benchmarks, and converting scanned PDFs to editable text."
    },
    {
      q: "Will my text get plagiarized or be available online, if I check it on Docs Playground?",
      a: "No. Your documents and data privacy are 100% safe and encrypted. We never publish, index, store, or sell your documents to public databases or search engines."
    },
    {
      q: "How can I integrate Docs Playground tools in my organization or website?",
      a: "We provide high-speed RESTful API keys supporting bulk document processing, webhooks, and enterprise SSO integrations. Check our API documentation or contact enterprise support."
    },
    {
      q: "Does Docs Playground work with different languages?",
      a: "Yes! Our OCR and document analysis tools support multi-language text recognition for over 50+ languages including English, Spanish, French, German, Hindi, Chinese, and Japanese."
    },
    {
      q: "How can I cite the AI detector and document agent?",
      a: "You can cite our analysis results using APA, MLA, or Chicago format by referencing the timestamped analysis certificate generated in your document history dashboard."
    }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq-section">
      <h2 className="section-title-center">{t.faqHeader}</h2>
      <div>
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="faq-item">
              <button 
                className="faq-question" 
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <span>{faq.q}</span>
                {isOpen ? <Minus size={18} color="#095475" /> : <Plus size={18} color="#94a3b8" />}
              </button>
              {isOpen && <div className="faq-answer">{faq.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
