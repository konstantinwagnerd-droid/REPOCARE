/**
 * Renders react-email templates to HTML + text. Lazy-loaded to avoid bundling
 * the entire emails/ tree into the edge runtime.
 */
export interface RenderedEmail {
  html: string;
  text: string;
  subject: string;
}

type TemplateArgs = Record<string, unknown>;

/**
 * Thin adapter — walks emails/ at runtime. We don't force a registry to keep
 * adding templates frictionless. Name = filename without extension.
 */
export async function renderEmailTemplate(
  templateName: string,
  args: TemplateArgs = {},
): Promise<RenderedEmail> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(`@/emails/${templateName}`);
    const Component = mod.default ?? mod[templateName];
    if (!Component) throw new Error(`Template ${templateName} has no default export`);
    const { render } = await import("@react-email/render");
    const element = Component(args);
    const html = await render(element);
    const text = await render(element, { plainText: true });
    const subject = (mod.subject as string) ?? (args.subject as string) ?? "CareAI";
    return { html, text, subject };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`renderEmailTemplate(${templateName}) failed: ${msg}`);
  }
}
