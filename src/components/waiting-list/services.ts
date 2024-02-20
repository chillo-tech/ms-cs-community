import {  search } from '@services/queries';

const whereToAddCandidate = async (email: string) => {
  const resultState = {
    candidate: false,
    contactBackOffice: false,
    contactContactOffice: false,
  };
  const resultData: {
    candidate: object;
    contactBackOffice: object;
    contactContactOffice: object;
  } = {
    candidate: {},
    contactBackOffice: {},
    contactContactOffice: {},
  };
  const candidateFromBackofficeResponse = await search(
    `/api/backoffice/candidate?filter[email][_eq]=${email}`
  );
  const candidateFromContactResponse = await search(
    `/api/backoffice/contact?filter[email][_eq]=${email}`
  );

  const candidateFromContact2Response = await search(
    `/api/contact/contact/filter[email][_eq]=${email}`
  );

  const candidateFromBackoffice = candidateFromBackofficeResponse.data.data[0];
  const candidateFromContact = candidateFromContactResponse.data.data[0];
  const candidateFromContact2 = candidateFromContact2Response.data.data[0];

  if (candidateFromBackoffice) {
    resultState.candidate = true;
    resultData.candidate = candidateFromBackoffice;
  }

  if (candidateFromContact) {
    resultState.contactBackOffice = true;
    resultData.contactBackOffice = candidateFromContact;
  }

  if (candidateFromContact2) {
    resultState.contactContactOffice = true;
    resultData.contactContactOffice = candidateFromContact2;
  }

  const result: [
    {
      candidate: boolean;
      contactBackOffice: boolean;
      contactContactOffice: boolean;
    },
    {
      candidate: object;
      contactBackOffice: object;
      contactContactOffice: object;
    }
  ] = [resultState, resultData];
  return result;
};

const waitingListService = { whereToAddCandidate };

export { waitingListService };
