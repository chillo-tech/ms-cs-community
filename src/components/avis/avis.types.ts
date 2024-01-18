export type AvisType = {
  subject: string;
  email: string;
  message: string;
  note: string;
};

export type AvisFrontViewType = {
  name: string;
  title: string;
  description: string;
};

export type AvisFrontViewUpdateType = {
  name?: string;
  title?: string;
  description?: string;
};
