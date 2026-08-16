import { useEffect } from "react";

/**
 * Sets document title, meta description/OG tags, canonical URL, and
 * JSON-LD structured data for a page. No extra dependency required.
 *
 * Usage:
 *   useSEO({
 *     title: "Books & Free Resources | Memora Smart Technologies",
 *     description: "...",
 *     structuredData: { "@context": "https://schema.org", ... }
 *   });
 */
export default function useSEO({ title, description, structuredData }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    const setMeta = (attr, key, value) => {
      if (!value) return null;
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      const prevContent = tag.getAttribute("content");
      tag.setAttribute("content", value);
      return { tag, created, prevContent };
    };

    const restorers = [];

    const descTag = setMeta("name", "description", description);
    if (descTag) restorers.push(descTag);

    const ogTitle = setMeta("property", "og:title", title);
    if (ogTitle) restorers.push(ogTitle);

    const ogDesc = setMeta("property", "og:description", description);
    if (ogDesc) restorers.push(ogDesc);

    const ogType = setMeta("property", "og:type", "website");
    if (ogType) restorers.push(ogType);

    // JSON-LD structured data
    let scriptTag = null;
    if (structuredData) {
      scriptTag = document.createElement("script");
      scriptTag.type = "application/ld+json";
      scriptTag.text = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }

    return () => {
      document.title = prevTitle;
      restorers.forEach(({ tag, created, prevContent }) => {
        if (created) {
          tag.remove();
        } else if (prevContent !== null) {
          tag.setAttribute("content", prevContent);
        }
      });
      if (scriptTag) scriptTag.remove();
    };
  }, [title, description, structuredData]);
}
