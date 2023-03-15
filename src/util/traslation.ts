import { ClassConstructor, Type, plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  ValidationOptions,
  ValidationTypes,
  getMetadataStorage,
} from 'class-validator';

export class Translation<T> {
  en: T;

  vi: T;
}

export const listLanguage = {
  en: {
    name: 'English',
  },
  vi: {
    name: 'Tiếng Việt',
  },
};

export function validateTranslation<T>(
  // property: string,
  resourceType: ClassConstructor<T>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    console.log(object);
    console.log(propertyName);
    const test = plainToClass(resourceType, object);
    console.log(test);
    const argNestedValidation = {
      type: ValidationTypes.NESTED_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: validationOptions,
    };
    // return getMetadataStorage().addValidationMetadata(
    //   new ValidationMetadata(argNestedValidation),
    // );
    return true;
  };
}
