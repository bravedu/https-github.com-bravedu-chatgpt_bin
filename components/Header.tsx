import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router'
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations('Index')
  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-1 ml-1">
        <Image
          alt="header text"
          src="/logo.png"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={16}
        />
        <h1 className="sm:text-4xl text-2xl font-bold tracking-tight color-pink">
          {t('title')}
        </h1>
      </Link>
      <div className="flex gap-2">
      {
        otherLocale && (
          <div
            className="relative font-medium text-black-600 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:scale-x-0 before:bg-indigo-600 before:transition hover:before:scale-x-100">
          <Link href={route} locale={otherLocale}>
            {t('switchLocale', { locale: otherLocale })}
          </Link>
          </div>
        )
      }

      </div>


    </header>
  );
}
