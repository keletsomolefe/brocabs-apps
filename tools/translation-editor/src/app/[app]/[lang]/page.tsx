import { notFound } from "next/navigation";
import { getTranslationEntries } from "@/lib/actions";
import { LANGUAGES, APPS } from "@/lib/constants";
import type { AppName, LangCode } from "@/lib/types";
import { TranslationEditor } from "@/features/editor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ app: string; lang: string }>;
}

export default async function EditorPage({ params }: Props) {
  const { app, lang } = await params;

  // Validate params
  if (!APPS.some((a) => a.value === app)) notFound();
  if (!LANGUAGES.some((l) => l.code === lang)) notFound();
  if (lang === "en") notFound();

  const appName = app as AppName;
  const langCode = lang as LangCode;

  const { entries, sections } = await getTranslationEntries(appName, langCode);

  return (
    <TranslationEditor
      app={appName}
      lang={langCode}
      initialEntries={entries}
      sections={sections}
    />
  );
}
