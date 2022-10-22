import { expect, test } from '@playwright/test'
import {EligibilityPage} from './eligibility'

// Going directly to /income without filling out previous pages should redirect with an error
test('navigating directly to /income should redirect with error', async ({
  page,
}) => {
  await page.goto('/income')
  await expect(page).toHaveURL(/eligibility\?error=missing-data/)
  await expect(page.locator('.usa-alert__text')).toContainText(
    'Some required responses are missing'
  )
})

// Going directly to /choose-clinic without filling out previous pages should redirect with an error
test('navigating directly to /choose-clinic should redirect with error', async ({
  page,
}) => {
  await page.goto('/choose-clinic')
  await expect(page).toHaveURL(/eligibility\?error=missing-data/)
  await expect(page.locator('.usa-alert__text')).toContainText(
    'Some required responses are missing'
  )
})

// Going directly to /contact without filling out previous pages should redirect with an error
test('navigating directly to /contact should redirect with error', async ({
  page,
}) => {
  await page.goto('/contact')
  await expect(page).toHaveURL(/eligibility\?error=missing-data/)
  await expect(page.locator('.usa-alert__text')).toContainText(
    'Some required responses are missing'
  )
})

// Going directly to /review without filling out previous pages should redirect with an error
test('navigating directly to /review should redirect with error', async ({
  page,
}) => {
  await page.goto('/review')
  await expect(page).toHaveURL(/eligibility\?error=missing-data/)
  await expect(page.locator('.usa-alert__text')).toContainText(
    'Some required responses are missing'
  )
test('navigating to /income after filling out /eligibility shows no error', async ({page}) => {
  const eligibilityPage = new EligibilityPage(page)
  await eligibilityPage.goto()
  await eligibilityPage.fillResidential(true)
  await expect(page.locator('[for=residential-yes]')).toBeChecked()
})
