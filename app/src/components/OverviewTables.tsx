import { useTranslation } from 'next-i18next'
import { ReactElement } from 'react'
import { useAppContext } from 'src/context/state'

import Table from '@components/Table'

type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'

type Program = 'insurance' | 'snap' | 'tanf'

interface Props {
  editable?: boolean
}

const OverviewTables = (props: Props): ReactElement => {
  const { t } = useTranslation('common')
  const { session } = useAppContext()
  const { editable } = props
  const categoryKeys: Category[] = [
    'pregnant',
    'baby',
    'child',
    'guardian',
    'loss',
  ]
  const programKeys: Program[] = ['insurance', 'snap', 'tanf']

  const formatClinic = (): string => {
    const clinic = session && session.clinic

    return `
      ${(clinic && clinic.clinic) || ''}
      <br />
      ${(clinic && clinic.clinicAddress) || ''}
      <br />
      ${(clinic && clinic.clinicTelephone) || ''}
    `
  }

  const formatEligibilitySelections = (
    keys: (Category | Program)[]
  ): string => {
    let returnVal = ''

    keys.forEach((key: Category | Program) => {
      if (session.eligibility[key]) {
        returnVal = returnVal.concat(t(`Eligibility.${key}`), '<br /> ')
      }
    })

    return returnVal
  }

  return (
    <>
      <Table
        editable={editable}
        editLink="eligibility"
        title={t('Review.eligibilityTitle')}
        rows={[
          {
            header: t('Eligibility.residential'),
            body: (session && session.eligibility.residential) || '',
          },
          {
            header: t('Eligibility.categorical'),
            body: formatEligibilitySelections(categoryKeys),
          },
          {
            header: t('Eligibility.programs'),
            body: formatEligibilitySelections(programKeys),
          },
        ]}
      />
      <Table
        editable={editable}
        editLink="/clinic"
        title={t('Clinic.title')}
        rows={[
          {
            header: t('Review.clinicSelected'),
            body: (session && session.clinic && formatClinic()) || '',
          },
        ]}
      />
      <Table
        editable={editable}
        editLink="/contact"
        title={t('Contact.title')}
        rows={[
          {
            header: t('Contact.firstName'),
            body: (session && session.contact.firstName) || '',
          },
          {
            header: t('Contact.lastName'),
            body: (session && session.contact.lastName) || '',
          },
          {
            header: t('Contact.phoneLabel'),
            body: (session && session.contact.phone) || '',
          },
          {
            header: t('Contact.otherLabel'),
            body: (session && session.contact.other) || '',
          },
        ]}
      />
    </>
  )
}

export default OverviewTables
