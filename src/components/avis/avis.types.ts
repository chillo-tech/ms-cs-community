import { FIELDS_TYPES } from '@constants/avis';

export type AvisType = {
  subject: string;
  email: string;
  message: string;
  impression: string;
};

export type AvisFrontViewType = {
  name: string;
  left: {
    title: string;
    desc: string;
  };
  right: {
    title: string;
    desc: string;
    bottom: string;
    fields: {
      name: string;
      fieldType: {
        type: string;
        enum: (typeof FIELDS_TYPES)[number];
      };
      label: string;
      placeholder: string;
      choices: string[];
    }[];
  };
};
