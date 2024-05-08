## Quickstart

El objetivo de este Quickstart es registrar los pasos para realizar un proceso de emisión y verficiación de credenciales. 

## Emisión y Verificación (Formato código)
1. [Creación, publicación y resolución de DID](https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master?tab=readme-ov-file#instala-y-crea-tu-did).
2. [Creación de Credencial Verificable, de ahora en más VC](https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master?tab=readme-ov-file#creaci%C3%B3n-de-una-vc-credencial-verificable).
3. [Verificación de una VC](https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master?tab=readme-ov-file#verificaci%C3%B3n-de-una-vc).

## Emisión (Formato QR)
1. [Creación y lectura de código QR de Credencial de Prueba](https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master?tab=readme-ov-file#generaci%C3%B3n-de-credencial-de-pruebas-con-c%C3%B3digo-qr)
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

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Creación de una VC (Credencial Verificable)
El formato de una VC consiste en un Objecto de tipo JSON que contiene indentificadores y metadatos para describir las propiedades de la credencial, como su Emisor, período de validez, imagen representativa, una clave pública para usar con proposito de verificación, mecanismos de revocación, entre otras. Los metadatos pueden estar firmados por el emisor, por lo que su autenticidad podrá ser probada mediante una verificación criptográfica.
Las credenciales verificables y las presentaciones verificables DEBEN incluir una propiedad @context.

En el caso particular de QuarkID las URLs proporcionadas en esta sección, deben ser procesables como JSON-LD.


JSON-LD, que significa "JSON Linked Data" (Datos Enlazados en JSON), es una forma de representar datos estructurados utilizando la sintaxis de JSON mientras se incorporan conceptos de Datos Enlazados (Linked Data) para permitir la interoperabilidad semántica en la web.

## 1. Instala
```
npm install @quarkid/vc-core
```

## 2. Crea una credencial
Para crear tu primer credencial debes tener tu creado un DID y sus claves guardadas en el storage de KMS.
Con esa tarea realizada, usted puede avanzar. Cree un archivo credential.ts e importa la siguiente dependencia.

```
import { VerifiableCredentialService } from "@quarkid/vc-core";
```

## 3. Escribe el siguiente codigo y reemplaza lo que hay en ISSUER por tu DID:

```
const credential = async () => {
  const vcService = new VerifiableCredentialService();

  const credential = await vcService.createCredential({
    context: [
      "https://w3id.org/vaccination/v1",
      "https://w3id.org/security/v2",
      "https://w3id.org/security/bbs/v1",
    ],
    vcInfo: {
      issuer: "REEMPLAZA POR TU DID",
      expirationDate: new Date("2026/05/05"),
      id: "123456789",
      types: ["VaccinationCertificate"],
    },
    data: {
      type: "VaccinationEvent",
      batchNumber: "1183738569",
      administeringCentre: "MoH",
      healthProfessional: "MoH",
      countryOfVaccination: "NZ",
      recipient: {
        type: "VaccineRecipient",
        givenName: "JOHN",
        familyName: "SMITH",
        gender: "Male",
        birthDate: "1958-07-17",
      },
      vaccine: {
        type: "Vaccine",
        disease: "COVID-19",
        atcCode: "J07BX03",
        medicinalProductName: "COVID-19 Vaccine Moderna",
        marketingAuthorizationHolder: "Moderna Biotech",
      },
    },
    mappingRules: null,
  });

  console.log("Credential", credential);
};
```

Continúa con el siguiente paso antes de ejecutar tu código.

### 4. Firma tu credencial
Para poder firmar tu credencial debes intanciar el KMS para requerir las claves con las que firmarás tu credencial.

Importa las siguientes dependencias en el archivo credential.ts.

```
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
import { AssertionMethodPurpose } from "@quarkid/did-core";
import { FileSystemKMSSecureStorage } from "./storage";
```

Agrega el siguiente código a la función credential a continuación de lo escrito.
```
const kms = new KMSClient({
  lang: LANG.es,
  storage: new FileSystemKMSSecureStorage({
    filepath: "file-system-storage",
  }),
});

const bbsbls2020 = await kms.getPublicKeysBySuiteType(Suite.Bbsbls2020);
```

Usamos el algoritmo de claves bbsbls2020 para firmar una credencial ya que nos permite el uso de selective disclousure y zero knowlegde proof.

El kms provee un methodo signVC que nos permite firmar una credencial.

Agrega el siguiente código a la función credential, a continuación de lo escrito anteriormente, pero reemplaza el string "TU DID" con el did que creaste en los pasos enteriores.

```
const vc = await kms.signVC(
  Suite.Bbsbls2020,
  bbsbls2020[0],
  credential,
  "TU DID",
  "TU DID" + "#bbsbls",
  new AssertionMethodPurpose()
);
console.log("Verifiable Credential Signed", vc);
```

### 5. Prueba tu código
Para probar tu codigo deberás llamar a la funcion credential.
```
credential();
```

Si seguiste bien los pasos deberías tener un archivo credential.ts como el siguiente:
```
import { VerifiableCredentialService } from "@quarkid/vc-core";
import { KMSClient } from "@quarkid/kms-client";
import { LANG, Suite } from "@quarkid/kms-core";
import { AssertionMethodPurpose } from "@quarkid/did-core";
import { FileSystemKMSSecureStorage } from "./storage";

const credential = async () => {
  const vcService = new VerifiableCredentialService();

  const credential = await vcService.createCredential({
    context: [
      "https://w3id.org/vaccination/v1",
      "https://w3id.org/security/v2",
      "https://w3id.org/security/bbs/v1",
    ],
    vcInfo: {
      issuer: "did:quarkid:EiBA3ihJrI5fSsdpZWd3H_-0Wr4rEL8muoDOsuDQDhe2FQ",
      expirationDate: new Date("2026/05/05"),
      id: "123456789",
      types: ["VaccinationCertificate"],
    },
    data: {
      type: "VaccinationEvent",
      batchNumber: "1183738569",
      administeringCentre: "MoH",
      healthProfessional: "MoH",
      countryOfVaccination: "NZ",
      recipient: {
        type: "VaccineRecipient",
        givenName: "JOHN",
        familyName: "SMITH",
        gender: "Male",
        birthDate: "1958-07-17",
      },
      vaccine: {
        type: "Vaccine",
        disease: "COVID-19",
        atcCode: "J07BX03",
        medicinalProductName: "COVID-19 Vaccine Moderna",
        marketingAuthorizationHolder: "Moderna Biotech",
      },
    },
    mappingRules: null,
  });

  console.log("Credential", credential);

  const kms = new KMSClient({
    lang: LANG.es,
    storage: new FileSystemKMSSecureStorage({
      filepath: "file-system-storage",
    }),
  });

  const bbsbls2020 = await kms.getPublicKeysBySuiteType(Suite.Bbsbls2020);

  const vc = await kms.signVC(
    Suite.Bbsbls2020,
    bbsbls2020[0],
    credential,
    "did:quarkid:EiBA3ihJrI5fSsdpZWd3H_-0Wr4rEL8muoDOsuDQDhe2FQ",
    "did:quarkid:EiBA3ihJrI5fSsdpZWd3H_-0Wr4rEL8muoDOsuDQDhe2FQ" + "#bbsbls",
    new AssertionMethodPurpose()
  );
  console.log("Verifiable Credential Signed", vc);
};
credential();
```
> [!NOTE]
> Recuerda que siempre debes probar con el DID creado en la seccion Creacion de un DID, esto es porque para firmar la credencial busca las claves guardadas en el storage que creaste.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
El próximo paso es ejecutar la funcion credential, para ello abre una terminal y usa ts-node ó npx para ejecutar tu código.
```
ts-node credential.ts
npx ts-node credential.ts
```

En tu terminal verás el resultado de los console.log que tienes en tu código, es decir, verás una credencial creada y luego la misma credencial pero firmada.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
### Verificación de una VC

### 1. Instala el siguiente paquete NPMJs:

```
npm install @quarkid/vc-verifier @quarkid/did-resolver
```

### 2. Verifica

Para verificar la credencial usaremos el servicio VcVerifierService. A este servicio necesitamos pasarle un callback para resolver el DID que sera la misma funcion utilizada en la sección Resuelve.

En la funcion credential que creaste en el paso anterior agrega el siguiente codigo:
```
import { VCVerifierService } from "@quarkid/vc-verifier";
import { DIDUniversalResolver } from "@quarkid/did-resolver";
```
```
const QuarkIDEndpoint = "https://node-ssi.buenosaires.gob.ar";

const service = new VCVerifierService({
  didDocumentResolver: async (did: string) => {
    const universalResolver = new DIDUniversalResolver({
      universalResolverURL: QuarkIDEndpoint,
    });

    const didDocument = await universalResolver.resolveDID(did);

    return didDocument;
  },
});
const result = await service.verify(vc, new AssertionMethodPurpose());
console.log("result", result);

```
Resolvemos el Did Document y llamamos a la funcion verificadora, la cual recibe la credencial y el proposito, que en este caso es Assertion Method que es aquel que se usa para el caso de verificacion de credenciales.

La variable result devuelve true si verifica correctamente, o false con un resultado de error si falló la verificacion.

### 3. Prueba
```
ts-node credential.ts
```

o
```
npx ts-node credential.ts
```

------------------------------------------------------------------------------------------------------------

## Generación de Credencial de pruebas con código QR

1. Clonar el archivo (Demo)[https://github.com/gcba/Quickstart-Emision-Verificacion-de-Vcs/tree/master/demo]

2. Eliminar de la solucion los archivos:

* issuer-secure-storage-ws.json
* issuer-storage-ws.json
* waci-protocol-ws.json

Ya que se va a generar un nuevo DID, se volverán a generar automaticamente al ejecutar el proyecto.

### Pre-requisitos: 
Se requiere tener instalado ngrok para ello ejecutar npm i ngrok -g en una nueva Terminal, 
diferente a la que se va a usar para ejecutar el proyecto.

Se debe descargar la wallet QuarkID en un dispositivo mobile [iOS](https://apps.apple.com/ar/app/quarkid/id6450680088) o [Android](https://play.google.com/store/apps/details?id=com.quarkid). 

### Pasos

1. En la consola en la cual esta ejecutando ngrok, se debe ejecutar lo siguiente:

```
ngrok http 3010
```

2. Se verá en la consola:

```
Full request capture now available in your browser: https://ngrok.com/r/ti

Session Status                online
Account                       X@gmail.com (Plan: Free)
Version                       3.9.0
Region                        South America (sa)
Latency                       33ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://248c-161-22-25-244.ngrok-free.app -> http://localhost:3010
Connections                   ttl     opn     rt1     rt5     p50     p90
```

3. Copiar la url que se visualiza en "Forwarding" en este ejemplo es "https://248c-161-22-25-244.ngrok-free.app"
y pegarla en el archivo "app.module.ts" en la linea 47 donde dice "serviceEndpoint"


4. Guardar los cambios

5. Ejecutar en otra consola que no sea la que se utilizó para ngrok:

```
yarn
```
para descargar las dependencias.

6. Luego ejecutar un:

```
yarn start
```

Se puede navegar la url http://localhost:3010/invitation-message y se visualizará:

```
{"invitationId":"135204a7-91d2-4ff2-9352-9cc6d4f91272","invitationContent":"didcomm://?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiMTM1MjA0YTctOTFkMi00ZmYyLTkzNTItOWNjNmQ0ZjkxMjcyIiwiZnJvbSI6ImRpZDpxdWFya2lkOkVpQ25pekFscVNWOXEzUHFEbGZUTVpzcV9LRUQ1Qm50OG1nelJIYmlsMEc4RmciLCJib2R5Ijp7ImdvYWxfY29kZSI6InN0cmVhbWxpbmVkLXZjIiwiYWNjZXB0IjpbImRpZGNvbW0vdjIiXX19"}
```

- El contenido de "invitationContent" (lo que esta dentro de las comillas despues de los ":")
- Es el codigo que se utiliza para dibujar el QR
- Ese codigo se puede pegar en cualquier web de generacion de QR, sugerimos (QR Code Generator)[https://www.the-qrcode-generator.com/]

7. Seleccionar la opcion Texto Plano, pegar el contenido y se dibuja el QR para poder escanearlo con la wallet de Quarkid de Producción, disponible en los Stores de los Sistemas Operativos. 















