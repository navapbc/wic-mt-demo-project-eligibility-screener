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

export function getMockClinicList() {
  return [
    {
      id: 0,
      agency: 'AGENCY ZERO',
      agencyAddress: '0000 St, Helena, MT 00000',
      agencyTelephone: '(000) 000-0000',
      clinic: 'CLINIC ZERO',
      clinicAddress: '0000 St, Helena, MT 00000',
      clinicTelephone: '(000) 000-0000',
      county: 'COUNTY ZERO',
      zip: '00000',
    },

    {
      id: 1,
      agency: 'AGENCY ONE',
      agencyAddress: '1111 St, Helena, MT 11111',
      agencyTelephone: '(111) 111-1111',
      clinic: 'CLINIC ONE',
      clinicAddress: '1111 St, Helena, MT 11111',
      clinicTelephone: '(111) 111-1111',
      county: 'COUNTY ONE',
      zip: '11111',
    },
    {
      id: 2,
      agency: 'AGENCY TWO',
      agencyAddress: '2222 St, Helena, MT 22222',
      agencyTelephone: '(222) 222-2222',
      clinic: 'CLINIC TWO',
      clinicAddress: '2222 St, Helena, MT 22222',
      clinicTelephone: '(222) 222-2222',
      county: 'COUNTY TWO',
      zip: '22222',
    },
    {
      id: 3,
      agency: 'AGENCY THREE',
      agencyAddress: '3333 St, Helena, MT 33333',
      agencyTelephone: '(333) 333-3333',
      clinic: 'CLINIC THREE',
      clinicAddress: '3333 St, Helena, MT 33333',
      clinicTelephone: '(333) 333-3333',
      county: 'COUNTY THREE',
      zip: '33333',
    },
    {
      id: 4,
      agency: 'AGENCY FOUR',
      agencyAddress: '4444 St, Helena, MT 44444',
      agencyTelephone: '(444) 444-4444',
      clinic: 'CLINIC FOUR',
      clinicAddress: '4444 St, Helena, MT 44444',
      clinicTelephone: '(444) 444-4444',
      county: 'COUNTY FOUR',
      zip: '44444',
    },
    {
      id: 5,
      agency: 'AGENCY FIVE',
      agencyAddress: '5555 St, Helena, MT 55555',
      agencyTelephone: '(555) 555-5555',
      clinic: 'CLINIC FIVE',
      clinicAddress: '5555 St, Helena, MT 55555',
      clinicTelephone: '(555) 555-5555',
      county: 'COUNTY FIVE',
      zip: '55555',
    },
    {
      id: 6,
      agency: 'AGENCY SIX',
      agencyAddress: '6666 St, Helena, MT 66666',
      agencyTelephone: '(666) 666-6666',
      clinic: 'CLINIC SIX',
      clinicAddress: '6666 St, Helena, MT 66666',
      clinicTelephone: '(666) 666-6666',
      county: 'COUNTY SIX',
      zip: '66666',
    },
    {
      id: 7,
      agency: 'AGENCY SEVEN',
      agencyAddress: '7777 St, Helena, MT 77777',
      agencyTelephone: '(777) 777-7777',
      clinic: 'CLINIC SEVEN',
      clinicAddress: '7777 St, Helena, MT 77777',
      clinicTelephone: '(777) 777-7777',
      county: 'COUNTY SEVEN',
      zip: '77777',
    },
    getMockClinic(),
  ]
}

export function setupClinicMocks() {
  // Mock the list of possible clinics
  jest.mock(
    '@public/clinic-output/clinics-with-ids.json',
    () => getMockClinicList(),
    { virtual: true }
  )

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
