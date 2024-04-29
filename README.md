## Quickstart

El objetivo de este Quickstart es registrar los pasos para realizar un proceso de emisión y verficiación de credenciales. 

## 
1. [Creación, publicación y resolución de DID](https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master?tab=readme-ov-file#instala-y-crea-tu-did).
2. [Creación de Credencial Verificable, de ahora en más VC]
3. [Verificación de una VC]
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Instala y crea tu DID
_Pre requisitos_

Debes tener instalado:
```
NODEJS
NPM
TYPESCRIPT
TS-NODE
```
### 1. Crea un directorio
```
mkdir quarkid-app
``````
```
cd quarkid-app
```

### 2. Instala paquetes NPMJs
```
npm init
```

```
npm install @quarkid/did-registry @quarkid/did-core @quarkid/kms-client @quarkid/kms-core
```

### 3. Crea las claves

Para crear un DID necesitas proveer tus claves publicas. Puedes usar el componente KMS para generar tus claves publicas y privadas.

*Key Management Service*: KMS Storage y KMS Keys

## KMS Storage

KMS aplica conceptos de inversión de dependencias por lo que requiere enviar un SecureStorage en su constructor. En esta oportunidad usaremos FileSystem para guardar los datos y podes acceder a ellos de una manera sencilla.

### 1. Crea un archivo storage.ts con el siguiente codigo


```
import { readFileSync, writeFileSync, existsSync } from "fs";
import { KMSStorage } from "@quarkid/kms-core";

export class FileSystemKMSSecureStorage implements KMSStorage {
  public readonly filepath: string;

  constructor(params: { filepath: string }) {
    this.filepath = params.filepath;
  }

  async add(key: string, data: any): Promise<void> {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  async get(key: string): Promise<any> {
    return this.getData().get(key);
  }

  async getAll(): Promise<Map<string, any>> {
    return this.getData();
  }

  update(key: string, data: any) {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  remove(key: string) {
    const map = this.getData();
    map.delete(key);
    this.saveData(map);
  }

  private getData(): Map<string, any> {
    if (!existsSync(this.filepath)) {
      return new Map();
    }

    const file = readFileSync(this.filepath, {
      encoding: "utf-8",
    });

    if (!file) {
      return new Map();
    }

    return new Map(Object.entries(JSON.parse(file)));
  }

  private saveData(data: Map<string, any>) {
    writeFileSync(this.filepath, JSON.stringify(Object.fromEntries(data)), {
      encoding: "utf-8",
    });
  }
}
```

## KMS Keys
  
### 1. Crea un archivo did.ts.


### 2. Importa la siguientes dependecias:

```
import { FileSystemKMSSecureStorage } from "./storage";
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
```

### 3. Crea una funcion que se llame createDID como se muestra a continuación:
Crea las claves _recoveryKey, updateKey, bbsBlsJwk y didCommJwk_.

```
export const createDID = async () => {
  const kms = new KMSClient({
    lang: LANG.en,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage",
    }),
  });

  const updateKey = await kms.create(Suite.ES256k);
  const recoveryKey = await kms.create(Suite.ES256k);

  const didComm = await kms.create(Suite.DIDComm);
  const bbsbls = await kms.create(Suite.Bbsbls2020);
};
```

> [!TIP]
> Para obtener más información sobre KMS, consulte [documentación disponible](https://www.npmjs.com/package/@quarkid/kms-client).

---------------------------------------------------------------------------------------------------------

### 4. Crea un long DID
Una vez generadas las  generar tus claves publicas y privadas, el siguiente paso es crear un LONG DID.

Con el servicio de creacion de un did podes crear un LONG DID, este es un DID en el que su DID Document se encuentra embebido en la información que devuelve en un formato base64. Es un DID autoresoluble, es decir, desencondeando el base64 se puede obtener su DID Document.

En el archivo did.ts importa las dependecias y agrega el código que se muestra a continuación.
```
import { ModenaUniversalRegistry } from "@quarkid/did-registry";
import { AssertionMethodPurpose, KeyAgreementPurpose } from "@quarkid/did-core";
```

```
export const createDID = async () => {
  const kms = new KMSClient({
    lang: LANG.en,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage",
    }),
  });

  const updateKey = await kms.create(Suite.ES256k);
  const recoveryKey = await kms.create(Suite.ES256k);

  const didComm = await kms.create(Suite.DIDComm);
  const bbsbls = await kms.create(Suite.Bbsbls2020);

  const registry = new ModenaUniversalRegistry();

  const createDidResponse = await registry.createDID({
    updateKeys: [updateKey.publicKeyJWK],
    recoveryKeys: [recoveryKey.publicKeyJWK],
    verificationMethods: [
      {
        id: "bbsbls",
        type: "Bls12381G1Key2020",
        publicKeyJwk: bbsbls.publicKeyJWK,
        purpose: [new AssertionMethodPurpose()],
      },
      {
        id: "didComm",
        type: "X25519KeyAgreementKey2019",
        publicKeyJwk: didComm.publicKeyJWK,
        purpose: [new KeyAgreementPurpose()],
      },
    ],
  });
  console.log(JSON.stringify(createDidResponse.longDid));
};
```
Continua con el siguiente paso antes de ejecutar tu código:
### 5. Publicación de DID 
Publica tu did en blockchain. Para ello se requiere una URL de la API de QuarkID, que representa un nodo de QuarkID que se ejecuta como un servicio.
Podes [proporcionar tu propio nodo](https://github.com/gcba/Nodo-QuickStart/tree/master) o utilizar el siguiente: 

### Nodo:
```
export const QuarkIDEndpoint = "https://node-ssi.buenosaires.gob.ar";
```

### 6. Escribe el siguiente código dentro de la funcion createDID para publicar.
```
const result = await registry.publishDID({
  universalResolverURL: QuarkIDEndpoint,
  didMethod: "did:quarkid",
  createDIDResponse: createDidResponse,
});

console.log("result", result);
```

La constante result te devolverá un canonicalId, un short did y un long did que te permitirá luego resolverlo y obtener el Did Document.

Continúa con el siguiente paso antes de ejecutar tu código.

### 7. Resuelve
Para resolver tu did instala el siguiente paquete:
```
npm install @quarkid/did-resolver
```

Dentro del archivo did.ts importa la siguiente dependencia:
```
import { DIDUniversalResolver } from "@quarkid/did-resolver";
import { DIDDocument } from "@quarkid/did-core";
```

Escribe la siguiente funcion antes de la funcion createDID.

```
export const resolveDid = (did: string) =>
  new Promise<DIDDocument>((resolve, reject) => {
    setTimeout(async () => {
      const universalResolver = new DIDUniversalResolver({
        universalResolverURL: QuarkIDEndpoint,
      });

      const didDocument = await universalResolver.resolveDID(did);
      console.log(didDocument);

      return didDocument;
    }, 65000);
  });
```

Agrega a la funcion createDID el siguiente codigo:
```
const didDocument = await resolveDid(result.did);
console.log("Did Document", didDocument);
```
### 8. Prueba tu DID
Para probar tu codigo deberás llamar a la funcion createDid.
```
createDid();
```

Si se siguieron los pasos correctamente, deberas tener un archivo did.ts como el siguiente:
```
import { FileSystemKMSSecureStorage } from "./storage";
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
import { ModenaUniversalRegistry } from "@quarkid/did-registry";
import { AssertionMethodPurpose, KeyAgreementPurpose } from "@quarkid/did-core";
import { DIDUniversalResolver } from "@quarkid/did-resolver";
import { DIDDocument } from "@extrimian/did-core";

export const QuarkIDEndpoint = "https://node-ssi.buenosaires.gob.ar";

export const resolveDid = (did: string) =>
  new Promise<DIDDocument>((resolve, reject) => {
    setTimeout(async () => {
      const universalResolver = new DIDUniversalResolver({
        universalResolverURL: QuarkIDEndpoint,
      });

      const didDocument = await universalResolver.resolveDID(did);

      return didDocument;
    }, 65000);
  });

export const createDID = async () => {
  const kms = new KMSClient({
    lang: LANG.en,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage",
    }),
  });

  const updateKey = await kms.create(Suite.ES256k);
  const recoveryKey = await kms.create(Suite.ES256k);

  const didComm = await kms.create(Suite.DIDComm);
  const bbsbls = await kms.create(Suite.Bbsbls2020);

  const registry = new ModenaUniversalRegistry();

  const createDidResponse = await registry.createDID({
    updateKeys: [updateKey.publicKeyJWK],
    recoveryKeys: [recoveryKey.publicKeyJWK],
    verificationMethods: [
      {
        id: "bbsbls",
        type: "Bls12381G1Key2020",
        publicKeyJwk: bbsbls.publicKeyJWK,
        purpose: [new AssertionMethodPurpose()],
      },
      {
        id: "didComm",
        type: "X25519KeyAgreementKey2019",
        publicKeyJwk: didComm.publicKeyJWK,
        purpose: [new KeyAgreementPurpose()],
      },
    ],
  });

  console.log(JSON.stringify(createDidResponse.longDid));

  const result = await registry.publishDID({
    universalResolverURL: QuarkIDEndpoint,
    didMethod: "did:quarkid",
    createDIDResponse: createDidResponse,
  });

  console.log("result", result);
  const didDocument = await resolveDid(result.did);
  console.log("Did Document", didDocument);
};

createDID();
```
El próximo paso es ejecutar la funcion createDID, para ello abre una terminal y usa ts-node ó npx para ejecutar tu código.

```
ts-node did.ts
```

```
npx ts-node did.ts
```

> [!NOTE]
> En tu terminal podrás observar el resultado de los console.log que estan en tu código. La resolución del Did Document demora unos segundos en impactar, esto se debe a que se esta publicando el did en la blockchain y este proceso puede demorar.

Creación de Credencial Verificable, de ahora en más VC
