import { budgetOptions, contact } from "../../../data/site";

const faqs = [
  {
    q: "What do you build?",
    a: "Websites, mobile apps, e-commerce stores, custom business software, cloud deployments and UI/UX design. If you aren't sure which one you need, tell us the idea and we'll help you work it out.",
  },
  {
    q: "How do we get started?",
    a: "Use the Start a project button or chat with us. We'll talk through your goals, then share a plan covering scope and the technologies we'd use before any building begins.",
  },
  {
    q: "Who will I actually talk to?",
    a: "The developers building your project. We're a team of five, so there is no account manager in between.",
  },
  {
    q: "What budget do I need?",
    a: `Our project form offers ranges from ${budgetOptions[1].split(" - ")[0]} up to ${budgetOptions[4]}, or you can choose "Let's Discuss". Tell us what you have in mind and we'll be honest about what fits.`,
  },
  {
    q: "Are you experienced?",
    a: "We're a young team, early in our journey, and we won't pretend otherwise. What we offer is care for design and usability, modern technologies and direct communication.",
  },
  {
    q: "Where are you based?",
    a: `${contact.location}. We're happy to talk by email, phone or chat.`,
  },
];

import Reveal from "./Reveal";

function Faq() {
  return (
    <section className="dv-section dv-faq" id="faq" aria-labelledby="faq-title">
      <div className="dv-container dv-faq__grid">
        <Reveal>
          <p className="dv-eyebrow">Questions</p>
          <h2 className="dv-display dv-h2" id="faq-title">
            Frequently asked questions
          </h2>
        </Reveal>

        <Reveal className="dv-faq__list" delay={0.1}>
          {faqs.map((item) => (
            <details className="dv-faq__item" key={item.q}>
              <summary>
                <span className="dv-display">{item.q}</span>
                <span className="dv-faq__icon" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default Faq;
