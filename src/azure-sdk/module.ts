import { ClassDefinition, ClassConstructorReturnType } from './type';
import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { AZURE_SDK_MODULE } from './constants';

interface RegisterOptions<C extends ClassDefinition> {
  isGlobal?: boolean;
  key?: string;
  client: ClassConstructorReturnType<C>;
}

interface RegisterAsyncOptions<C extends ClassDefinition>
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  key?: string;
  clientType: C;
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => ClassConstructorReturnType<C> | Promise<ClassConstructorReturnType<C>>;
}

@Module({})
export class AzureSdkModule {
  static register<C extends ClassDefinition>(
    options: RegisterOptions<C>,
  ): DynamicModule {
    const { client, key = '', isGlobal = false } = options;

    const className = client.__proto__.constructor.name as string;
    const providerToken = `${AZURE_SDK_MODULE}#${className}#${key}`;

    const ClientProvider: Provider = {
      provide: providerToken,
      useValue: client,
    };

    return {
      module: AzureSdkModule,
      providers: [ClientProvider],
      exports: [ClientProvider],
      global: isGlobal,
    };
  }

  static async registerAsync<C extends ClassDefinition>(
    options: RegisterAsyncOptions<C>,
  ): Promise<DynamicModule> {
    const {
      useFactory,
      imports = [],
      inject = [],
      isGlobal,
      key = '',
      clientType,
    } = options;

    const className = clientType.name;
    const providerToken = `${AZURE_SDK_MODULE}#${className}#${key}`;

    const ClientProvider: Provider = {
      inject,
      provide: providerToken,
      useFactory,
    };

    return {
      imports,
      module: AzureSdkModule,
      providers: [ClientProvider],
      exports: [ClientProvider],
      global: isGlobal,
    };
  }
}
