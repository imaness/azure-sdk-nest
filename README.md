# Azure SDK NestJS

Azure SDK Javascript dynamic module for NestJS

[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![Npm package version](https://badgen.net/npm/v/@imaness/azure-sdk-nest)](https://badgen.net/npm/v/@imaness/azure-sdk-nest)

## Quick Start

Let's build a Azure Storage Blob client and inject it into the nest app.

```
npm install @imaness/azure-sdk-nest @azure/storage-blob
```

1. Register the module with a Blob Storage container client, in `app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureSdkModule } from '@imaness/azure-sdk-nest';
import { BlobServiceClient  } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

@Module({
  imports: [
    // register Blob Service client
    AzureSdkModule.register({
      client: new ContainerClient(
        'https://myaccount.blob.core.windows.net/mycontainer', 
        new DefaultAzureCredential()
      ),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

2. use the Blob Storage Container client in `app.controller.ts`

```ts
import { ContainerClient } from '@azure/storage-blob';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectAzure } from '@imaness/azure-sdk-nest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // inject the client
    @InjectAzure(ContainerClient) private readonly containerClient: ContainerClient 
  ) {}

  @Get()
  async helloAzure(): Promise<any> {
    const content = "Hello world!";
    const blobName = "newblob" + new Date().getTime();
    const blockBlobClient = await this.containerClient.getBlockBlobClient('asdsad');
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    return uploadBlobResponse;
  }
}
```

3. done!

## Register a Client

Register a client in any module, you can use any client you want. As long as it's a [Azure SDK client](https://learn.microsoft.com/en-us/javascript/api/overview/azure/?view=azure-node-latest)

```ts
AzureSdkModule.register({
  client: new new ContainerClient(
    'https://myaccount.blob.core.windows.net/mycontainer', 
    new DefaultAzureCredential()
  ),
});
```


## Async Register

```ts
AzureSdkModule.registerAsync({
  clientType: ContainerClient,
  useFactory: async () => {
    const containerClient = new ContainerClient(
      'https://myaccount.blob.core.windows.net/mycontainer',
      new DefaultAzureCredential()
    );

    return containerClient;
  },
});
```

### Use `@InjectAzure(Client)`

Make sure the `Client` is the type you registered in module.
```ts
import { ContainerClient } from '@azure/storage-blob';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectAzure } from '@imaness/azure-sdk-nest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectAzure(ContainerClient) private readonly containerClient: ContainerClient 
  ) {}

  @Get()
  async helloAzure(): Promise<any> {
    const content = "Hello world!";
    const blobName = "newblob" + new Date().getTime();
    const blockBlobClient = await this.containerClient.getBlockBlobClient('asdsad');
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    return uploadBlobResponse;
  }
}
```


## Multiple Injection/Instances

Please use `key` attribute as the identifier for each `Client`

Example: 
1. register the Container Client with a unique `key `
```ts
AzureSdkModule.register({
  // register the Blob container client with key MYACCOUNT-MYCONTAINER-1`
  key: 'MYACCOUNT-MYCONTAINER-1',
  client: new new ContainerClient(
    'https://myaccount.blob.core.windows.net/mycontainer-1', 
    new DefaultAzureCredential()
  ),
}),
AzureSdkModule.register({
  // register the Blob container client with key MYACCOUNT-MYCONTAINER-2`
  key: 'MYACCOUNT-MYCONTAINER-2',
  client: new new ContainerClient(
    'https://myaccount.blob.core.windows.net/mycontainer-2', 
    new DefaultAzureCredential()
  ),
}),
```

2. refer the Blob Storage Container client use `@InjectAzure(Client, key)`
```ts
@InjectAzure(ContainerClient, 'MYACCOUNT-MYCONTAINER-1') private readonly containerClient1: ContainerClient,
@InjectAzure(ContainerClient, 'MYACCOUNT-MYCONTAINER-2') private readonly containerClient2: ContainerClient,
```

## Global Module

Set the option `isGlobal: true` to enable it

```ts
AzureSdkModule.register({
  isGlobal: true,
  client: new ContainerClient(
    'https://myaccount.blob.core.windows.net/mycontainer', 
    new DefaultAzureCredential()
  ),
});
```

### Credit

Contributor: [@imaness](https://github.com/imaness)

Inspired by: (https://github.com/deligenius/aws-sdk-v3-nest)
