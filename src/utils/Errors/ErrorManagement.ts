
class ErrorManagement {
  CommonErrors = {
    notFound: (ressource?: string) => `${ressource ? ressource : 'La ressource demandee'} n'existe pas!`,
    unauthorized: (ressource?: string) =>
      `Vous n'etes pas authorise${ressource ? ` a ${ressource}` : ''}!`,
    badRequest: () => 'La requete est mal formee',
    forbidden: () => 'Acces refuse',
    conflict: () => 'Conflit detecte',
    invalidInput: (name: string, expectedType: string, input?: string) =>
      `Entre invalide sur ${name}, valeur recu ${input} --- valeur attendue ${expectedType}`,
  };
}

const staticErrorManagement = new ErrorManagement();

export { ErrorManagement, staticErrorManagement };
