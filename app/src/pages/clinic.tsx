import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'

import clinics from '@public/clinics.json'

const Clinic: NextPage = () => {
  const { t } = useTranslation('common')
  const [filteredClinics, setFilteredClinics] = useState(null)
  const [search, setSearch] = useState('')
  console.log(clinics)

  const handleSearch = (e) => {
    e.preventDefault()
    const filtered = clinics
      .filter(clinic => clinic.zip === search)
      .map(clinic => ({...clinic, selected: false}))

    console.log(filtered)
    setFilteredClinics(filtered)
  }

  return (
    <>
      <h2>{t('Clinic.title')}</h2>
      <p>{t('Clinic.body')}</p>
      <br />
      <em>{t('Clinic.searchLabel')}</em>
      <section aria-label="Small search component">
        <form
          className="usa-search usa-search--small"
          role="search"
          onSubmit={handleSearch}
          >
          <input
            className="usa-input"
            id="search-field-en-small"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="usa-button" type="submit" >
            <img
              src="/img/search.svg"
              className="usa-search__submit-icon"
              alt="Search"
            />
          </button>
        </form>
      </section>
      <br />
      { filteredClinics && (
        <>
          <h2>Choose a clinic from the following list:</h2>
          <form className="usa-form">
            <fieldset className="usa-fieldset">
            { filteredClinics.map((clinic) => (
              <div className="usa-radio">
                <input
                  className="usa-radio__input usa-radio__input--tile"
                  id={clinic.clinic}
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
        </>)
      }
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
