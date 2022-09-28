import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
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
    const returnval: string[] = []
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
      <h1>{t('Review.title')}</h1>
      <p>{t('Review.subHeader')}</p>
      <OverviewTables editable />
      <ButtonLink href="/summary" label={t('Review.button')} />
      <br />
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

export default Review
