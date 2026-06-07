import type { AskContact } from "@/types/content";

type AskContactCardProps = {
  contact: AskContact;
};

export function AskContactCard({ contact }: Readonly<AskContactCardProps>) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-base font-semibold text-zinc-950">
        {contact.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {contact.description}
      </p>
      <a
        href={contact.contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex text-sm font-semibold text-teal-800 underline decoration-2 underline-offset-4"
      >
        Open contact guidance
      </a>
    </article>
  );
}
