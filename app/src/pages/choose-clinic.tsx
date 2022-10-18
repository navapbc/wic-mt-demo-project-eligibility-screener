import clinics from '@public/clinic-output/clinics-with-ids.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import Required from '@components/Required'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

import type { ChooseClinicData, EditablePage } from '@src/types'
import { initialChooseClinicData } from '@utils/sessionData'

// Dynamically load the <ClinicSelectionList> component to prevent SSR hydration conflicts.
const ClinicSelectionList = dynamic(
  () => import('@components/ClinicSelectionList'),
  {
    ssr: false,
  }
)

const ChooseClinic: NextPage<EditablePage> = (props: EditablePage) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using blank values.
  const [form, setForm] = useState<ChooseClinicData>(initialChooseClinicData)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setForm(session.chooseClinic)
  }, [session.chooseClinic])

  // Validation function for zip codes.
  const isValidZip = (zip: string) => {
    return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip)
  }

  // Function to check whether all the required fields in this form
  // page have been filled out.
  // React wants this to be wrapped in a useCallback(), but it can
  // handle an empty dependency array.
  const isRequiredMet = useCallback((formToCheck: ChooseClinicData) => {
    return (
      formToCheck.zipCode !== '' &&
      isValidZip(formToCheck.zipCode) &&
      formToCheck.clinic !== undefined
    )
  }, [])

  // Function to update button route.
  const getRouting = () => {
    return '/contact'
  }

  // Set up action button and routing.
  const defaultActionButton = {
    labelKey: 'ChooseClinic.button',
    route: getRouting(),
  }
  const reviewActionButton = {
    labelKey: 'updateAndReturn',
    route: '/review',
  }
  // Set up routing to determine if the user is reviewing previously entered data.
  const router = useRouter()
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const continueBtn =
    router.query.mode === 'review' ? reviewActionButton : defaultActionButton

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration
  // Since we need to use useEffect to update this state, this also handles anytime the
  // form state is updated, so we don't need to call the same function in handleChange().
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form, isRequiredMet])

  // Page specific states & consts.
  // The max number of clinic results to show the user.
  const numberOfClinicsToReturn = 8
  // A state for handling whether the list of clinics shown to the user is expanded.
  const [expandList, setExpandList] = useState<boolean>(false)
  // A state for holding nearest clinics by zip code.
  const [filteredClinics, setFilteredClinics] = useState<
    (typeof clinics[0] | undefined)[]
  >(form.clinic ? [form.clinic] : [])
  // Use useEffect() to load the selected clinic into filteredClinics state at component
  // mount if filteredClinics is empty. In other words, if the user has selected a clinic,
  // put it into the filtered list to show just that one clinic.
  useEffect(() => {
    if (filteredClinics.length === 0 && form.clinic !== undefined) {
      setFilteredClinics([form.clinic])
    }
  }, [form.clinic, filteredClinics.length])
  // A state for tracking whether the zip code the user entered is out of state.
  const [zipNotInStateError, setZipNotInStateError] = useState<boolean>(false)
  // A state for tracking if there is a validation error in the zip.
  const [zipValidationError, setZipValidationError] = useState<boolean>(false)

  // Change handler for any updates to the zip code search field.
  const handleZipCodeChange = (zipCode: string) => {
    const newForm = { ...form, zipCode: zipCode, clinic: undefined }
    updateFormAndSession(newForm)
    // Reset all the clinic result states.
    setZipNotInStateError(false)
    setFilteredClinics([])
    setExpandList(false)
  }

  // Handle submitting the zip code search form.
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset any saved clinic to undefined.
    updateFormAndSession({ ...form, clinic: undefined })

    // Do the lookup only if the zip code is valid.
    if (isValidZip(form.zipCode)) {
      setZipValidationError(false)
      // Lookup the clinics that match that zip code.
      import(
        `@public/clinic-output/clinics-zip-code-lookup/${form.zipCode}.json`
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

            // Reset the not-in-state error, if any.
            setZipNotInStateError(false)
            // Save the results.
            setFilteredClinics(clinicsWithDetails)
            // Reset the expand list.
            setExpandList(false)
          }
        )
        // If the zip is not in state, then:
        // - log it
        // - display the not-in-state error
        // - clear any previously saved results
        .catch((error) => {
          console.log(error)
          setZipNotInStateError(true)
          setFilteredClinics([])
        })
    } else {
      setZipValidationError(true)
    }
  }

  // Handle selecting a clinic.
  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = e.target
    const clinicIndex = filteredClinics?.findIndex(
      (clinic) => clinic?.clinic === value
    )
    const newSelectedClinic = filteredClinics[clinicIndex]
    const newForm = { ...form, clinic: newSelectedClinic }
    updateFormAndSession(newForm)
  }

  const updateFormAndSession = (newForm: ChooseClinicData) => {
    setForm(newForm)
    setSession({ ...session, chooseClinic: newForm })
  }

  // @TODO: zip code search box and alert are not set to the correct form max-width on non-mobile
  // @TODO: Switch zip code field to use react-number-format. Requires react-number-format to support type=search
  return (
    <>
      <BackLink href="/income" />
      <h1>
        <Trans i18nKey="ChooseClinic.title" />
      </h1>
      <RequiredQuestionStatement />

      <div className="content-group">
        <p>
          <Trans i18nKey="ChooseClinic.body" />
        </p>
      </div>

      <div className="content-group">
        <h2>
          <Trans i18nKey="ChooseClinic.searchLabel" />
          <Required />
        </h2>
        <section aria-label="Search clinic by zip">
          {zipValidationError && (
            <span className="usa-error-message">
              <Trans i18nKey="ChooseClinic.zipValidationError" />
            </span>
          )}
          <form
            className="usa-search usa-search--small"
            role="search"
            onSubmit={handleSearch}
          >
            <label className="usa-sr-only" htmlFor="search-field-en-small">
              <Trans i18nKey="ChooseClinic.searchLabel" />
            </label>
            <input
              className="usa-input usa-input-error"
              id="search-field-en-small"
              type="search"
              value={form.zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
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
        {zipNotInStateError && (
          <Alert
            type="error"
            alertBody="ChooseClinic.zipSearchError"
            icon={true}
          />
        )}
      </div>
      <ClinicSelectionList
        filteredClinics={filteredClinics}
        expandList={expandList}
        setExpandList={setExpandList}
        selectedClinic={form.clinic}
        handleSelection={handleSelection}
        disabled={disabled}
        continueBtn={continueBtn}
      />
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

export default ChooseClinic
