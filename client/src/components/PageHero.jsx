import "../styles/PageHero.css";

export default function PageHero({ title, bgImage }) {
  return (
    <section
      className="pageHero"
      style={{ backgroundImage: `url(${bgImage})` }}
      aria-label={title}
    >
      <div className="pageHeroOverlay" />
      <div className="pageHeroInner">
        <h1 className="pageHeroTitle">{title}</h1>
        <div className="pageHeroLine" />
      </div>
    </section>
  );
}
