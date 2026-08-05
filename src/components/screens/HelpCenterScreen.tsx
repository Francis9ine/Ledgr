import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { Card, Button, Modal, Badge } from '../common/UIComponents';
import { FAQItem } from '../../types/finance';

interface HelpCenterScreenProps {
  faqs: FAQItem[];
}

export const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ faqs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [showContactModal, setShowContactModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const categories = ['All', 'Security', 'Budgeting', 'General', 'Investments'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setShowContactModal(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Search Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <Badge variant="emerald" className="bg-white/20 text-white border-white/30 mb-3">
            Ledgr Help Center
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            How can we assist you today?
          </h2>
          <p className="text-xs text-emerald-100 mt-2 font-normal">
            Search our bank-grade encryption documentation, budgeting guides, and FAQs
          </p>

          <div className="relative mt-6 max-w-lg mx-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search e.g. bank connection, 2FA, budget rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white text-slate-900 rounded-xl shadow-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>
      </div>

      {/* Category Pills & Contact CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowContactModal(true)}
          icon={<MessageSquare className="w-4 h-4" />}
        >
          Contact Priority Support
        </Button>
      </div>

      {/* FAQ Accordion List */}
      <Card>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
          Frequently Asked Questions ({filteredFaqs.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div key={faq.id} className="py-3.5">
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 ml-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/40">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-400">
              No matching questions found for "{searchQuery}".
            </p>
          )}
        </div>
      </Card>

      {/* Contact Support Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Ledgr Support"
      >
        {!ticketSent ? (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Our financial concierge team responds within 2 hours to priority support inquiries.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Account Sync Question"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message / Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your request in detail..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowContactModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                Submit Support Ticket
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ticket Submitted Successfully!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reference #LDG-{Math.floor(100000 + Math.random() * 900000)}. We've sent a copy to your email.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
