function SectionTitle({ title, accent, desc }) {
  return (
    <div className="sectionTitle">
      <h2>
        {title} <span>{accent}</span>
      </h2>
      <p>{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <article className="featureCard">
      <span className="featureIcon" />
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
}

function FeaturesGrid({ items }) {
  return (
    <div className="featureGrid">
      {items.map((item) => (
        <FeatureCard key={item.title} title={item.title} desc={item.desc} />
      ))}
    </div>
  );
}

export function ContentSection({ title, accent, desc, cards }) {
  return (
    <section className="section">
      <SectionTitle title={title} accent={accent} desc={desc} />
      <FeaturesGrid items={cards} />
    </section>
  );
}
