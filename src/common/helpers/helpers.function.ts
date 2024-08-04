export const sluggify = (toConvert: string): string => {
  return toConvert
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-');
};

export const generateSKU = (productName, identifier) => {
  // Split the string into an array of words
  const words = productName.split(' ');

  // Initialize an empty array to store the first letters
  productName = '';

  // Iterate over the array of words
  for (const word of words) {
    // Get the first letter of the current word
    productName += word[0];
  }

  // Convert the identifier to a string and pad it with leading zeros until it is 5 characters long
  const paddedIdentifier = identifier.toString().padStart(5, '0');

  // Generate the SKU by combining the product name, padded identifier, and a fixed prefix
  return `SKU-${productName}-${paddedIdentifier}`;
};

export const generateOrderNumber = () => {
  return (Date.now() + Math.floor(Math.random() * 1000000000))
    .toString()
    .substr(0, 13);
};

export function isValidEmail(email) {
  // Regular expression for validating an email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// validation bd phone number
export const checkPhoneNumberValidation = (phoneNumberString) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\+88|88)?(01[3-9]\d{8})$/);
  if (match) {
    const intlCode = match[1] ? '88' : '';
    return [intlCode, match[2]].join('');
  }
  return null;
};

export const formatePhoneNumber = (phoneNumber) => {
  // Remove any spaces or hyphens in the number
  phoneNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');

  // Check if the number starts with '01' (common in local Bangladeshi numbers)
  if (phoneNumber.startsWith('01')) {
    return '88' + phoneNumber;
  }

  // Check if the number starts with '+88'
  if (phoneNumber.startsWith('+8801')) {
    // Remove the '+' sign and return as is
    return '88' + phoneNumber.slice(3);
  }

  // Check if the number starts with '8801'
  if (phoneNumber.startsWith('8801')) {
    return phoneNumber;
  }
};

export const formatPhoneNumber = (phoneNumber) => {
  // Remove any spaces or hyphens in the number
  phoneNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');

  // Check if the number starts with '01' (common in local Bangladeshi numbers)
  if (phoneNumber.startsWith('01')) {
    return '88' + phoneNumber;
  }

  // Check if the number starts with '+88'
  if (phoneNumber.startsWith('+8801')) {
    // Remove the '+' sign and return as is
    return '88' + phoneNumber.slice(3);
  }

  // Check if the number starts with '8801'
  if (phoneNumber.startsWith('8801')) {
    return phoneNumber;
  }
};

export const tenureMonth = (tenure: string): number => {
  return +tenure.split(' ')[0];
  // switch (tenure) {
  //   case '3 Months':
  //     return 3;
  //   case '6 Months':
  //     return 6;
  //   case '9 Months':
  //     return 9;
  //   case '12 Months':
  //     return 12;
  //   case '18 Months':
  //     return 18;
  //   case '24 Months':
  //     return 24;
  //   case '36 Months':
  //     return 36;
  //   default:
  //     return 0;
  // }
};

export const sortArrayOfObject = (array) => {
  const sortArray = array.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore case
    const nameB = b.name.toUpperCase(); // ignore case

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0; // names are equal
  });
  return sortArray;
};

export const formatTypeormDateTime = (dateTime: Date): Date => {
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const day = String(dateTime.getDate()).padStart(2, '0');
  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  const seconds = String(dateTime.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return new Date(formattedDateTime);
};

export const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
};

export const checkDiscountValidation = (
  matchDiscount: boolean,
  discountPrice: number,
  discountStartDate: Date,
  discountEndDate: Date,
) => {
  // get today date
  const today = new Date();
  today.setHours(today.getHours() + 6);
  if (
    (matchDiscount === true &&
      discountPrice !== 0 &&
      today >= new Date(discountStartDate) &&
      today <= new Date(discountEndDate)) ||
    (matchDiscount === true &&
      discountPrice !== 0 &&
      discountStartDate === null &&
      discountEndDate === null)
  ) {
    return true;
  } else {
    return false;
  }
};
