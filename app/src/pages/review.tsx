import { useAppContext } from '@context/state'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect } from 'react'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'

type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'

type Program = 'insurance' | 'snap' | 'tanf' | 'fdpir'

const Review: NextPage = () => {
  const { t } = useTranslation('common')
  const { session, setSession } = useAppContext()

  const categoryKeys: Category[] = [
    'pregnant',
    'baby',
    'child',
    'guardian',
    'loss',
  ]
  const programKeys: Program[] = ['insurance', 'snap', 'fdpir', 'tanf']
  const createCopyArray = (keys: Category[] | Program[]) => {
    const returnval: [] = []
    keys.forEach((key: Category | Program) => {
      if (session?.eligibility[key]) {
        returnval.push(t(`Eligibility.${key}`))
      }
    })
    return returnval
  }

  useEffect(() => {
    // If eligibility is updated, udpate csv copy array for API call in next page
    // REMOVE THIS WHEN API CALL IS REFACTORED
    const categoryCopy: string[] = createCopyArray(categoryKeys)
    const programCopy: string[] = createCopyArray(programKeys)

    setSession({
      ...session,
      csv: {
        category_copy_array: categoryCopy,
        program_copy_array: programCopy,
      },
    })
  }, [session.eligibility])

  return (
    <>
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <OverviewTables editable />
      <ButtonLink href="/summary" labelKey="Review.button" />
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
  let returnval: GetServerSidePropsResult<{ [key: string]: object }> = {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }

  if (
    !['/clinic', '/eligibility', '/contact'].includes(previousRoute as string)
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

export default Review
