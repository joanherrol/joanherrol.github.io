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
            "A social challenge app built with Expo and Node.js, combining daily prompts, proof uploads, AI validation, and competitive group play.",
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
    proovit: {
      hero: {
        title: "Proovit",
        logoAlt: "Proovit logo",
        subtitle:
          "A social challenge app developed with a friend. Each user receives a challenge and uploads photo proof from their phone. It is then validated with AI, and the app keeps track of the results, so users can compete with friends and see their progress on a global leaderboard.",
      },
      navSections: {
        showcase: "Showcase",
        functionality: "Functionality",
        tech: "Tech",
        design: "Design",
      },
      links: {
        playStore:
          "https://play.google.com/store/apps/details?id=com.pablolaparra.proovit",
        playStoreLabel: "Open on Google Play",
      },
      features: {
        items: [
          {
            title: "Daily challenge rotation",
            description:
              "An random daily challenge is presented to all users, and they have 24 hours to complete it. Challenges are maintained by scheduled backend tasks, making the experience fresh and engaging every day.",
          },
          {
            title: "Uploading photo proof",
            description:
              "Depending on the challenge, users can upload photo proof from their device's camera or gallery. This allows more flexibility for challenges, allowing users to upload memories as well as real-time proof",
          },
          {
            title: "AI-assisted validation",
            description:
              "Uploaded proofs are reviewed with OpenAI to flag whether the challenge is actually completed, rewarding the user if successful and preventing cheating.",
          },
          {
            title: "Social aspect",
            description:
              "Users can add captions to their posts, comment on their friends' and give them upvotes. This makes each challenge a shared event.",
          },
          {
            title: "Private groups",
            description:
              "Private groups can enable default challenge rotations and run custom challenges. Members of these groups are the ones validating each other's proofs, instead of AI.",
          },
          {
            title: "Gamification and retention",
            description:
              "Coins, achievements, streaks, rankings, spins, and push notifications reinforce retention and give the product a strong sense of momentum.",
          },
        ],
      },
      tech: {
        items: [
          {
            layer: "UI/UX",
            technologies: [
              "React Native",
              "Expo",
              "React Navigation",
              "TanStack React Query",
              "Clerk Expo",
            ],
          },
          {
            layer: "Multimedia",
            technologies: [
              "Vision Camera",
              "Expo Image Picker",
              "Cloudinary",
              "Lottie",
              "Expo Notifications",
            ],
          },
          {
            layer: "Backend API",
            technologies: [
              "Node.js",
              "Express",
              "PostgreSQL",
              "Clerk",
              "Multer",
              "Cloudinary",
            ],
          },
          {
            layer: "Validation logic",
            technologies: ["OpenAI SDK"],
          },
          {
            layer: "Scheduled operations",
            technologies: ["node-cron"],
          },
        ],
      },
      design: {
        description:
          "The UI language is built to feel dynamic and competitive: high contrast surfaces, a sharp accent color, expressive type, and animations with Lottie assets.",
        fontTitle: "Typography",
        fontSample: "Outfit",
        fontDescription:
          "Outfit is chosen for its geometric shapes and clean rhythm across small labels, large headings, and mobile interfaces.",
        paletteTitle: "Color Palette",
        animationsTitle: "Lottie Animations",
      },
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
            "Una app social de retos construida con Expo y Node.js, combinando prompts diarios, subida de pruebas, validación por IA y juego competitivo en grupo.",
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
    proovit: {
      hero: {
        title: "Proovit",
        logoAlt: "Logo de Proovit",
        subtitle:
          "Una aplicación social de retos desarrollada con un amigo. Cada usuario recibe un reto y sube una prueba fotográfica desde su móvil. Esta se valida con IA, y la app registra los resultados para que los usuarios puedan competir con amigos y ver su progreso en un ranking global.",
      },
      navSections: {
        showcase: "Demostración",
        functionality: "Funcionalidad",
        tech: "Tecnología",
        design: "Diseño",
      },
      links: {
        playStore:
          "https://play.google.com/store/apps/details?id=com.pablolaparra.proovit",
        playStoreLabel: "Abrir en Google Play",
      },
      features: {
        items: [
          {
            title: "Rotación diaria de retos",
            description:
              "Se presenta un reto diario aleatorio a todos los usuarios, que tienen 24 horas para completarlo. Los retos se mantienen mediante tareas programadas en el backend, haciendo que la experiencia sea fresca y atractiva cada día.",
          },
          {
            title: "Subida de prueba fotográfica",
            description:
              "Dependiendo del reto, los usuarios pueden subir pruebas fotográficas desde la cámara o galería de su dispositivo. Esto permite mayor flexibilidad, permitiendo subir recuerdos además de pruebas en tiempo real.",
          },
          {
            title: "Validación asistida por IA",
            description:
              "Las pruebas subidas se revisan con OpenAI para comprobar si el reto está realmente completado, recompensando al usuario si lo está y previniendo trampas.",
          },
          {
            title: "Aspecto social",
            description:
              "Los usuarios pueden añadir captions a sus publicaciones, comentar las de sus amigos y darles votos positivos. Esto convierte cada reto en un evento compartido.",
          },
          {
            title: "Grupos privados",
            description:
              "Los grupos privados pueden activar rotaciones de retos por defecto y además lanzar retos personalizados. Los miembros de estos grupos validan las pruebas de los demás en lugar de la IA.",
          },
          {
            title: "Gamificación y retención",
            description:
              "Monedas, logros, rachas, rankings, spins y notificaciones push refuerzan la retención y dan al producto una fuerte sensación de dinamismo.",
          },
        ],
      },
      tech: {
        items: [
          {
            layer: "UI/UX",
            technologies: [
              "React Native",
              "Expo",
              "React Navigation",
              "TanStack React Query",
              "Clerk Expo",
            ],
          },
          {
            layer: "Multimedia",
            technologies: [
              "Vision Camera",
              "Expo Image Picker",
              "Cloudinary",
              "Lottie",
              "Expo Notifications",
            ],
          },
          {
            layer: "Backend API",
            technologies: [
              "Node.js",
              "Express",
              "PostgreSQL",
              "Clerk",
              "Multer",
              "Cloudinary",
            ],
          },
          {
            layer: "Lógica de validación",
            technologies: ["OpenAI SDK"],
          },
          {
            layer: "Operaciones programadas",
            technologies: ["node-cron"],
          },
        ],
      },
      design: {
        description:
          "El lenguaje de la UI está construido para sentirse dinámico y competitivo: superficies de alto contraste, un color de acento marcado, tipografía expresiva y animaciones con recursos Lottie.",
        fontTitle: "Tipografía",
        fontSample: "Outfit",
        fontDescription:
          "Outfit se elige por sus formas geométricas y su ritmo limpio en etiquetas pequeñas, títulos grandes e interfaces móviles.",
        paletteTitle: "Paleta de color",
        animationsTitle: "Animaciones Lottie",
      },
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
    if (saved === "en" || saved === "es") {
      setLocaleState(saved);
    }
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
