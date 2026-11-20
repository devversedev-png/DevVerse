import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { builtInProjects } from "../data/site";
import { fetchPublicProjects, imageUrl } from "../services/projectApi";

const ProjectsContext = createContext(null);

/* Shapes a project from the server like the built-in ones. */
function fromServer(remote) {
  const details = remote.details || {};

  return {
    slug: remote.slug,
    title: remote.title,
    category: remote.category || "Website",
    description: remote.description,
    status: remote.status || "Live",
    href: remote.href || null,
    technologies: remote.technologies || [],
    kind: "dashboard",
    images: (remote.imagePaths || []).map(imageUrl),
    details: {
      overview: details.overview || [],
      scope: details.scope || [],
      fit: details.fit || [],
    },
    fromAdmin: true,
  };
}

export function ProjectsProvider({ children }) {
  const [remote, setRemote] = useState([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchPublicProjects(controller.signal)
      .then((list) => setRemote(list.map(fromServer)))
      .catch(() => {
        // The built-in projects still show if the server is asleep or offline.
      });

    return () => controller.abort();
  }, [version]);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);

  const value = useMemo(() => {
    // Newest admin-added projects first, then the built-in ones.
    const projects = [...remote, ...builtInProjects];

    return {
      projects,
      getProject: (slug) => projects.find((project) => project.slug === slug),
      refresh,
    };
  }, [remote, refresh]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error("useProjects must be used inside ProjectsProvider");
  }

  return context;
}
