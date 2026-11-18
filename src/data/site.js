// Content below is lifted from the existing DevVerse pages
// (Hero, Portfolio, ServicesPreview, Process, About, Footer, Contact).
// Edit here to change what the redesigned homepage shows.

export const contact = {
  email: "devverse.dev@gmail.com",
  phone: "+91 81441 04500",
  phoneHref: "tel:+918144104500",
  location: "Chennai, Tamil Nadu, India",
};

export const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dev-verse-dev/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dev_verse.dev/",
  },
  {
    label: "GitHub",
    href: "https://github.com/devversedev-png",
  },
];

export const stack = [
  "React",
  "Flutter",
  "Spring Boot",
  "Node.js",
  "MongoDB",
  "MySQL",
];

/*
 * Projects come from the existing Portfolio page.
 *
 * No project screenshots exist in the repository yet. Until you add some,
 * each project shows a clearly labelled illustrated preview.
 *
 * To use a real screenshot, drop the file into src/assets/projects/ and add:
 *
 *   import shopShot from "../assets/projects/shop.png";
 *   ...
 *   images: [shopShot, shopShot2],   // 2+ images slide automatically
 *   href: "https://your-live-demo.example",   // optional live link
 *
 * "href" (when present) is used for the project link instead of /portfolio.
 */
export const projects = [
  {
    slug: "business-mobile-app",
    title: "Business Mobile App",
    category: "Mobile application",
    description:
      "A modern mobile application designed to simplify business operations and improve customer engagement.",
    technologies: ["React Native", "Spring Boot", "MongoDB"],
    status: "Completed",
    kind: "mobile",
    images: [],
    href: null,
    details: {
      overview: [
        "Business Mobile App is a mobile application designed to make running a business easier and to keep it closer to its customers.",
        "On the technical side it combines a React Native app, a Spring Boot server behind it and a MongoDB database, so one team looks after the whole product.",
      ],
      scope: [
        "Mobile screens built with React Native, for Android and iOS",
        "A Spring Boot server (API) that the app talks to",
        "A MongoDB database for business and customer data",
        "Testing on real devices before release",
      ],
      fit: [
        "You want to run or grow a business from a phone",
        "You want customers to reach you through your own app",
      ],
    },
  },
  {
    slug: "online-shopping-platform",
    title: "Online Shopping Platform",
    category: "E-commerce",
    description:
      "A responsive e-commerce solution designed for smooth product browsing, ordering and business management.",
    technologies: ["React", "Node.js", "MongoDB"],
    status: "Completed",
    kind: "shop",
    images: [],
    href: null,
    details: {
      overview: [
        "Online Shopping Platform is a responsive e-commerce solution, made so customers can browse products and order smoothly while the owner manages the business behind the scenes.",
        "It is built with React on the front end and Node.js with MongoDB behind it, and works on phones, tablets and desktops.",
      ],
      scope: [
        "A responsive storefront with product browsing and ordering, built in React",
        "A Node.js server and MongoDB database for products and orders",
        "Business management tools for the store owner",
        "Layouts tested on phone, tablet and desktop screens",
      ],
      fit: [
        "You want to sell products online",
        "You want one place to manage products and orders",
      ],
    },
  },
  {
    slug: "business-management-system",
    title: "Business Management System",
    category: "Web application",
    description:
      "A custom web-based platform designed to organize workflows and improve day-to-day business operations.",
    technologies: ["React", "Spring Boot", "MySQL"],
    status: "In progress",
    kind: "dashboard",
    images: [],
    href: null,
    details: {
      overview: [
        "Business Management System is a custom web-based platform that organizes workflows and improves day-to-day business operations. It is still in progress.",
        "It is being built with React, Spring Boot and MySQL, and it shows how we approach custom software: start from how a business actually works, then shape the tool around it.",
      ],
      scope: [
        "A React web interface for daily work",
        "A Spring Boot server that holds the business rules",
        "A MySQL database for structured business data",
        "Regular progress updates while it is being built",
      ],
      fit: [
        "Your team still runs on spreadsheets and messages",
        "You need software shaped around your own workflow",
      ],
    },
  },
  {
    slug: "upcoming-digital-solution",
    title: "Upcoming Digital Solution",
    category: "Custom software",
    description:
      "We're continuously exploring new ideas and building digital products that solve real business problems.",
    technologies: ["Modern stack", "Scalable", "Secure"],
    status: "Coming soon",
    kind: "soon",
    images: [],
    href: null,
    details: {
      overview: [
        "This space is for the next product we build. We keep exploring new ideas and building digital products that solve real business problems.",
        "If you have an idea you would like to see here, we would love to hear it. Your project could be the next one on this page.",
      ],
      scope: [
        "A first conversation to understand your idea and goals",
        "A plan covering scope and the technologies we would use",
        "Design, development and testing with regular updates",
        "Launch, and support after it goes live",
      ],
      fit: [
        "You have an idea but are not sure where to begin",
        "You would like to work directly with the developers",
      ],
    },
  },
];

export const services = [
  {
    slug: "website-development",
    title: "Web development",
    description:
      "Modern, responsive and scalable websites built with the latest technologies.",
  },
  {
    slug: "mobile-applications",
    title: "Mobile applications",
    description:
      "Android and iOS applications with native-like performance.",
  },
  {
    slug: "e-commerce-solutions",
    title: "E-commerce",
    description:
      "Online stores with secure payment gateways and inventory management.",
  },
  {
    slug: "custom-software",
    title: "Software development",
    description:
      "Custom business software tailored for startups and enterprises.",
  },
  {
    slug: "cloud-solutions",
    title: "Cloud solutions",
    description:
      "Deploy, monitor and scale applications securely in the cloud.",
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX design",
    description:
      "Clean, intuitive and visually engaging user experiences.",
  },
];

export const processSteps = [
  {
    title: "Discovery and discussion",
    description:
      "We start by understanding your idea, business goals, audience and requirements.",
  },
  {
    title: "Planning and strategy",
    description:
      "We agree a clear roadmap and pick the right technologies for the project.",
  },
  {
    title: "UI / UX design",
    description:
      "Wireframes and visual design for a clean, responsive experience.",
  },
  {
    title: "Development",
    description:
      "We build the approved design, with regular progress updates along the way.",
  },
  {
    title: "Testing and quality",
    description:
      "Functional, responsive and performance checks across devices.",
  },
  {
    title: "Launch and deployment",
    description:
      "We deploy your product, and can keep supporting it after it goes live.",
  },
];

export const teamHighlights = [
  "Small and focused team",
  "Direct communication",
  "Modern technologies",
  "Flexible development approach",
  "Attention to design and usability",
  "Continuous learning and improvement",
];

// Same options and values the existing Contact page submits.
export const projectTypeOptions = [
  "Website Development",
  "Mobile Application",
  "E-Commerce Platform",
  "Custom Software",
  "UI / UX Design",
  "Other",
];

export const budgetOptions = [
  "Let's Discuss",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000+",
];

export const getProject = (slug) =>
  projects.find((project) => project.slug === slug);
