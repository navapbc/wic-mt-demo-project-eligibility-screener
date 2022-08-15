import clinics from '@public/data/clinics.json'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'

import ButtonLink from '@components/ButtonLink'

const Clinic: NextPage = () => {
  const { t } = useTranslation('common')
  const [filteredClinics, setFilteredClinics] = useState<typeof clinics>([])
  const [selectedClinic, setSelectedClinic] = useState<
    typeof clinics[0] | undefined
  >(undefined)
  const [search, setSearch] = useState('')

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSelectedClinic(undefined)
    const filtered = clinics.filter((clinic) => clinic.zip === search)

    setFilteredClinics(filtered)
  }

  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = e.target
    const clinicIndex = filteredClinics?.findIndex(
      (clinic) => clinic.clinic === value
    )

    setSelectedClinic(filteredClinics[clinicIndex])
  }

  const selected = (clinic: typeof clinics[0]) => {
    return clinic.clinic === selectedClinic?.clinic
  }

  return (
    <>
      <Link href="/income">Back</Link>
      <h1>{t('Clinic.title')}</h1>
      <p>
        {t('Eligibility.asterisk')} (
        <abbr className="usa-hint usa-hint--required">*</abbr>).
      </p>
      <p>{t('Clinic.body')}</p>
      <br />
      <h3>
        {t('Clinic.searchLabel')}{' '}
        <abbr className="usa-hint usa-hint--required"> *</abbr>
      </h3>
      <section aria-label="Search clinic by zip">
        <form
          className="usa-search usa-search--small"
          role="search"
          onSubmit={handleSearch}
        >
          <label className="usa-sr-only" htmlFor="search-field-en-small">
            {t('Clinic.searchLabel')}
          </label>
          <input
            className="usa-input"
            id="search-field-en-small"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="usa-button" type="submit">
            <Image
              src="/img/search.svg"
              height="20px"
              width="20px"
              className="usa-search__submit-icon"
              alt="Search"
            />
          </button>
        </form>
      </section>
      {filteredClinics.length > 0 ? (
        <>
          <h2>{t('Clinic.listTitle')}</h2>
          <form className="usa-form">
            <fieldset className="usa-fieldset">
              {filteredClinics?.map((clinic, index) => (
                <div className="usa-radio" key={index}>
                  <input
                    checked={selected(clinic)}
                    className="usa-radio__input usa-radio__input--tile"
                    id={clinic.clinic}
                    onChange={handleSelection}
                    type="radio"
                    value={clinic.clinic}
                  />
                  <label className="usa-radio__label" htmlFor={clinic.clinic}>
                    {clinic.clinic}
                    <span className="usa-checkbox__label-description">
                      <em>{clinic.clinicAddress}</em>
                      <br />
                      <em>{clinic.clinicTelephone}</em>
                    </span>
                  </label>
                </div>
              ))}
            </fieldset>
          </form>
          <br />
          <ButtonLink
            disabled={selectedClinic === undefined}
            href="/contact"
            label={t('Clinic.button')}
            width="155px"
          />
        </>
      ) : (
        <>
          <br />
          <br />
          <br />
          <br />
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Clinic
