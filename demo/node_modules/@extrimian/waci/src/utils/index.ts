import * as UUID from 'uuid';
import * as jsonpath from 'jsonpath';
import * as jsonschema from 'jsonschema';
import {
  CredentialApplication,
  CredentialPresentation,
  PresentationDefinition,
  WACIMessage,
} from '../types';
import { Callback } from '../callbacks';
import { InputDescriptorError } from './erros';

export const getObjectValues = (object: any): string[] =>
  Object.values<string>(object);

export const createUUID = UUID.v4;

export const verifyPresentation = async (
  presentationDefinition: PresentationDefinition,
  credentialApplication: CredentialApplication | CredentialPresentation,
  verificationCallback: Callback<any, { result: boolean, error?: string[] }>,
): Promise<any> => {
  try {
    const vcs: any[] = [];
    for await (const inputDescriptor of presentationDefinition.input_descriptors) {

      const vcInput =
        credentialApplication.data.json.presentation_submission.descriptor_map.find(
          (descriptor) => inputDescriptor.id === descriptor.id,
        );

      if (!vcInput) return new InputDescriptorError();
      const vc = jsonpath.query(
        credentialApplication.data.json,
        vcInput.path,
      )[0];

      vcs.push(vc);

      // Verify fields
      // TODO - use jsonschema instead
      for (const field of inputDescriptor.constraints.fields) {
        const fieldValue = jsonpath.query(vc, field.path[0])?.[0];
        if (!fieldValue) new InputDescriptorError();
        if (field.filter) {
          const { errors } = jsonschema.validate(fieldValue, field.filter);
          if (errors.length) new InputDescriptorError();
        }
      }

      // Verify proof
      await verificationCallback(vc);
    }

    return {
      result: true,
      vcs
    };
  } catch (error) {
    console.error(error);
    return {
      result: false, error
    };
  }
};

export const extractExpectedChallenge = (
  presentationDefinitionMessage: WACIMessage,
): string => {
  return presentationDefinitionMessage.attachments.find(
    (attachment) => attachment?.data?.json?.options?.challenge,
  ).data.json.options.challenge;
};

export const validateVcByInputDescriptor = (vc, inputDescriptor): boolean => {
  for (const field of inputDescriptor.constraints.fields) {
    const fieldValues = field.path?.map((path) => {
      return jsonpath.value(vc, path);
    });

    for (const value of fieldValues) {
      if (!value) return false;
      if (field.filter) {
        const { errors } = jsonschema.validate(value, field.filter);
        if (errors.length) {
          return false;
        }
      }
    }
  }
  return true;
};