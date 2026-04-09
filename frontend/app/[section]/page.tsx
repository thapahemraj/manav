"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type UserPost = {
  id: string;
  section: string;
  author: string;
  content: string;
  visibility: "public";
  createdAt: string;
};

type SectionConfig = {
  title: string;
  subtitle: string;
  tone: string;
};

const SECTION_MAP: Record<string, SectionConfig> = {
  poets: {
    title: "Poets",
    subtitle: "Explore voices, biographies, and poetic expression from classic and modern authors.",
    tone: "Curated poet highlights and notable writings.",
  },
  sher: {
    title: "Sher",
    subtitle: "Read impactful couplets and concise poetic fragments that stay with the reader.",
    tone: "A quick collection of memorable lines.",
  },
  dictionary: {
    title: "Dictionary",
    subtitle: "Discover meanings, usage context, and literary language references.",
    tone: "Language-first discovery and interpretation.",
  },
  videos: {
    title: "Videos",
    subtitle: "Watch recitations, performances, and literary storytelling content.",
    tone: "Visual and spoken literary experiences.",
  },
  "e-books": {
    title: "E-Books",
    subtitle: "Browse digital books and long-form reading across genres.",
    tone: "Extended reading and archival content.",
  },
  prose: {
    title: "Prose",
    subtitle: "Read essays, reflections, and narrative prose from diverse writers.",
    tone: "Thoughtful long-form writing.",
  },
  blog: {
    title: "Blog",
    subtitle: "Editorial stories, interviews, and cultural commentary from the community.",
    tone: "Current literary conversations.",
  },
  shayari: {
    title: "Shayari",
    subtitle: "Enjoy thematic poetry collections and expressive verse.",
    tone: "Emotion-rich poetic selections.",
  },
  quiz: {
    title: "Quiz",
    subtitle: "Test your literary knowledge with bite-sized quiz formats.",
    tone: "Interactive learning for literature lovers.",
  },
  more: {
    title: "More",
    subtitle: "Access additional categories, tools, and platform experiences.",
    tone: "Everything beyond the core sections.",
  },
};

const NAV_ITEMS = [
  { label: "POETS", href: "/poets" },
  { label: "SHER", href: "/sher" },
  { label: "DICTIONARY", href: "/dictionary" },
  { label: "VIDEOS", href: "/videos" },
  { label: "E-BOOKS", href: "/e-books" },
  { label: "PROSE", href: "/prose" },
  { label: "BLOG", href: "/blog" },
  { label: "SHAYARI", href: "/shayari" },
  { label: "QUIZ", href: "/quiz" },
  { label: "MORE", href: "/more" },
];

export default function SectionPage() {
  const params = useParams<{ section: string }>();
  const sectionSlug = String(params?.section ?? "").toLowerCase();
  const section = SECTION_MAP[sectionSlug];

  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const backendUrl = "http://localhost:3001";

  useEffect(() => {
    if (!section) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        setApiError(null);
        setIsLoading(true);

        const endpoint = sectionSlug === "more"
          ? `${backendUrl}/posts/public`
          : `${backendUrl}/posts?section=${encodeURIComponent(section.title.toUpperCase())}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error("failed_response");
        }

        const data = (await res.json()) as UserPost[];
        setPosts(data);
      } catch {
        setPosts([]);
        setApiError("Unable to load this section. Ensure backend is running on port 3001.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [section, sectionSlug]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;

    return posts.filter((post) =>
      [post.author, post.content, post.section].join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [posts, query]);

  if (!section) {
    return (
      <main className="min-h-screen bg-[#edf3e6] px-4 py-10 text-[#182218]">
        <div className="mx-auto max-w-240 rounded-2xl border border-black/10 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">Section not found</h1>
          <p className="mt-2 text-sm text-[#657a66]">This page does not exist in the menu.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-[#2ce88f] px-5 py-2 text-sm font-semibold text-[#0b1112]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`relative isolate min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? "text-white" : "text-[#182218]"}`}>

      <div className="relative z-10">
      <nav
        className={`sticky top-0 z-40 border-b transition-colors ${
          isDark ? "border-white/10 bg-[#13161b]/85 backdrop-blur-md" : "border-black/10 bg-[#f3f7ef]/86 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[24px] font-bold tracking-[-0.02em]">Manav</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.href === `/${sectionSlug}`;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-[13px] font-semibold tracking-[0.08em] transition hover:opacity-70 ${
                    active
                      ? isDark
                        ? "text-[#8cf8c1]"
                        : "text-[#0a8a5b]"
                      : isDark
                        ? "text-white/80"
                        : "text-[#203022]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] transition ${
                isDark ? "border-white/20 bg-[#1b1e24]" : "border-black/10 bg-white"
              }`}
              aria-label="Toggle theme"
            >
              <span>{isDark ? "DARK" : "LIGHT"}</span>
              <span className={`relative h-4 w-8 rounded-full transition ${isDark ? "bg-[#2ce88f]" : "bg-[#d9dde5]"}`}>
                <span className={`absolute top-0.5 h-3 w-3 rounded-full transition ${isDark ? "left-4 bg-[#0b1112]" : "left-0.5 bg-[#10131a]"}`} />
              </span>
            </button>
            <Link
              href="/"
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${isDark ? "border-white/15 bg-white/5 text-white/85 hover:bg-white/10" : "border-black/10 bg-white/92 text-[#203022] hover:bg-[#ebf3e9]"}`}
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-2 py-5 sm:px-4 md:p-10">
        <div className={`rounded-2xl border p-5 ${isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-white"}`}>
          <p className={`text-[12px] font-semibold tracking-[0.12em] ${isDark ? "text-white/55" : "text-[#637a63]"}`}>
            SECTION
          </p>
          <h1 className="mt-1 text-[36px] font-bold leading-tight tracking-[-0.02em]">{section.title}</h1>
          <p className={`mt-2 max-w-215 text-[15px] ${isDark ? "text-white/70" : "text-[#496048]"}`}>
            {section.subtitle}
          </p>
          <p className={`mt-1 text-[13px] ${isDark ? "text-white/50" : "text-[#657a66]"}`}>{section.tone}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className={`flex min-w-65 flex-1 items-center gap-2 rounded-full border px-4 py-2 ${isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-[#f4f8f0]"}`}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search in ${section.title}`}
                className={`w-full bg-transparent text-[13px] outline-none ${isDark ? "placeholder:text-white/35" : "placeholder:text-[#7e907d]"}`}
              />
            </div>
            <span className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${isDark ? "border-[#8cf8c1]/45 bg-[#2ce88f]/10 text-[#8cf8c1]" : "border-[#00a86b]/35 bg-[#00a86b]/10 text-[#0a8a5b]"}`}>
              {filteredPosts.length} posts
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {apiError ? (
            <div className={`rounded-xl border border-dashed p-6 text-center text-[15px] ${isDark ? "border-white/20 text-white/50" : "border-black/20 text-[#6c7488]"}`}>
              {apiError}
            </div>
          ) : isLoading ? (
            <div className={`rounded-xl border border-dashed p-6 text-center text-[15px] ${isDark ? "border-white/20 text-white/50" : "border-black/20 text-[#6c7488]"}`}>
              Loading {section.title}...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className={`rounded-xl border border-dashed p-6 text-center text-[15px] ${isDark ? "border-white/20 text-white/50" : "border-black/20 text-[#6c7488]"}`}>
              No posts found in {section.title}.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={`section-${post.id}`}
                className={`rounded-2xl border p-4 ${isDark ? "border-white/15 bg-black/15" : "border-black/10 bg-white"}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${isDark ? "bg-white/10 text-white" : "bg-[#edf4ea] text-[#2f4732]"}`}>
                      {post.author.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-[14px] font-semibold ${isDark ? "text-white" : "text-[#202634]"}`}>{post.author}</p>
                      <p className={`text-[12px] ${isDark ? "text-white/45" : "text-[#72866f]"}`}>
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isDark ? "bg-white/10 text-white/75" : "bg-black/6 text-[#516751]"}`}>
                    {post.section}
                  </span>
                </div>

                <p className={`text-[15px] leading-relaxed ${isDark ? "text-white/85" : "text-[#304831]"}`}>
                  {post.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
      </div>
    </main>
  );
}
