// Note: The mock in state zip code must match one of the files found in
//       @public/clinic-output/clinics-zip-code-lookup/
export const mockInStateZipCode = '59901'
export const mockOutofStateZipCode = '12345'

export function getMockClinic() {
  return {
    id: 8,
    agency: 'AGENCY EIGHT',
    agencyAddress: '8888 St, Helena, MT 88888',
    agencyTelephone: '(888) 888-8888',
    clinic: 'CLINIC EIGHT',
    clinicAddress: '8888 St, Helena, MT 88888',
    clinicTelephone: '(888) 888-8888',
    county: 'COUNTY EIGHT',
    zip: '88888',
  }
}

export function setupClinicMocks() {
  // Note: @public/clinic-output/clinics-with-ids.json' cannot be mocked here
  // because it is a top level import in /pages/choose-clinic.tsx.
  // Instead, it is mocked using moduleNameMapper in jest.config.js.

  // Mock the distances for each clinic to the mock in-state zip code.
  jest.mock(
    `@public/clinic-output/clinics-zip-code-lookup/${mockInStateZipCode}.json`,
    () => [
      {
        id: 8,
        distance: '1 mi',
      },
      {
        id: 7,
        distance: '2 mi',
      },
      {
        id: 6,
        distance: '3 mi',
      },
      {
        id: 5,
        distance: '4 mi',
      },
      {
        id: 4,
        distance: '5 mi',
      },
      {
        id: 3,
        distance: '6.6 mi',
      },
      {
        id: 2,
        distance: '7 mi',
      },
      {
        id: 1,
        distance: '8 mi',
      },
      {
        id: 0,
        distance: '20 mi',
      },
    ],
    { virtual: true }
  )
}
