import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);
  const items = [1, 2, 3, 4].map((i) => ({
    q: t(`faq.q${i}`),
    a: t(`faq.a${i}`)
  }));

  return (
    <section className="section">
      <div className="sectionTitle">
        <h2>
          {t('faq.title')} <span>{t('faq.accent')}</span>
        </h2>
        <p>{t('faq.desc')}</p>
      </div>
      <div className="faqGrid">
        {items.map((item, idx) => (
          <button
            key={item.q}
            type="button"
            onClick={() => setOpenIndex(idx)}
            className={`faqCard ${openIndex === idx ? 'isOpen' : ''}`}
          >
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
