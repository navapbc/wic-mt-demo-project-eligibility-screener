import type { GetServerSideProps, NextPage } from 'next'
import { useAppContext } from '@context/state'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'

const Review: NextPage = () => {
  const { t } = useTranslation('common')
  const { session } = useAppContext()

  const submitApplication = async () => {
    debugger
    const request = await fetch(`${process.env.NEXT_PUBLIC_HOST}/v1/eligibility-screener`, {
      method: 'POST',
      body: JSON.stringify({
        first_name: session?.contact.firstName,
        last_name: session?.contact.lastName,
        phone_number: session?.contact.phone,
        eligibility_categoies: ["pregnant"],
        has_prior_wic_enrollment: session?.eligibility?.before.replace(/[2]/g, '') === 'yes',
        eligibility_programs: ["snap"],
        household_size: session?.householdSize,
        zip_code: "11111",
        wic_clinic: session?.clinic,
        applicant_notes: session?.contact.other
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
        'X-Auth': process.env.NEXT_PUBLIC_API_AUTH_TOKEN || '',
      }
    })
    debugger 

    const apiResponse = await request.json()

    console.log("response", apiResponse)
    debugger
    console.log("HERE")
  }

  return (
    <>
      <h1>{t('Review.title')}</h1>
      <p>{t('Review.subHeader')}</p>
      <OverviewTables editable />
      <ButtonLink
        handleClick={submitApplication}
        href="/summary"
        label={t('Review.button')} />
      <br />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_HOST}/v1/eligibility-screener`, {
    method: 'POST',
    body: JSON.stringify({
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "111-111-1111",
      eligibility_categoies: ["pregnant"],
      has_prior_wic_enrollment: true,
      eligibility_programs: ["snap"],
      household_size: 1,
      zip_code: "11111",
      wic_clinic: "CLINIC",
      applicant_notes: ""
    }),
    headers: {
      'Content-type': 'application/json',
      'X-Auth': process.env.NEXT_PUBLIC_API_AUTH_TOKEN || '',
    }
  })
  const apiResponse = await request.json()

  console.log("response", apiResponse)
  debugger
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Review
