import clinics from '@public/clinic-output/clinics-with-ids.json'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'

import Alert from '@components/Alert'
import ButtonLink from '@components/ButtonLink'

const Clinic: NextPage = () => {
  const { t } = useTranslation('common')
  const [expandList, setExpandList] = useState<boolean>(false)
  const numberOfClinicsToReturn = 8
  const [filteredClinics, setFilteredClinics] = useState<
    (typeof clinics[0] | undefined)[]
  >([])
  const [selectedClinic, setSelectedClinic] = useState<
    typeof clinics[0] | undefined
  >(undefined)
  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState<boolean>(false)
  const [zipValidationError, setZipValidationError] = useState<boolean>(false)

  const isValidZip = (zip: string) => {
    return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSelectedClinic(undefined)

    if (isValidZip(search)) {
      setZipValidationError(false)
      import(
        `../../public/clinic-output/clinics-zip-code-lookup/${search}.json`
      )
        .then(
          (sortedClinics: { default: { id: number; distance: string }[] }) => {
            const clinicsWithDetails: (typeof clinics[0] | undefined)[] =
              sortedClinics.default
                .slice(0, numberOfClinicsToReturn)
                .map((clinic: typeof sortedClinics.default[0]) =>
                  clinics.find(
                    (clinicDetails: typeof clinics[0]) =>
                      clinicDetails.id === clinic.id
                  )
                )
                .filter(Boolean)

            setSearchError(false)
            setFilteredClinics(clinicsWithDetails)
          }
        )
        .catch((error) => {
          console.log(error)
          setSearchError(true)
          setFilteredClinics([])
        })
    } else {
      setZipValidationError(true)
    }
  }

  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = e.target
    const clinicIndex = filteredClinics?.findIndex(
      (clinic) => clinic?.clinic === value
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
        {t('asterisk')} (<abbr className="usa-hint usa-hint--required">*</abbr>
        ).
      </p>
      <p>{t('Clinic.body')}</p>
      <br />
      <h2>
        {t('Clinic.searchLabel')}{' '}
        <abbr className="usa-hint usa-hint--required"> *</abbr>
      </h2>
      <section aria-label="Search clinic by zip">
        {zipValidationError && (
          <span className="usa-error-message">
            {t('Clinic.zipValidationError')}
          </span>
        )}
        <form
          className="usa-search usa-search--small"
          role="search"
          onSubmit={handleSearch}
        >
          <label className="usa-sr-only" htmlFor="search-field-en-small">
            {t('Clinic.searchLabel')}
          </label>
          <input
            className="usa-input usa-input-error"
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
      {searchError && <Alert type="error" text={t('Clinic.zipSearchError')} />}
      {filteredClinics.length > 0 ? (
        <>
          <h2>
            {t('Clinic.listTitle')}{' '}
            <abbr className="usa-hint usa-hint--required"> *</abbr>
          </h2>
          <form className="usa-form">
            <fieldset className="usa-fieldset">
              {filteredClinics
                ?.slice(0, expandList ? filteredClinics.length : 4)
                .map(
                  (clinic, index) =>
                    clinic && (
                      <div className="usa-radio" key={index}>
                        <input
                          checked={selected(clinic)}
                          className="usa-radio__input usa-radio__input--tile"
                          id={clinic.clinic}
                          onChange={handleSelection}
                          type="radio"
                          value={clinic.clinic}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={clinic.clinic}
                        >
                          {clinic.clinic}
                          <span className="usa-checkbox__label-description">
                            {clinic.clinicAddress}
                            <br />
                            {clinic.clinicTelephone}
                          </span>
                        </label>
                      </div>
                    )
                )}
              {!expandList && (
                <button
                  onClick={() => setExpandList(true)}
                  className="usa-button usa-button--unstyled"
                >
                  Show more clinic options
                </button>
              )}
            </fieldset>
          </form>
          <br />
          <ButtonLink
            disabled={selectedClinic === undefined}
            href="/contact"
            label={t('Clinic.button')}
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
