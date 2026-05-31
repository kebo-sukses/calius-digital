"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioConfig, type Project } from "@/config/portfolio";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function ProjectsSection() {
  const { projects } = portfolioConfig;

  // Featured project (jika ada)
  const featuredProject = projects.find((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Portfolio & Projects
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
            <p className="text-muted-foreground text-lg">
              Beberapa project yang pernah saya kerjakan
            </p>
          </div>

          {/* Featured Project (if exists) */}
          {featuredProject && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">⭐</span> Featured Project
              </h3>
              <FeaturedProjectCard project={featuredProject} />
            </div>
          )}

          {/* Regular Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">{project.title}</CardTitle>
            <CardDescription className="text-base">
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            {project.liveUrl && (
              <Button asChild size="sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild size="sm" variant="outline">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Code
                </a>
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {project.liveUrl && (
          <Button asChild size="sm" className="flex-1">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild size="sm" variant="outline" className="flex-1">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-3 h-3 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
