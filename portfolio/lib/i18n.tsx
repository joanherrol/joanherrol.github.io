"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Locale = "en" | "es";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
    },
    hero: {
      subtitle: "Full Stack Developer · Cloud Engineer",
      description:
        "Building modern, performant web experiences with React and Next.js. Strong foundation in full stack development, cloud, and DevOps, ensuring scalable and efficient applications.",
      viewProjects: "View Projects",
      downloadCV: "Download CV",
      yearsExperience: "Years Experience",
      projectsDelivered: "Projects Delivered",
    },
    about: {
      p1: "Frontend is where I feel most at home, building interfaces that are fast, accessible, and feel right to use. I work across the full stack and know my way around backend and cloud infrastructure, but the UI is what I care about most.",
      p2: "Three years of professional experience shipping web products, with a background in cloud engineering that makes me comfortable owning a feature end to end, from API to deployment.",
      p3: "Outside of work I play music, paint and used to make games. I'm a creative person at heart, which I think shows in how I approach UI: details matter, and things should feel as good as they look.",
      downloadCV: "Download CV",
      galleryButton: "Gallery",
    },
    projects: {
      intro:
        "A selection of the projects I'm most proud of. More work is available on my",
      githubLabel: "GitHub",
      items: [
        {
          title: "Proovit",
          description:
            "A full-featured mobile application with a focus on clean UX and modern frontend architecture.",
        },
        {
          title: "Shoot'em Up!",
          description:
            "A browser-playable shoot 'em up game built in Unity and published on itch.io.",
        },
        {
          title: "Pug Adventure",
          description:
            "A 2D platformer game featuring a pug protagonist, developed and released on itch.io.",
        },
      ],
    },
    skills: {
      categories: [
        "Frontend",
        "Backend",
        "Mobile",
        "Cloud & DevOps",
        "Game Dev",
      ],
      languagesLabel: "Languages",
      languagesList: [
        { name: "English", note: "Cambridge C2 / Fluent" },
        { name: "Spanish", note: "Native" },
        { name: "Catalan", note: "Native" },
      ],
    },
    education: {
      items: [
        {
          degree: "Computer Science — Exchange Programme",
          description:
            "Four-month exchange studying AI, software engineering, and advanced computer science courses in South Korea.",
          gpa: null as string | null,
        },
        {
          degree: "Bachelor's in Computer Science",
          description:
            "Specialising in computing and software development. Coursework covers algorithms, software architecture, databases, networks, and operating systems.",
          gpa: "GPA 8 / 10",
        },
        {
          degree: "High School — Science & Technology",
          description:
            "Scientific and technological track with a focus on mathematics, physics, and technology.",
          gpa: "GPA 8.5 / 10",
        },
      ],
    },
    contact: {
      locationLabel: "Location",
      phoneLabel: "Phone",
      emailLabel: "Email",
    },
    gallery: {
      heading: "Gallery",
      subheading: "A selection of digital and traditional paintings.",
      bouguereauTitle: "Bouguereau Master Study",
      bouguereauDesc:
        "Digital study after William-Adolphe Bouguereau, exploring classical light and shadow.",
      partyTitle: "Party Night",
      partyDesc:
        "A digital painting painted from photo reference, capturing a spontaneous moment from a night out with friends.",
      despairTitle: "Despair",
      despairDesc:
        "An expressive figure study exploring themes of anguish and raw emotion.",
      forestPortraitTitle: "Forest portrait",
      forestPortraitDesc:
        "Digital portrait painted from photo reference, with a focus on natural light and skin tones.",
      dragonTitle: "Dragon",
      dragonDesc:
        "Traditional painting of a fierce dragon, done with acrylic on paper.",
      totoroTitle: "Totoro Bus Stop",
      totoroDesc:
        "Watercolour recreation of the iconic bus stop scene from My Neighbour Totoro.",
      flowerPortraitTitle: "Portrait with Flowers",
      flowerPortraitDesc:
        "Digital portrait painted from photo reference, with a natural, sun-drenched atmosphere.",
      beachPortraitTitle: "Beach Portrait",
      beachPortraitDesc:
        "Digital portrait painted from photo reference, exploring warm backlighting and saturated colours.",
      joyfulPortraitTitle: "Joyful Portrait",
      joyfulPortraitDesc:
        "Digital portrait painted from photo reference, with vivid colours and warm skin tones.",
      doublePortraitTitle: "Double Portrait",
      doublePortraitDesc:
        "Double digital portrait painted from photo reference, capturing a warm and intimate moment between two people.",
      multicolourPortraitTitle: "Multicolour Portrait",
      multicolourPortraitDesc:
        "Digital portrait of a young person in a natural outdoor setting, with soft ambient light.",
      traditionalPortraitTitle: "Traditional Portrait",
      traditionalPortraitDesc:
        "Traditional portrait painted from photo reference, emphasising the subject's gaze and expression, done with acrylic on paper.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      projects: "Proyectos",
      skills: "Habilidades",
      education: "Formación",
      contact: "Contacto",
    },
    hero: {
      subtitle: "Desarrollador Full Stack · Cloud Engineer",
      description:
        "Construyendo experiencias web modernas y eficientes con React y Next.js. Base sólida en desarrollo full stack, cloud y DevOps para aplicaciones escalables.",
      viewProjects: "Ver proyectos",
      downloadCV: "Descargar CV",
      yearsExperience: "Años de experiencia",
      projectsDelivered: "Proyectos entregados",
    },
    about: {
      p1: "El frontend es donde me siento más cómodo, creando interfaces rápidas, accesibles y que se sienten bien al usarlas. He tocado un poco de todo y me manejo bien en backend e infraestructura cloud, pero la UI es lo que más me apasiona.",
      p2: "Tengo tres años de experiencia profesional desarrollando productos web, con una base en cloud engineering que me permite entender el proceso de desarrollo de extremo a extremo, desde la API hasta el despliegue.",
      p3: "Fuera del trabajo toco música, pinto y antes hacía videojuegos. Soy una persona creativa, y creo que eso se nota en cómo me aproximo al diseño de interfaces: los detalles importan, y las cosas deben sentirse tan bien como se ven.",
      downloadCV: "Descargar CV",
      galleryButton: "Galería",
    },
    projects: {
      intro:
        "Una selección de los proyectos de los que más orgulloso estoy. Más disponible en mi",
      githubLabel: "GitHub",
      items: [
        {
          title: "Proovit",
          description:
            "Una aplicación móvil completa con foco en UX limpia y arquitectura frontend moderna.",
        },
        {
          title: "Shoot'em Up!",
          description:
            "Un juego de disparos jugable en el navegador, desarrollado en Unity y publicado en itch.io.",
        },
        {
          title: "Pug Adventure",
          description:
            "Un juego de plataformas 2D con un pug como protagonista, desarrollado y publicado en itch.io.",
        },
      ],
    },
    skills: {
      categories: [
        "Frontend",
        "Backend",
        "Mobile",
        "Cloud & DevOps",
        "Game Dev",
      ],
      languagesLabel: "Idiomas",
      languagesList: [
        { name: "Inglés", note: "Cambridge C2 / Fluido" },
        { name: "Español", note: "Nativo" },
        { name: "Catalán", note: "Nativo" },
      ],
    },
    education: {
      items: [
        {
          degree: "Computación — Programa de intercambio",
          description:
            "Intercambio de cuatro meses estudiando IA, ingeniería de software y cursos avanzados de informática en Corea del Sur.",
          gpa: null as string | null,
        },
        {
          degree: "Grado en Ingeniería Informática",
          description:
            "Especialización en computación y desarrollo de software. El plan de estudios cubre algoritmos, arquitectura de software, bases de datos, redes y sistemas operativos.",
          gpa: "Nota media: 8 / 10",
        },
        {
          degree: "Bachillerato — Ciencias y Tecnología",
          description:
            "Itinerario científico y tecnológico con énfasis en matemáticas, física y tecnología.",
          gpa: "Nota media: 8,5 / 10",
        },
      ],
    },
    contact: {
      locationLabel: "Ubicación",
      phoneLabel: "Teléfono",
      emailLabel: "Email",
    },
    gallery: {
      heading: "Galería",
      subheading: "Una selección de pinturas digitales y tradicionales.",
      bouguereauTitle: "Estudio de Bouguereau",
      bouguereauDesc:
        "Estudio digital de William-Adolphe Bouguereau, explorando la luz y la sombra clásicas.",
      partyTitle: "Noche de fiesta",
      partyDesc:
        "Una pintura digital pintada a partir de referencia fotográfica, capturando un momento espontáneo de una noche de salida con amigos.",
      despairTitle: "Desesperación",
      despairDesc:
        "Un estudio de figura expresivo que explora temas de angustia y emoción en bruto.",
      forestPortraitTitle: "Retrato en el bosque",
      forestPortraitDesc:
        "Retrato digital pintado a partir de referencia fotográfica, con un enfoque en la luz natural y los tonos de piel.",
      dragonTitle: "Dragón",
      dragonDesc:
        "Pintura tradicional de un dragón, realizada con acrílico sobre papel.",
      totoroTitle: "Parada de bus de Totoro",
      totoroDesc:
        "Recreación en acuarela de la icónica escena de la parada de bus de Mi vecino Totoro.",
      flowerPortraitTitle: "Retrato con flores",
      flowerPortraitDesc:
        "Retrato digital pintado a partir de referencia fotográfica, con una atmósfera natural bañada por el sol.",
      beachPortraitTitle: "Retrato en la playa",
      beachPortraitDesc:
        "Retrato digital pintado a partir de referencia fotográfica, explorando el contraluz cálido y colores saturados.",
      joyfulPortraitTitle: "Retrato feliz",
      joyfulPortraitDesc:
        "Retrato digital pintado a partir de referencia fotográfica, con colores vivos y tonos de piel cálidos.",
      doublePortraitTitle: "Retrato doble",
      doublePortraitDesc:
        "Doble retrato digital pintado a partir de referencia fotográfica, capturando un momento íntimo y cálido entre dos personas.",
      multicolourPortraitTitle: "Retrato multicolor",
      multicolourPortraitDesc:
        "Retrato digital de un joven en un entorno exterior natural, con luz ambiente suave.",
      traditionalPortraitTitle: "Retrato tradicional",
      traditionalPortraitDesc:
        "Retrato tradicional pintado a partir de referencia fotográfica, enfatizando la mirada y expresión, realizado con acrílico sobre papel.",
    },
  },
} as const;

type Translations = (typeof translations)[Locale];

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "es") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
