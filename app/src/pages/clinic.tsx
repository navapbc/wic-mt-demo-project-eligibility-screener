import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useEffect, useState } from 'react'

import clinics from '@public/clinics.json'

const Clinic: NextPage = () => {
  const { t } = useTranslation('common')
  const [filteredClinics, setFilteredClinics] = useState(null)
  const [search, setSearch] = useState('')
  console.log(clinics)

  const handleSearch = () => {
    const filtered = clinics.

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
          onsubmit={handleSearch}
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
      {
        filteredClinics && <h2>Choose a clinic from the following list:</h2>
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
