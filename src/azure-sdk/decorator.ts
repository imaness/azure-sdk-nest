import { Inject } from '@nestjs/common';
import { ClassDefinition } from './type';
import { AZURE_SDK_MODULE } from './constants';

export const InjectAzure = <C extends ClassDefinition>(client: C, key = '') => {
  const providerToken = `${AZURE_SDK_MODULE}#${client.name}#${key}`;

  return Inject(providerToken);
};
