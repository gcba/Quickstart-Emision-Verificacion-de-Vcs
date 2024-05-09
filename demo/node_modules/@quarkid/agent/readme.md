# Extrimian Agent

El agente de extrimian resuelve problemas básicos de identidad autosoberana.

Permite crear DIDs, configurar servicios como el DWN, configurar protocolos para la transferencia de credenciales (WACI) y automatizar flujos. A través de eventos, permite identificar el momento en que se recibe una credencial y el momento en que se presenta (informando además el resultado de la presentación).

## Ejemplos de uso del componente

### 1. Instanciar el Agente
En primer lugar se debe configurar los protocolos de intercambio de credenciales (por ejemplo WACI). Esta configuración permite definir que credenciales emitirá este agente y que credenciales presentará al momento en que se lo soliciten.

```
//El agente necesita preconfigurar protocolos de intercambio de credenciales. En este instante se debe configurar también las credenciales que emitirá este agente.
//Si el agente no va a recibir a emitir credenciales, no espera verificarlas ni recibirlas, no es necesario configurar el WACIProtocol. En ese caso se envía un objeto vacía en el constructor. Este escenario no suele ser útil, sin embargo, puede servir para probar el agente rápidamente.
const waciProtocol = new WACIProtocol({});
```

Si se está instanciando un agente que genera credenciales, es necesario configurar el waciProtocol. Un ejemplo de configuración podría ser el siguiente
```
waciProtocol = new WACIProtocol({
        issuer: {
            issueCredentials: async (waciInvitationId: string, holderId: string) => {
                return new WACICredentialOfferSucceded({
                    credentials: [{
                        credential: {
                            "@context": [
                                "https://www.w3.org/2018/credentials/v1",
                                "https://www.w3.org/2018/credentials/examples/v1",
                                "https://w3id.org/security/bbs/v1"
                            ],
                            id: "http://example.edu/credentials/58473",
                            type: [
                                "VerifiableCredential",
                                "AlumniCredential"
                            ],
                            issuer: issuerDID,
                            issuanceDate: new Date(),
                            credentialSubject: {
                                id: holderId,
                                givenName: "Jhon",
                                familyName: "Does"
                            }
                        },
                        outputDescriptor: {
                            id: "alumni_credential_output",
                            schema: "https://schema.org/EducationalOccupationalCredential",
                            display: {
                                title: {
                                    path: [
                                        "$.name",
                                        "$.vc.name"
                                    ],
                                    fallback: "Alumni Credential"
                                },
                                subtitle: {
                                    path: [
                                        "$.class",
                                        "$.vc.class"
                                    ],
                                    fallback: "Alumni"
                                },
                                description: {
                                    "text": "Credencial que permite validar que es alumno del establecimiento"
                                },
                            },
                            styles: {                                
                                background: {
                                    color: "#ff0000"
                                },
                                thumbnail: {
                                    uri: "https://dol.wa.com/logo.png",
                                    alt: "Universidad Nacional"
                                },
                                hero: {
                                    uri: "https://dol.wa.com/alumnos.png",
                                    alt: "Alumnos de la universidad"
                                },
                                text: {
                                    color: "#d4d400"
                                }
                            }
                        }
                    }],
                    issuer: {
                        name: "Universidad Nacional",
                        styles: {
                            thumbnail: {
                                uri: "https://dol.wa.com/logo.png",
                                alt: "Universidad Nacional"
                            },
                            hero: {
                                uri: "https://dol.wa.com/alumnos.png",
                                alt: "Alumnos de la universidad"
                            },
                            background: {
                                color: "#ff0000"
                            },
                            text: {
                                color: "#d4d400"
                            }
                        }
                    },
                    options: {
                        challenge: "508adef4-b8e0-4edf-a53d-a260371c1423",
                        domain: "9rf25a28rs96"
                    },
                });
            }
        },
    });
```

Si deseas verificar credenciales, deberás configurar el waciProtocol para ese fin y restringir las credenciales que pueden presentarte como verifier.

```
verifier: {
    presentationDefinition: async (invitationId: string) => {
        return {
            frame: {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://www.w3.org/2018/credentials/examples/v1",
                    "https://w3id.org/security/bbs/v1"
                ],
                "type": [
                    "VerifiableCredential",
                    "AlumniCredential"
                ],
                "credentialSubject": {
                    "@explicit": true,
                    "type": [
                        "AlumniCredential"
                    ],
                    "givenName": {},
                    "familyName": {}
                }
            },
            inputDescriptors: [
                {
                    id: "Alumni Credential",
                    name: "AlumniCredential",
                    constraints: {
                        fields: [
                            {
                                path: [
                                    "$.credentialSubject.givenName"
                                ],
                                filter: {
                                    type: "string"
                                }
                            },
                            {
                                path: [
                                    "$.credentialSubject.familyName"
                                ],
                                filter: {
                                    type: "string"
                                }
                            }
                        ]
                    }
                }
            ],
        }
    }
}
```

Para configurar el comportamiento del holder, opcionalmente puedes configurar el waciProtocol. Como holder, debes seleccionar cual de las credenciales que te están solicitando en el flujo vas a querer presentar. Por defecto, si no configuras este comportamiento, el agente enviará la primera que aplica (ya que puede aplicar más de una a las restricciones aplicadas por el verifier).

```
const holderWaciProtocol = new WACIProtocol({
    holder: {
        selectVcToPresent: async (vcs: VerifiableCredential[]) => {
            return vcs;
        }
    },
});
```

El agente requiere que se definan comportamientos de storages. Quien implemente el agente debe decidir de que manera se van a guardar los datos. Para eso debe implementar la interfaz IAgentStorage y IAgentSecureStorage. A continuacion se deja un ejemplo que implementa los storages en filesystem. Este codigo es a modo de ejemplo y sirve para pruebas de desarrollo. En produccion es recomendable realizar una implementacion del AgentSecureStorage que guarde datos en una Vault. Estos storages deben pasarse a continuacion en el constructor del agent obligatoriamente.

```
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { IAgentStorage } from '@extrimian/agent';

export class FileSystemStorage implements IAgentStorage {
    public readonly filepath: string;

    constructor(params: {
        filepath: string
    }) {
        this.filepath = params.filepath;
    }

    async update<T>(key: string, value: T): Promise<void> {
        const map = this.getData();
        map.set(key, value as T);
        this.saveData(map);
    }

    async getAll<T>(): Promise<Map<string, any>> {
        return this.getData();
    }

    async remove(key: string): Promise<void> {
        const map = this.getData();
        map.delete(key);
        this.saveData(map);
    }

    async add(key: string, data: any): Promise<void> {
        const map = this.getData();
        map.set(key, data);
        this.saveData(map);
    }

    async get(key: string): Promise<any> {
        return this.getData().get(key);
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

```
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { AgentSecureStorage } from '@extrimian/agent';

export class FileSystemAgentSecureStorage implements AgentSecureStorage {
    public readonly filepath: string;


    constructor(params: {
        filepath: string
    }) {
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

Una vez configurado el WACIProtocol que define el comportamiento del agente respecto a las credenciales, debes instanciar el Agente en si mismo:
```
//Crear una nueva instancia del agente, se deben pasar los protocolos a usar para la generación de VC (por ejemplo el WACIProtocol que definimos anteriormente)
agent = new Agent({
    didDocumentRegistry: new AgentModenaUniversalRegistry("http://modena.gcba-extrimian.com:8080"),
    didDocumentResolver: new AgentModenaUniversalResolver("http://modena.gcba-extrimian.com:8080"),
    vcProtocols: [waciProtocol],
});
```

Respecto al registry y al resolver, debes definir nodos de modena o proxies que te permitan llegar a un Universal Modena Resolver o a un Universal Modena Registry.

```
//Siempre, en primer lugar, se debe inicializar el agente para comenzar a operar. Esto configura clases internas que son requeridas para funcionar.
await agent.initialize();
```


Para crear un nuevo DID, puedes invocar la siguiente función:
```
const did = await agent.identity.createNewDID({
    dwnUrl: dwnUrl
});
```
En este momento podrás definir algunos servicios y configuraciones claves, como la url de tu DWN.

El proceso de creación de un DID es asyncrónico, es por eso que el agente te avisará cuando el DID haya sido creado a través del siguiente evento:
```
agent.identity.didCreated.on(async args => {
    console.log(args.did);
});
```

Una vez que el DID haya sido creado, podrás operar con el agente.

### 2. (ISSUER) Crear invitación para la generación de credenciales
Como Issuer, puedes generar un mensaje que funcionará como invitación para iniciar el flujo de generación de credenciales para un holder.

Para eso puedes invocar el siguiente código: 

````
const invitationMessage = await issuerAgent.vc.createInvitationMessage({ flow: CredentialFlow.Issuance })
````

Este mensaje puede ser convertido en un código QR y procesado posteriormente por el Agent del holder que iniciará el flujo de WACI para el intercambio de credenciales.

Para procesar este primer mensaje de invitación con el agente de extrimian, el holder puede llamar al método processMessage, que iniciará el flujo que se continuará de forma automática.

### 3. (HOLDER) Procesar mensaje de invitación para la generación de credenciales.

```
holderAgent.vc.processMessage({
    message: invitationMessage
});
```

Por otro lado, el holder debe configurar el evento para saber cuando se le generó una credencial.

```
holderAgent.vc.credentialArrived.on((vc) => {
    holderAgent.vc.saveCredential(vc);
});
```

La generación de una credencial no implica necesariamente que el holder deba guardarla, es por eso que dentro de ese evento, el holder puede invocar al método saveCredential para persistir la VC entre sus credenciales.

### 4. (VERIFIER) Crear invitación para la verificación de credenciales
Así como el Issuer genera el mensaje de invitación para la emisión, el verifier debe crear el flujo para la presentación de credenciales…

```
const presentationMessage = verifierAgent.vc.createInvitationMessage({ flow: CredentialFlow.Presentation }),
```

De la misma manera que podría hacer el issuer, el mensaje de invitación de presentación puede ser convertido a un código QR para que el holder pueda escanearlo y comenzar el flujo de presentación enviando a procesar el mensaje.

El verifier sabrá cuando finalizó el flujo de presentación a través de un evento que le devolverá la credencial presentada y el resultado de flujo (válido o inválido), tanto para las validaciones de presentación como de la credencial en si misma.:
```
issuerAgent.vc.credentialPresented.on((args) => {
    expect(args.vcVerified).toBe(true);
    expect(args.presentationVerified).toBe(true); 
    console.log(args.vc);    
});
```
