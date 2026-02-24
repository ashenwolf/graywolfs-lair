import { visit } from "unist-util-visit";

// Returns true if the node is a paragraph containing only an image
// (either a standard markdown image node or a raw HTML img produced by remark-obsidian-embeds)
function isImageParagraph(node) {
  if (node.type !== "paragraph") return false;
  const children = node.children;
  if (children.length === 1 && children[0].type === "image") return true;
  if (children.length === 1 && children[0].type === "html") {
    return /<img\b/i.test(children[0].value);
  }
  return false;
}

// Returns true if the node is a paragraph whose sole child is an emphasis node (italics)
function isItalicParagraph(node) {
  if (node.type !== "paragraph") return false;
  return node.children.length === 1 && node.children[0].type === "emphasis";
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return str.replace(/"/g, "&quot;");
}

// Serialise mdast inline nodes to HTML for use inside <figcaption>
function inlineToHtml(node) {
  if (node.type === "text") return escapeHtml(node.value);
  if (node.type === "strong")
    return `<strong>${node.children.map(inlineToHtml).join("")}</strong>`;
  if (node.type === "emphasis")
    return `<em>${node.children.map(inlineToHtml).join("")}</em>`;
  if (node.type === "inlineCode")
    return `<code>${escapeHtml(node.value)}</code>`;
  if (node.type === "link") {
    const href = escapeAttr(node.url);
    return `<a href="${href}">${node.children.map(inlineToHtml).join("")}</a>`;
  }
  return "";
}

function imgParagraphToHtml(node) {
  const child = node.children[0];
  if (child.type === "image") {
    const src = escapeAttr(child.url);
    const alt = escapeAttr(child.alt ?? "");
    return `<img src="${src}" alt="${alt}" />`;
  }
  // raw html node produced by remark-obsidian-embeds — use as-is
  return child.value.trim();
}

export default function remarkImageCaptions() {
  return (tree) => {
    const children = tree.children;
    const replacements = [];

    for (let i = 0; i < children.length - 1; i++) {
      if (isImageParagraph(children[i]) && isItalicParagraph(children[i + 1])) {
        replacements.push(i);
      }
    }

    // Process in reverse so splicing doesn't shift unprocessed indices
    for (let i = replacements.length - 1; i >= 0; i--) {
      const idx = replacements[i];
      const imgNode = children[idx];
      const captionNode = children[idx + 1];

      const imgHtml = imgParagraphToHtml(imgNode);
      // The caption content lives inside the emphasis node
      const captionHtml = captionNode.children[0].children
        .map(inlineToHtml)
        .join("");

      children.splice(idx, 2, {
        type: "html",
        value: `<figure>\n${imgHtml}\n<figcaption>${captionHtml}</figcaption>\n</figure>`,
      });
    }
  };
}
