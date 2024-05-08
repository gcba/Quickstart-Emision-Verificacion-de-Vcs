import IonPublicKeyModel from './ModenaPublicKeyModel';

export default interface ModenaAddPublicKeysActionModel {
    action: string;
    publicKeys: IonPublicKeyModel[];
}
