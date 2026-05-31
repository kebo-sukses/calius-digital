import { Badge } from "@/components/ui/badge";
import { portfolioConfig } from "@/config/portfolio";

export function AboutSection() {
  const { personal, skills } = portfolioConfig;

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Tentang Saya
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          {/* Bio */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
              {personal.bio}
            </p>
          </div>

          {/* Location & Email */}
          <div className="flex flex-wrap gap-6 text-muted-foreground">
            {personal.location && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{personal.location}</span>
              </div>
            )}
            {personal.email && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${personal.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {personal.email}
                </a>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
