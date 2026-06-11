import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export function MarkdownView({ source }: { source: string }) {
  return (
    <article
      className="prose prose-invert prose-sm md:prose-base max-w-none
        prose-headings:tracking-tight prose-headings:font-semibold
        prose-h1:text-2xl md:prose-h1:text-3xl
        prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8
        prose-h3:text-lg
        prose-a:text-cyan-400 hover:prose-a:text-cyan-300
        prose-code:text-cyan-300 prose-code:before:hidden prose-code:after:hidden
        prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-zinc-950/80 prose-pre:border prose-pre:border-white/10
        prose-pre:rounded-xl
        prose-blockquote:border-l-cyan-500/60
        prose-strong:text-foreground
        prose-li:my-0.5
        prose-img:rounded-lg"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
