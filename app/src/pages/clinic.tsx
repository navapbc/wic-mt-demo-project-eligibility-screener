import { useAppContext } from '@context/state'
import clinics from '@public/clinic-output/clinics-with-ids.json'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import Button from '@components/Button'
import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

interface Props {
  previousRoute: string
}

const Clinic: NextPage<Props> = (props: Props) => {
  const { session, setSession } = useAppContext()
  const [expandList, setExpandList] = useState<boolean>(false)
  const numberOfClinicsToReturn = 8
  const [selectedClinic, setSelectedClinic] = useState<
    typeof clinics[0] | undefined
  >(session?.clinic)
  const [filteredClinics, setFilteredClinics] = useState<
    (typeof clinics[0] | undefined)[]
  >(session?.clinic ? [selectedClinic] : [])
  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState<boolean>(false)
  const [zipValidationError, setZipValidationError] = useState<boolean>(false)
  const [continueBtn, setContinueBtn] = useState<{
    labelKey: string
    route: string
  }>({ labelKey: 'Clinic.button', route: '/contact' })

  useEffect(() => {
    if (props.previousRoute === '/review') {
      setContinueBtn({
        labelKey: 'updateAndReturn',
        route: props.previousRoute,
      })
    }
  }, [props.previousRoute])

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
    const selectedClinic = filteredClinics[clinicIndex]

    setSelectedClinic(selectedClinic)
    setSession({ ...session, clinic: selectedClinic })
  }

  const selected = (clinic: typeof clinics[0]) => {
    return clinic.clinic === selectedClinic?.clinic
  }

  return (
    <>
      <BackLink href="/income" />
      <h1>
        <Trans i18nKey="Clinic.title" />
      </h1>
      <RequiredQuestionStatement />

      <div className="content-group">
        <p>
          <Trans i18nKey="Clinic.body" />
        </p>
      </div>

      <div className="content-group">
        <h2>
          <Trans i18nKey="Clinic.searchLabel" />
          <abbr className="usa-hint usa-hint--required"> *</abbr>
        </h2>
        <section aria-label="Search clinic by zip">
          {zipValidationError && (
            <span className="usa-error-message">
              <Trans i18nKey="Clinic.zipValidationError" />
            </span>
          )}
          <form
            className="usa-search usa-search--small"
            role="search"
            onSubmit={handleSearch}
          >
            <label className="usa-sr-only" htmlFor="search-field-en-small">
              <Trans i18nKey="Clinic.searchLabel" />
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
        {searchError && (
          <Alert type="error" alertBody="Clinic.zipSearchError" icon={true} />
        )}
      </div>

      {filteredClinics.length > 0 ? (
        <>
          <h2>
            <Trans i18nKey="Clinic.listTitle" />
            <abbr className="usa-hint usa-hint--required"> *</abbr>
          </h2>
          <form className="usa-form usa-form--large">
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
                          <ClinicInfo
                            name={clinic.clinic}
                            streetAddress={clinic.clinicAddress}
                            phone={clinic.clinicTelephone}
                            isFormElement={true}
                          />
                        </label>
                      </div>
                    )
                )}
              {!expandList && (
                <Button
                  labelKey="Clinic.showMoreOptions"
                  style="unstyled"
                  onClick={() => setExpandList(true)}
                />
              )}
            </fieldset>
            <ButtonLink
              disabled={selectedClinic === undefined}
              href={continueBtn.route}
              labelKey={continueBtn.labelKey}
            />
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  const previousRoute =
    prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  let returnval: GetServerSidePropsResult<{ [key: string]: object | string }> =
    {
      props: {
        previousRoute: previousRoute as string,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
    }

  if (
    !['/income', '/review', '/contact', '/eligibility'].includes(
      previousRoute as string
    )
  ) {
    returnval = {
      ...returnval,
      redirect: {
        destination: previousRoute || '/',
        permanent: false,
      },
    }
  }

  return returnval
}

export default Clinic
