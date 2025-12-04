import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-foreground">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-violet-500 pl-4 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-secondary px-1.5 py-0.5 rounded text-sm text-violet-300 font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const imageUrl = urlFor(value).width(1200).auto("format").url();

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-card">
            <Image
              src={imageUrl}
              alt={value.alt || "Lesson image"}
              fill
              className="object-contain"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface LessonContentProps {
  content: TypedObject[] | null | undefined;
}

export function LessonContent({ content }: LessonContentProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="prose max-w-none dark:prose-invert bg-card border border-border rounded-xl p-6 transition-colors">
      <PortableText value={content} components={components} />
    </div>
  );
}
