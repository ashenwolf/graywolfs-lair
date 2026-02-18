import { visit } from "unist-util-visit";
import { renderMermaid } from "beautiful-mermaid";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const MERMAID_DIR = resolve(process.cwd(), "public/assets/mermaid");

export default function remarkMermaid() {
  return async (tree) => {
    const promises = [];

    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid") return;

      promises.push(
        renderMermaid(node.value)
          .then((svg) => {
            const hash = createHash("md5")
              .update(node.value)
              .digest("hex")
              .slice(0, 10);
            const filename = `diagram-${hash}.svg`;

            mkdirSync(MERMAID_DIR, { recursive: true });
            writeFileSync(resolve(MERMAID_DIR, filename), svg, "utf-8");

            parent.children[index] = {
              type: "image",
              url: `/assets/mermaid/${filename}`,
              alt: "Mermaid diagram",
            };
          })
          .catch((err) => {
            console.error(`remark-mermaid: failed to render diagram:`, err);
          }),
      );
    });

    await Promise.all(promises);
  };
}
