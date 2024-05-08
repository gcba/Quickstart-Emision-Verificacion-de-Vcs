/**
 * DID Document key purpose.
 */
enum ModenaPublicKeyPurpose {
  Authentication = 'authentication',
  AssertionMethod = 'assertionMethod',
  CapabilityInvocation = 'capabilityInvocation',
  CapabilityDelegation = 'capabilityDelegation',
  KeyAgreement = 'keyAgreement'
}

export default ModenaPublicKeyPurpose;
