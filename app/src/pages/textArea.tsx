import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextArea from '@components/TextArea'
import TextInput from '@components/TextInput'

import type { ContactData, ModifySessionProps } from '@src/types'

const blahTextArea: NextPage<ModifySessionProps> = (
  props: ModifySessionProps
) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using the value in session.
  const [form, setForm] = useState<ContactData>(session.contact)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setForm(session.contact)
  }, [session.contact])

  const [comments, setComments] = useState('')
  useEffect(() => {
    setComments(form.comments)
  }, [form])

  const handleChangeTextArea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value, name }: { value: string; name: string } = e.target
    console.log(`handleChangeTextArea: name: ${name}, value: ${value}`)
    const newForm = { ...form, [name]: value }

    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  return (
    <TextArea
      // handleChange={(e) => setComments(e.target.value)}
      handleChange={handleChangeTextArea}
      id="comments"
      labelKey="Contact.comments"
      value={form.comments}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default blahTextArea
