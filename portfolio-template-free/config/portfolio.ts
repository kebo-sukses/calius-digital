/**
 * 🎨 PORTFOLIO CONFIGURATION
 * 
 * Edit file ini untuk customize portfolio Anda!
 * Tidak perlu edit code lain, cukup ganti value di sini.
 */

export const portfolioConfig = {
  // ====================================
  // 📋 INFORMASI PERSONAL
  // ====================================
  personal: {
    name: "John Doe",
    title: "Frontend Developer",
    tagline: "I build beautiful and functional websites using modern technologies",
    email: "john@example.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&q=80", // Professional headshot
    bio: `Halo! Saya seorang Frontend Developer dengan 3+ tahun pengalaman dalam membangun aplikasi web modern. 
    
Saya passionate tentang menciptakan user experience yang intuitif dan performa aplikasi yang cepat. Spesialisasi saya adalah React, Next.js, dan TypeScript.

Selalu excited untuk belajar teknologi baru dan collaborate dengan tim yang solid!`,
  },

  // ====================================
  // 🔗 SOCIAL MEDIA LINKS
  // ====================================
  social: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe", // optional
    instagram: "https://instagram.com/johndoe", // optional
    website: "https://johndoe.dev", // optional
  },

  // ====================================
  // 💼 SKILLS
  // ====================================
  skills: [
    // Frontend
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "HTML/CSS",
    "JavaScript",
    
    // Backend (optional)
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    
    // Tools
    "Git",
    "Docker",
    "Figma",
    "VS Code",
  ],

  // ====================================
  // 🚀 PROJECTS / PORTFOLIO
  // ====================================
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack toko online dengan payment gateway Midtrans dan dashboard admin. Fitur: product management, order tracking, analytics.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop&q=80",
      tags: ["Next.js", "TypeScript", "Tailwind", "Midtrans"],
      liveUrl: "https://ecommerce-demo.vercel.app",
      githubUrl: "https://github.com/johndoe/ecommerce",
      featured: true, // Project ini akan ditampilkan lebih besar
    },
    {
      id: 2,
      title: "Company Profile Website",
      description: "Website company profile responsive dengan CMS untuk easy content management. Landing page yang fast dan SEO-friendly.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80",
      tags: ["React", "Sanity CMS", "Vercel"],
      liveUrl: "https://company-profile-demo.com",
      githubUrl: null, // Kalau repo private, set null
      featured: false,
    },
    {
      id: 3,
      title: "Task Management App",
      description: "Aplikasi todo list dengan drag & drop, kategorisasi task, dan daily reminder notification.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800&fit=crop&q=80",
      tags: ["React", "Firebase", "Material-UI"],
      liveUrl: "https://taskapp-demo.vercel.app",
      githubUrl: "https://github.com/johndoe/task-app",
      featured: false,
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "Real-time weather dashboard dengan forecast 7 hari, maps integration, dan weather alerts.",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=1200&h=800&fit=crop&q=80",
      tags: ["Next.js", "OpenWeather API", "Chart.js"],
      liveUrl: "https://weather-demo.vercel.app",
      githubUrl: "https://github.com/johndoe/weather-dashboard",
      featured: false,
    },
    {
      id: 5,
      title: "Blog Platform",
      description: "Platform blogging dengan markdown editor, syntax highlighting untuk code, dan comment system.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop&q=80",
      tags: ["Next.js", "MDX", "Prisma", "PostgreSQL"],
      liveUrl: "https://blog-demo.vercel.app",
      githubUrl: "https://github.com/johndoe/blog-platform",
      featured: false,
    },
    {
      id: 6,
      title: "Landing Page Builder",
      description: "Drag & drop landing page builder dengan template library dan export to HTML feature.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop&q=80",
      tags: ["React", "DnD Kit", "TailwindCSS"],
      liveUrl: null, // Kalau belum deploy, set null
      githubUrl: "https://github.com/johndoe/landing-builder",
      featured: false,
    },
  ],

  // ====================================
  // 🎨 THEME CONFIGURATION
  // ====================================
  theme: {
    // Primary color for buttons, links, etc
    // Options: "blue", "purple", "green", "orange", "pink", "red"
    primaryColor: "blue",
    
    // Font family
    // Options: "inter", "poppins", "roboto", "mono"
    font: "inter",
    
    // Layout style
    // Options: "minimal", "modern", "creative"
    layout: "minimal",
  },

  // ====================================
  // 🔍 SEO METADATA
  // ====================================
  seo: {
    title: "John Doe - Frontend Developer Portfolio",
    description: "Portfolio website of John Doe, Frontend Developer specializing in React, Next.js, and TypeScript. Based in Jakarta, Indonesia.",
    keywords: [
      "frontend developer",
      "react developer",
      "next.js developer",
      "typescript",
      "web developer portfolio",
      "jakarta developer",
    ],
    ogImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop&q=80", // Image untuk social media share (1200x630px)
    siteUrl: "https://johndoe.dev",
  },

  // ====================================
  // 📞 CONTACT PREFERENCES
  // ====================================
  contact: {
    // Preferred contact method
    preferredMethod: "email", // "email" or "form"
    
    // Contact form settings (jika pakai form)
    formEnabled: true,
    formSubmitText: "Kirim Pesan",
    
    // WhatsApp quick link (optional)
    whatsappNumber: "6281234567890", // Format: country code + number (no + or -)
    whatsappMessage: "Halo! Saya tertarik untuk discuss project dengan Anda.",
  },
};

// Type exports untuk TypeScript autocomplete
export type PortfolioConfig = typeof portfolioConfig;
export type Project = typeof portfolioConfig.projects[0];
