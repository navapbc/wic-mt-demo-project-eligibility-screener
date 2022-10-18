import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Trans } from 'next-i18next'
import { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react'

import Button from '@components/Button'
import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import Required from '@components/Required'

type ClinicSelectionListProps = {
  filteredClinics: (typeof clinics[0] | undefined)[]
  expandList: boolean
  setExpandList: Dispatch<SetStateAction<boolean>> | (() => unknown)
  selectedClinic: typeof clinics[0] | undefined
  handleSelection: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  continueBtn: {
    labelKey: string
    route: string
  }
}

// @TODO: add storybook story
const ClinicSelectionList = (props: ClinicSelectionListProps): ReactElement => {
  const {
    filteredClinics,
    expandList,
    setExpandList,
    selectedClinic,
    handleSelection,
    disabled,
    continueBtn,
  } = props

  let list: ReactElement = <></>
  if (filteredClinics.length > 0) {
    list = (
      <>
        <h2>
          <Trans i18nKey="ChooseClinic.listTitle" />
          <Required />
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
                        checked={selectedClinic?.clinic === clinic.clinic}
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
            {filteredClinics.length > 1 && !expandList && (
              <Button
                labelKey="ChooseClinic.showMoreOptions"
                style="unstyled"
                onClick={() => setExpandList(true)}
              />
            )}
          </fieldset>
          <ButtonLink
            disabled={disabled}
            href={continueBtn.route}
            labelKey={continueBtn.labelKey}
          />
        </form>
      </>
    )
  }

  return list
}

export default ClinicSelectionList