import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'

const Review: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <h1>{t('Review.title')}</h1>
      <p>{t('Review.subHeader')}</p>
      <OverviewTables editable />
      <ButtonLink href="/summary" label={t('Review.button')} />
      <br />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await fetch(`${process.env.HOST}/v1/eligibility-screener`, {
    method: 'POST',
    body: JSON.stringify({
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "111-111-1111",
      eligibility_categoies: ["pregnant"],
      has_prior_wic_enrollment: false,
      eligibility_programs: ["snap"],
      household_size: 2,
      zip_code: "11111",
      wic_clinic: "Example Clinic",
      applicant_notes: ""
    }),
    headers: {
      'Content-type': 'application/json',
      'X-Auth': 'LOCAL_AUTH_12345678'
    }
  })
  const response = await res.json()
  console.log("TESTINGG")
  console.log(response)
  debugger
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Review
