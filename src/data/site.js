// Content below is lifted from the existing DevVerse pages
// (Hero, Portfolio, ServicesPreview, Process, About, Footer, Contact).
// Edit here to change what the redesigned homepage shows.

import thulirkumHome from "../assets/projects/thulirkum-home.webp";
import thulirkumCategories from "../assets/projects/thulirkum-categories.webp";
import thulirkumCart from "../assets/projects/thulirkum-cart.webp";
import thulirkumAdminDashboard from "../assets/projects/thulirkum-admin-dashboard.webp";
import thulirkumAdminSections from "../assets/projects/thulirkum-admin-sections.webp";
import akshayHero from "../assets/projects/akshay-hero.webp";
import akshayHello from "../assets/projects/akshay-hello.webp";
import akshayStudio from "../assets/projects/akshay-studio.webp";
import akshaySpotlight from "../assets/projects/akshay-spotlight.webp";
import akshayGallery from "../assets/projects/akshay-gallery.webp";
import akshaySkills from "../assets/projects/akshay-skills.webp";

// Public address of the website. The digital card, its QR code and its
// "copy link" button all point here. Change it if you get a custom domain.
export const site = {
  url: "https://dev-verse-dev.vercel.app",
};

export const contact = {
  email: "devverse.dev@gmail.com",
  phone: "+91 81441 04500",
  phoneHref: "tel:+918144104500",
  // WhatsApp uses the same number. Remove this line if it is not on WhatsApp.
  whatsappHref: "https://wa.me/918144104500",
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
// Projects that ship with the website. Projects added in the admin area are
// loaded from the server and shown alongside these.
export const builtInProjects = [
  {
    slug: "thulirkum-ver-book-store",
    title: "Thulirkum Ver Book Store",
    category: "E-commerce",
    description:
      "An online bookstore for Tamil and English books, with a customer storefront and a separate admin dashboard to run the store.",
    technologies: ["Storefront", "Admin dashboard", "Hosted on Vercel"],
    status: "Live",
    kind: "shop",
    images: [
      thulirkumHome,
      thulirkumCategories,
      thulirkumCart,
      thulirkumAdminDashboard,
      thulirkumAdminSections,
    ],
    href: "https://thulirkum-ver.vercel.app/home",
    details: {
      overview: [
        "Thulirkum Ver is an online bookstore for Tamil and English books. Visitors can search the catalogue, browse categories and featured authors, save books to a wishlist and order through a cart.",
        "Behind the storefront sits a separate admin dashboard, where the store team manages orders, books, customers, authors, offers and the sections shown on the home page.",
      ],
      scope: [
        "A storefront with search, category browsing, offers and featured authors",
        "Wishlist, cart with coupon codes, and a cashback wallet",
        "Customer accounts with order tracking and saved delivery addresses",
        "An admin dashboard for orders, books, customers, authors, offers and home sections",
      ],
      fit: [
        "You want to sell products online with your own storefront",
        "You need an admin area so your team can manage the store day to day",
      ],
    },
  },
  {
    slug: "akshay-dance-portfolio",
    title: "Akshay Dance Portfolio",
    category: "Portfolio website",
    description:
      "A bold, editorial portfolio website for a dance choreographer and instructor, showing his studio, school work, skills and photo gallery.",
    technologies: ["Portfolio website", "Scroll animations", "Hosted on Vercel"],
    status: "Live",
    kind: "dashboard",
    images: [
      akshayHero,
      akshayHello,
      akshayStudio,
      akshaySpotlight,
      akshayGallery,
      akshaySkills,
    ],
    href: "https://akshay-aks-portfolio.vercel.app",
    details: {
      overview: [
        "This is the personal portfolio of D. Akshay Kumar, a dance teacher and choreographer. We gave it a confident, poster-like look with large type, a paper texture and torn-edge sections.",
        "It tells his story in sections: who he is, the studio he teaches at, the schools he choreographs for, his skills, highlights and a polaroid-style gallery, finishing with a clear way to get in touch.",
      ],
      scope: [
        "A full-screen editorial hero with scroll-driven sections",
        "Sections for the dance studio, schools, skills and highlights",
        "A polaroid-style photo gallery",
        "A contact section linking to email, phone, Instagram and YouTube",
      ],
      fit: [
        "You are a creator or professional who needs a portfolio with personality",
        "You want one page that shows your work and makes it easy to contact you",
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
