import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  Layout,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/TiptapEditor";
import {
  WidgetContainer,
  WIDGET_TYPES,
} from "@/components/widgets/WidgetContainer";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useFolders } from "@/hooks/use-folders";
import { usePages } from "@/hooks/use-pages";
import { useProjects } from "@/hooks/use-projects";
import type { Folder as FolderType, Page, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROOT_KEY = "__root__";

function sortByPositionThenTitle<
  T extends { position?: number; title?: string; name?: string },
>(a: T, b: T) {
  const pA = a.position ?? 0;
  const pB = b.position ?? 0;
  if (pA !== pB) return pA - pB;

  const tA = (a.title ?? a.name ?? "").toLowerCase();
  const tB = (b.title ?? b.name ?? "").toLowerCase();
  return tA.localeCompare(tB);
}

function pageMatchesSearch(page: Page, query: string) {
  if (!query.trim()) return true;
  return page.title.toLowerCase().includes(query.toLowerCase());
}

export default function Projects() {
  const { projects, add: addProject, remove: removeProject } = useProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const [showWidgetMenu, setShowWidgetMenu] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const {
    folders,
    add: addFolder,
    remove: removeFolder,
  } = useFolders(selectedProject?.id);
  const {
    pages,
    add: addPage,
    remove: removePage,
    update: updatePage,
    searchPages,
  } = usePages(selectedProject?.id);
  const selectedPageId = selectedPage?.id;

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    if (!selectedPageId) return;

    const exists = pages.some((page) => page.id === selectedPageId);
    if (!exists) {
      setSelectedPage(null);
    }
  }, [pages, selectedPageId]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }
      event.preventDefault();
      setCommandOpen((prev) => !prev);
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const pageById = useMemo(() => {
    return new Map(pages.map((page) => [page.id, page]));
  }, [pages]);

  const folderById = useMemo(() => {
    return new Map(folders.map((folder) => [folder.id, folder]));
  }, [folders]);

  const pagesByParent = useMemo(() => {
    const map = new Map<string, Page[]>();

    for (const page of pages) {
      const parent = page.parent_page_id ?? ROOT_KEY;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent)?.push(page);
    }

    for (const [key, value] of map.entries()) {
      map.set(key, [...value].sort(sortByPositionThenTitle));
    }

    return map;
  }, [pages]);

  const foldersByParent = useMemo(() => {
    const map = new Map<string, FolderType[]>();

    for (const folder of folders) {
      const parent = folder.parent_folder_id ?? ROOT_KEY;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent)?.push(folder);
    }

    for (const [key, value] of map.entries()) {
      map.set(key, [...value].sort(sortByPositionThenTitle));
    }

    return map;
  }, [folders]);

  const searchResults = useMemo(() => {
    if (!sidebarSearch.trim()) return [];
    return pages
      .filter((page) => pageMatchesSearch(page, sidebarSearch))
      .sort(sortByPositionThenTitle)
      .slice(0, 30);
  }, [pages, sidebarSearch]);

  const selectedPageBreadcrumbs = useMemo(() => {
    if (!selectedPage) return [] as Page[];

    const result: Page[] = [];
    const seen = new Set<string>();
    let cursor: Page | undefined = selectedPage;

    while (cursor && !seen.has(cursor.id)) {
      seen.add(cursor.id);
      result.unshift(cursor);

      if (!cursor.parent_page_id) break;
      cursor = pageById.get(cursor.parent_page_id);
    }

    return result;
  }, [pageById, selectedPage]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const created = await addProject({ name: newProjectName.trim() });
      setSelectedProject(created);
      setNewProjectName("");
      setShowNewProject(false);
      toast.success("Project created");
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Delete this project and everything inside it?")) return;

    try {
      await removeProject(projectId);
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setSelectedPage(null);
      }
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateFolder = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProject || !newFolderName.trim()) return;

    try {
      await addFolder({
        project_id: selectedProject.id,
        name: newFolderName.trim(),
      });
      setShowNewFolder(false);
      setNewFolderName("");
      toast.success("Folder created");
    } catch {
      toast.error("Failed to create folder");
    }
  };

  const handleCreatePage = async ({
    folderId,
    parentPageId,
    title,
  }: {
    folderId?: string;
    parentPageId?: string;
    title?: string;
  } = {}) => {
    if (!selectedProject) return;

    try {
      const page = await addPage({
        project_id: selectedProject.id,
        folder_id: folderId,
        parent_page_id: parentPageId,
        title: title ?? "Untitled",
      });
      setSelectedPage(page);
      if (parentPageId) {
        setExpandedPages((prev) => new Set(prev).add(parentPageId));
      }
      toast.success("Page created");
    } catch {
      toast.error("Failed to create page");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Delete this folder and all pages inside it?")) return;

    try {
      await removeFolder(folderId);
      toast.success("Folder deleted");
    } catch {
      toast.error("Failed to delete folder");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Delete this page?")) return;

    try {
      await removePage(pageId);
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
      }
      toast.success("Page deleted");
    } catch {
      toast.error("Failed to delete page");
    }
  };

  const handleTitleChange = useCallback(
    async (nextTitle: string) => {
      if (!selectedPage) return;
      if (!nextTitle.trim()) return;

      setSelectedPage((prev) =>
        prev && prev.id === selectedPage.id
          ? { ...prev, title: nextTitle }
          : prev,
      );

      try {
        await updatePage({
          id: selectedPage.id,
          input: { title: nextTitle.trim() },
        });
      } catch {
        toast.error("Failed to update title");
      }
    },
    [selectedPage, updatePage],
  );

  const handleContentChange = useCallback(
    async (content: Record<string, unknown>) => {
      if (!selectedPage) return;

      setSelectedPage((prev) =>
        prev && prev.id === selectedPage.id ? { ...prev, content } : prev,
      );

      try {
        await updatePage({
          id: selectedPage.id,
          input: { content },
        });
      } catch {
        toast.error("Failed to save content");
      }
    },
    [selectedPage, updatePage],
  );

  const handleAddWidget = async (widgetType: string) => {
    if (!selectedPage) return;

    const nextWidgets = [
      ...(selectedPage.widgets || []),
      { id: `widget-${Date.now()}`, type: widgetType },
    ];

    setSelectedPage((prev) =>
      prev && prev.id === selectedPage.id
        ? { ...prev, widgets: nextWidgets }
        : prev,
    );

    try {
      await updatePage({
        id: selectedPage.id,
        input: { widgets: nextWidgets },
      });
      setShowWidgetMenu(false);
      toast.success("Widget added");
    } catch {
      toast.error("Failed to add widget");
    }
  };

  const handleRemoveWidget = async (widgetId: string) => {
    if (!selectedPage) return;

    const nextWidgets = (selectedPage.widgets || []).filter(
      (widget) => widget.id !== widgetId,
    );

    setSelectedPage((prev) =>
      prev && prev.id === selectedPage.id
        ? { ...prev, widgets: nextWidgets }
        : prev,
    );

    try {
      await updatePage({
        id: selectedPage.id,
        input: { widgets: nextWidgets },
      });
      toast.success("Widget removed");
    } catch {
      toast.error("Failed to remove widget");
    }
  };

  const openPageFromCommand = (page: Page) => {
    setSelectedPage(page);
    setCommandOpen(false);
  };

  const renderPageNode = (
    page: Page,
    depth: number,
    folderId?: string,
  ): React.ReactNode => {
    const children = (pagesByParent.get(page.id) || [])
      .filter((child) => child.folder_id === folderId)
      .sort(sortByPositionThenTitle);

    const expanded = expandedPages.has(page.id);

    return (
      <div key={page.id} className="space-y-1">
        <div
          className={cn(
            "group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm",
            selectedPage?.id === page.id
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
          )}
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <button
            type="button"
            onClick={() => {
              if (!children.length) return;
              togglePage(page.id);
            }}
            className="flex h-4 w-4 items-center justify-center"
          >
            {children.length > 0 ? (
              expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )
            ) : (
              <span className="h-3 w-3" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(page)}
            className="flex flex-1 items-center gap-2 text-left"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{page.title}</span>
          </button>

          <button
            type="button"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() =>
              handleCreatePage({
                folderId,
                parentPageId: page.id,
                title: "Sub-page",
              })
            }
            title="Add sub-page"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => handleDeletePage(page.id)}
            title="Delete page"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {children.length > 0 && expanded && (
          <div>
            {children.map((child) =>
              renderPageNode(child, depth + 1, folderId),
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFolderNode = (
    folder: FolderType,
    depth: number,
  ): React.ReactNode => {
    const childFolders = foldersByParent.get(folder.id) || [];
    const folderRootPages = (pagesByParent.get(ROOT_KEY) || [])
      .filter((page) => page.folder_id === folder.id)
      .sort(sortByPositionThenTitle);
    const expanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <div
          className="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <button
            type="button"
            onClick={() => toggleFolder(folder.id)}
            className="flex h-4 w-4 items-center justify-center"
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
          <Folder className="h-3.5 w-3.5" />
          <span className="flex-1 truncate">{folder.name}</span>

          <button
            type="button"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => handleCreatePage({ folderId: folder.id })}
            title="New page"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => handleDeleteFolder(folder.id)}
            title="Delete folder"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {expanded && (
          <div className="space-y-1">
            {childFolders.map((child) => renderFolderNode(child, depth + 1))}
            {folderRootPages.map((page) =>
              renderPageNode(page, depth + 1, folder.id),
            )}
          </div>
        )}
      </div>
    );
  };

  const handlePaletteSearch = async (query: string) => {
    if (!query.trim() || !selectedProject) return;
    try {
      await searchPages(query);
    } catch {
      // Keep UI responsive even if remote search fails.
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-border bg-card">
      <Helmet>
        <title>Projects | Xenith</title>
      </Helmet>

      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.aside
            initial={{ width: 320 }}
            animate={{ width: 320 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border bg-background/70"
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Projects
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowNewProject((prev) => !prev)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {showNewProject && (
                  <form onSubmit={handleCreateProject} className="mb-2">
                    <Input
                      autoFocus
                      value={newProjectName}
                      onChange={(event) =>
                        setNewProjectName(event.target.value)
                      }
                      placeholder="Project name"
                      className="h-8 text-sm"
                    />
                  </form>
                )}

                <div className="space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm",
                        selectedProject?.id === project.id
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="flex-1 truncate">{project.name}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter") return;
                          event.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProject ? (
                <div className="flex min-h-0 flex-1 flex-col p-3">
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={sidebarSearch}
                          onChange={(event) =>
                            setSidebarSearch(event.target.value)
                          }
                          placeholder="Search pages"
                          className="h-8 pl-7 text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCommandOpen(true)}
                      >
                        Open
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewFolder((prev) => !prev)}
                      >
                        <FolderPlus className="mr-1 h-3.5 w-3.5" />
                        Folder
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreatePage()}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Page
                      </Button>
                    </div>

                    {showNewFolder && (
                      <form onSubmit={handleCreateFolder}>
                        <Input
                          autoFocus
                          value={newFolderName}
                          onChange={(event) =>
                            setNewFolderName(event.target.value)
                          }
                          placeholder="Folder name"
                          className="h-8 text-sm"
                        />
                      </form>
                    )}
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    {sidebarSearch.trim() ? (
                      <div className="space-y-1">
                        {searchResults.length > 0 ? (
                          searchResults.map((page) => (
                            <button
                              key={page.id}
                              type="button"
                              onClick={() => setSelectedPage(page)}
                              className={cn(
                                "w-full rounded-lg border px-2 py-1.5 text-left text-sm",
                                selectedPage?.id === page.id
                                  ? "border-foreground/20 bg-secondary text-foreground"
                                  : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                              )}
                            >
                              <p className="truncate">{page.title}</p>
                              {page.folder_id && (
                                <p className="truncate text-[11px] text-muted-foreground">
                                  {folderById.get(page.folder_id)?.name ||
                                    "Folder"}
                                </p>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No pages match your search.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {(foldersByParent.get(ROOT_KEY) || []).map((folder) =>
                          renderFolderNode(folder, 0),
                        )}

                        {(pagesByParent.get(ROOT_KEY) || [])
                          .filter((page) => !page.folder_id)
                          .map((page) => renderPageNode(page, 0))}

                        {pages.length === 0 && (
                          <p className="py-8 text-center text-xs text-muted-foreground">
                            No pages yet. Create one to start building your
                            workspace.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center p-4 text-center text-xs text-muted-foreground">
                  Select or create a project to start.
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            {selectedPage && (
              <div className="flex min-w-0 items-center gap-1 overflow-hidden text-xs text-muted-foreground">
                <span className="truncate">{selectedProject?.name}</span>
                {selectedPage.folder_id && (
                  <>
                    <span>/</span>
                    <span className="truncate">
                      {folderById.get(selectedPage.folder_id)?.name || "Folder"}
                    </span>
                  </>
                )}
                {selectedPageBreadcrumbs.map((crumb) => (
                  <div
                    key={crumb.id}
                    className="flex min-w-0 items-center gap-1"
                  >
                    <span>/</span>
                    <button
                      type="button"
                      className="truncate hover:text-foreground"
                      onClick={() => setSelectedPage(crumb)}
                    >
                      {crumb.title}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPage && (
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowWidgetMenu((prev) => !prev)}
              >
                <Layout className="mr-1 h-4 w-4" />
                Add widget
              </Button>

              <AnimatePresence>
                {showWidgetMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl"
                  >
                    <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Page widgets
                    </p>
                    {WIDGET_TYPES.map((widget) => (
                      <button
                        key={widget.id}
                        type="button"
                        onClick={() => handleAddWidget(widget.id)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        {widget.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {selectedPage ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
              <div className="space-y-3">
                <input
                  type="text"
                  value={selectedPage.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  className="w-full border-none bg-transparent text-4xl font-semibold text-foreground outline-none"
                  placeholder="Untitled"
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleCreatePage({
                        folderId: selectedPage.folder_id || undefined,
                        parentPageId: selectedPage.id,
                        title: "Sub-page",
                      })
                    }
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    New sub-page
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePage(selectedPage.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete page
                  </Button>
                </div>
              </div>

              {selectedPage.widgets && selectedPage.widgets.length > 0 && (
                <WidgetContainer
                  widgets={selectedPage.widgets}
                  onRemove={handleRemoveWidget}
                />
              )}

              <TiptapEditor
                key={selectedPage.id}
                content={selectedPage.content || {}}
                onChange={handleContentChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="space-y-3 text-center">
              <FileText className="mx-auto h-14 w-14 text-muted-foreground/40" />
              <p className="text-lg font-medium text-foreground">
                No page selected
              </p>
              <p className="text-sm text-muted-foreground">
                Select a page or create one to begin writing.
              </p>
              {selectedProject && (
                <Button onClick={() => handleCreatePage()}>
                  <Plus className="mr-1 h-4 w-4" />
                  Create page
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput
          placeholder="Search pages or jump to note..."
          onValueChange={handlePaletteSearch}
        />
        <CommandList>
          <CommandEmpty>No matching pages found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <CommandItem
                key={page.id}
                value={page.title}
                onSelect={() => openPageFromCommand(page)}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{page.title}</span>
                <CommandShortcut>Open</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
