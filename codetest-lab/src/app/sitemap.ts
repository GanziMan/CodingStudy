import type { MetadataRoute } from "next";
import { listProblemIndex } from "@/lib/problems";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const problems = await listProblemIndex();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/problems"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/guide"), changeFrequency: "monthly", priority: 0.8 },
    ...problems.map((p) => ({
      url: absoluteUrl(`/problems/${p.id}`),
      lastModified: p.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
