/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakColor */
const { useState, useEffect, useRef } = React;

// -------------------- TWEAK DEFAULTS --------------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "scriptFont": "Noto Sans",
  "palette": "moss",
  "heroMode": "image"
} /*EDITMODE-END*/;

// -------------------- DATA --------------------
const NAV_LINKS = [
{ href: "#cambio", label: "El cambio" },
{ href: "#about", label: "Quién soy" },
{ href: "#process", label: "Cómo trabajo" },
{ href: "#services", label: "Servicios" },
{ href: "asesoramiento-agroecologico.html", label: "Agroecología" },
{ href: "#contact", label: "Contacto" }];


const STEPS = [
{
  n: "01",
  title: "Escuchamos y aterrizamos la idea",
  body: "Una sesión inicial donde definimos qué buscas de verdad: zona, clima, tipo de casa, nivel de autosuficiencia, distancia a servicios, presupuesto real. Aquí ya descartamos muchas fantasías y ganamos foco."
},
{
  n: "02",
  title: "Buscamos el lugar",
  body: "Localizamos terrenos o casas existentes que encajen con lo definido. Verificamos documentación, accesos, agua, luz, suelo y todo lo que hay que mirar antes de firmar nada. Te entregamos opciones reales."
},
{
  n: "03",
  title: "Diseñamos y construimos",
  body: "Rehabilitamos. Si hay que construir desde cero, lo proyectamos contigo. Coordinamos arquitectura, sistemas de autosuficiencia, decoración interior y paisajismo agroecológico regenerativo. Una sola interlocución para todo."
},
{
  n: "04",
  title: "Hacemos que la tierra trabaje",
  body: "Diseñamos huertos y bosques de alimentos pensados para tu clima y tu nivel de implicación. Desde un huerto familiar hasta un sistema de autosuficiencia real. Tú decides cuánto quieres meter las manos."
}];


const SERVICES = [
{ roman: "I.", title: "Búsqueda de terrenos y casas", body: "Localización en zonas rurales de toda España según tus criterios reales." },
{ roman: "II.", title: "Rehabilitación y reformas", body: "Casas de pueblo, masías, cortijos. Devolverles vida sin perder lo que tenían." },
{ roman: "III.", title: "Diseño de interiores y decoración", body: "Espacios que se sienten habitados desde el primer día, no escenarios." },
{ roman: "IV.", title: "Paisajismo regenerativo", body: "El exterior tan importante como el interior. Diseñado para tu zona y tu mantenimiento." },
{ roman: "V.", title: "Huertos y bosques de alimentos", body: "Desde un huerto familiar hasta un sistema productivo basado en permacultura real." },
{ roman: "VI.", title: "Sistemas de autosuficiencia", body: "Agua, energía, gestión de residuos. Tan independiente de la red como tú quieras." },
{ roman: "VII.", title: "Agroecología integral aplicada", body: "Diseño productivo del territorio: suelo vivo, agua, biodiversidad y cultivos integrados en un mismo sistema." },
{ roman: "VIII.", title: "Asesoramiento administrativo relacionado", body: "Trámites, licencias y normativa autonomíca traducidos a un lenguaje claro antes de firmar nada." },
{ roman: "IX.", title: "Gestión integral del proyecto", body: "Una persona que coordina todo y te traduce lo técnico cuando hace falta." }];


const PROJECTS = [
{
  price: "120 – 180 k€",
  title: "Cabaña autosuficiente en Asturias",
  profile: "Teletrabajador, 35 años",
  body: "Construcción de cabaña autosuficiente en la montaña. Con fibra por satélite, huerto con bosque de alimentos de 500 m². Captación y gestión de agua. Vida tranquila, viajes a la ciudad cada dos semanas.",
  img: "assets/asturias-casa.png"
},
{
  price: "220 – 320 k€",
  title: "Rehabilitación en Extremadura",
  profile: "Familia con dos hijos, 40 años",
  body: "Casa rural con criterios bioclimáticos. 19.000 metros de finca, huerto productivo familiar y para excedentes, gran bosque de alimentos, animales de granja, sistema energético de avanzada. Cerca de núcleo urbano con colegio y centro de salud. Equilibrio entre vida rural y servicios.",
  img: "assets/galicia-rehab.jpg"
},
{
  price: "380 – 600 k€",
  title: "Finca productiva agroecológica en Galicia",
  profile: "Pareja prejubilada, 55 años",
  body: "Finca de 5 hectáreas diseñada desde cero. Producción agroecológica de hortalizas, plantas medicinales, madera y diversos sistemas altamente productivos de frutales. Sistema de captación de agua, autosuficiencia energética, taller y gimnasio.",
  img: "assets/galicia-finca.png"
}];


// Hero video — ambient drone over a countryside / garden
const HERO_VIDEO = "https://cdn.coverr.co/videos/coverr-a-modern-house-in-the-countryside-3066/1080p.mp4";
const HERO_VIDEO_FALLBACK = "https://cdn.coverr.co/videos/coverr-a-house-in-the-middle-of-a-field-1583/1080p.mp4";
const HERO_POSTER = "assets/hero-house.jpeg";

// Section imagery
const CAMBIO_IMG = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85";
const PORTRAIT_IMG = "assets/elsa-portrait.jpg";

// -------------------- HOOKS --------------------
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// -------------------- COMPONENTS --------------------
function Nav({ scriptFont }) {
  const scrolled = useScrolled(60);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <a href="#top" className="nav__brand" style={{ fontFamily: scriptFont, fontWeight: 200 }}>Elsa Pombo

      </a>
      <ul className="nav__links">
        {NAV_LINKS.map((l) =>
        <li key={l.href}><a href={l.href}>{l.label}</a></li>
        )}
      </ul>
    </nav>);

}

function Hero({ scriptFont, heroMode }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // If primary src fails, fall back
    const onErr = () => {
      if (v.dataset.fallback !== "1") {
        v.dataset.fallback = "1";
        v.src = HERO_VIDEO_FALLBACK;
        v.load();
        v.play().catch(() => {});
      }
    };
    v.addEventListener("error", onErr);
    return () => v.removeEventListener("error", onErr);
  }, [heroMode]);

  return (
    <header className="hero" id="top">
      <div className="hero__media">
        {heroMode === "video" ?
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}>
          
            <source src={HERO_VIDEO} type="video/mp4" />
          </video> :

        <img src={HERO_POSTER} alt="Casa moderna en el campo con jardín" />
        }
      </div>

      <div className="hero__inner">
        <h1 className="hero__brand" style={{ fontFamily: scriptFont, fontWeight: 200 }}>Elsa Pombo</h1>
        <p className="hero__tag">casas, tierra y vida en el campo</p>
        <p className="hero__headline">
          La casa que imaginas existe. <em>O se construye.</em>
        </p>
        <p className="hero__sub">
          Buscamos, asesoramos, proyectamos y levantamos hogares en el campo
          para personas que ya no quieren vivir donde viven.
        </p>
        <a href="#contact" className="hero__cta">
          Cuéntanos tu idea <span className="arr">→</span>
        </a>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Desliza</span>
        <span className="hero__scroll-line"></span>
      </div>
    </header>);

}

function Cambio() {
  return (
    <section className="cambio" id="cambio">
      <div className="container">
        <div className="cambio__grid">
          <div className="cambio__media reveal">
            <img src={CAMBIO_IMG} alt="Vista de un valle rural al amanecer" />
            <p className="cambio__caption">Sierra de Gata, Cáceres — abril.</p>
          </div>

          <div>
            <p className="eyebrow reveal">El punto de partida</p>
            <h2 className="section-title reveal">
              Las ciudades se han vuelto caras, ruidosas <em>y agotadoras.</em>
            </h2>
            <p className="lede reveal" style={{ "--reveal-delay": "60ms" }}>
              La pregunta ya no es si vale la pena el cambio.
              Es cómo hacerlo sin equivocarse.
            </p>
            <p className="body reveal" style={{ "--reveal-delay": "120ms" }}>
              Cada vez más gente está haciendo cuentas y descubriendo lo mismo:
              lo que pagan por un piso de 40 metros en una ciudad media les
              daría una casa con terreno, huerto y autosuficiencia en muchos puntos
              de España.
            </p>
            <p className="body reveal" style={{ "--reveal-delay": "180ms" }}>
              Porque irse al campo suena fácil hasta que aparecen los detalles:
              terrenos donde no se puede construir, casas rústicas sin cédula
              de habitabilidad, presupuestos de rehabilitación que se duplican,
              normativas autonómicas que cambian cada cien kilómetros, pueblos
              sin fibra ni médico cerca.
            </p>
            <p className="body reveal" style={{ "--reveal-delay": "240ms", color: "var(--ink)", fontWeight: 500 }}>
              Ese es exactamente el trabajo que hacemos por ti.
            </p>
          </div>
        </div>
      </div>
    </section>);

}

function About({ scriptFont }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__portrait reveal">
            <img src={PORTRAIT_IMG} alt="Retrato de Elsa Pombo" />
          </div>
          <div>
            <p className="eyebrow reveal">Quién hay detrás</p>
            <h2 className="section-title reveal">
              Una persona, un equipo, y todo lo que tú <em>no quieres tener que aprender.</em>
            </h2>
            <p className="body reveal" style={{ "--reveal-delay": "80ms", fontSize: 17 }}>
              Soy Elsa Pombo. Trabajo con un equipo de profesionales del diseño,
              la construcción, el paisajismo y la gestión de proyectos rurales.
              No soy una inmobiliaria ni una constructora al uso: te acompaño
              desde la primera idea hasta el día que enciendes la chimenea por
              primera vez.
            </p>
            <p className="body reveal" style={{ "--reveal-delay": "150ms", fontSize: 17 }}>
              Empecé este proyecto porque he visto demasiada gente comprar
              fincas que no podía usar, levantar casas mal orientadas, plantar
              huertos donde no crecía nada. Y también demasiada gente abandonar
              el sueño porque "era muy complicado". No tiene que serlo, si
              alguien que sabe te acompaña.
            </p>
            <div className="reveal" style={{ "--reveal-delay": "220ms" }}>
              <div className="about__sig" style={{ fontFamily: scriptFont, fontWeight: 200 }}>Elsa Pombo</div>
              <small>Fundadora</small>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <p className="eyebrow reveal">Cómo trabajamos</p>
        <h2 className="section-title reveal">
          Tú pones el sueño y el presupuesto. <em>Nosotros ponemos el resto.</em>
        </h2>
        <p className="lede reveal" style={{ "--reveal-delay": "80ms" }}>
          Cada proyecto empieza con una conversación. Nos cuentas qué casa
          tienes en la cabeza, qué tipo de vida quieres llevar y de cuánto
          dispones. A partir de ahí, construimos el camino.
        </p>

        <div className="process__steps">
          {STEPS.map((s, i) =>
          <div key={s.n} className="step reveal" style={{ "--reveal-delay": `${i * 90}ms` }}>
              <div className="step__num">{s.n}</div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__body">{s.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <p className="eyebrow reveal">Lo que hacemos</p>
        <h2 className="section-title reveal" style={{ maxWidth: "20ch" }}>
          Todo lo que necesitas, <em>bajo un mismo equipo.</em>
        </h2>
        <p className="lede reveal" style={{ "--reveal-delay": "80ms" }}>
          Nueve áreas de trabajo coordinadas para que tú no tengas que hablar
          con nueve interlocutores distintos.
        </p>

        <div className="services__grid">
          {SERVICES.map((s, i) =>
          <div key={s.roman} className="service reveal" style={{ "--reveal-delay": `${i % 3 * 80}ms` }}>
              <div className="service__roman">{s.roman}</div>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__body">{s.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="projects__intro">
          <div>
            <p className="eyebrow reveal">Cómo podría ser tu proyecto</p>
            <h2 className="section-title reveal" style={{ marginBottom: 0 }}>
              Tres caminos posibles, <em>tres presupuestos.</em>
            </h2>
          </div>
          <p className="lede reveal" style={{ "--reveal-delay": "120ms" }}>
            Estos son ejemplos representativos del tipo de proyectos que
            abordamos.
          </p>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((p, i) =>
          <article key={p.title} className="project reveal" style={{ "--reveal-delay": `${i * 120}ms` }}>
              <div className="project__media">
                <img src={p.img} alt={p.title} />
              </div>
              <h3 className="project__title">{p.title}</h3>
              <p className="project__profile">{p.profile}</p>
              <p className="project__body">{p.body}</p>
            </article>
          )}
        </div>

        <p className="projects__disclaimer reveal">
          Son escenarios construidos para
          que veas cómo trabajamos según el perfil y el presupuesto.
        </p>
      </div>
    </section>);

}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    const data = Object.fromEntries(new FormData(e.target).entries());
    data._subject = "Nuevo mensaje desde elsapombo.com";
    data._template = "table";
    data._captcha = "false";
    try {
      const res = await fetch("https://formsubmit.co/ajax/elsapombosaiz@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      const out = await res.json();
      if (res.ok && String(out.success) === "true") setSent(true);else setError(true);
    } catch (err) {
      setError(true);
    }
    setSending(false);
  };
  return (
    <section className="contact" id="contact">
      <div className="container">
        <p className="eyebrow reveal">Empezamos por aquí</p>
        <h2 className="section-title reveal">
          Cuéntanos qué casa tienes <em>en la cabeza.</em>
        </h2>
        <div className="contact__grid">
          <div className="contact__copy reveal" style={{ "--reveal-delay": "80ms" }}>
            <p className="lede" style={{ marginBottom: 18 }}>
              La primera conversación es gratuita y sin compromiso.
            </p>
            <p>
              En 30-45 minutos sabremos si lo que buscas es viable y cómo
              podríamos ayudarte. Sin halagos vacíos ni promesas que no se
              pueden cumplir. Solo lo que es posible y cómo llegar.
            </p>
          </div>

          {sent ?
          <div className="form__success reveal">
              Gracias. Te escribimos en menos de 48 horas para fijar una
              primera conversación.
            </div> :

          <form className="form reveal" onSubmit={submit} style={{ "--reveal-delay": "120ms" }}>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="name">Nombre</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" name="phone" type="tel" />
                </div>
                <div className="field">
                  <label htmlFor="zone">Zona aproximada</label>
                  <input id="zone" name="zone" type="text" placeholder="Galicia, norte, abierto…" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="budget">Presupuesto orientativo</label>
                <select id="budget" name="budget" defaultValue="">
                  <option value="" disabled>Selecciona un rango</option>
                  <option value="lt150">Menos de 150 k€</option>
                  <option value="150-250">150 – 250 k€</option>
                  <option value="250-400">250 – 400 k€</option>
                  <option value="400-600">400 – 600 k€</option>
                  <option value="gt600">Más de 600 k€</option>
                  <option value="undecided">Aún por definir</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="msg">Cuéntanos brevemente qué imaginas</label>
                <textarea id="msg" name="msg" rows="4" />
              </div>

              {error &&
              <p role="alert" style={{ marginBottom: 12 }}>
                  No se pudo enviar. Escríbenos a{" "}
                  <a href="mailto:elsapombosaiz@gmail.com">elsapombosaiz@gmail.com</a>.
                </p>
              }
              <button type="submit" className="submit" disabled={sending}>
                {sending ? "Enviando…" : "Enviar mensaje"} <span className="arr">→</span>
              </button>
            </form>
          }
        </div>
      </div>
    </section>);

}

function Footer({ scriptFont }) {
  return (
    <footer>
      <div className="container">
        <div className="footer__top">
          <div>
            <h3 className="footer__brand" style={{ fontFamily: scriptFont, fontWeight: 200 }}>Elsa Pombo</h3>
            <p className="footer__tag">Diseñamos vidas, no solo casas.</p>
          </div>
          <div className="footer__col">
            <h5>Navegación</h5>
            <ul>
              {NAV_LINKS.map((l) =>
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
              )}
            </ul>
          </div>
          <div className="footer__col">
            <h5>Contacto</h5>
            <ul>
              <li><a href="mailto:hola@elsapombo.com">hola@elsapombo.com</a></li>
              <li><a href="#" aria-label="Instagram">Instagram</a></li>
              <li><a href="#" aria-label="LinkedIn">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Elsa Pombo. Todos los derechos reservados.</span>
          <div className="footer__legal">
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>);

}

// -------------------- TWEAKS UI --------------------
function Tweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Identidad">
        <TweakSelect
          label="Fuente del logotipo"
          value={tweaks.scriptFont}
          options={[
          { value: "Noto Sans", label: "Noto Sans (fina)" },
          { value: "Noto Serif", label: "Noto Serif (fina)" },
          { value: "Marcellus", label: "Marcellus (nórdica)" },
          { value: "Tenor Sans", label: "Tenor Sans" },
          { value: "Italiana", label: "Italiana" },
          { value: "Cormorant", label: "Cormorant" }]
          }
          onChange={(v) => setTweak("scriptFont", v)} />
        
      </TweakSection>

      <TweakSection label="Hero">
        <TweakRadio
          label="Tipo de hero"
          value={tweaks.heroMode}
          options={[
          { value: "video", label: "Vídeo" },
          { value: "image", label: "Imagen" }]
          }
          onChange={(v) => setTweak("heroMode", v)} />
        
      </TweakSection>
    </TweaksPanel>);

}

// -------------------- APP --------------------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  return (
    <>
      <Nav scriptFont={tweaks.scriptFont} />
      <Hero scriptFont={tweaks.scriptFont} heroMode={tweaks.heroMode} />
      <Cambio />
      <About scriptFont={tweaks.scriptFont} />
      <Process />
      <Services />
      <Projects />
      <ContactForm />
      <Footer scriptFont={tweaks.scriptFont} />
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);