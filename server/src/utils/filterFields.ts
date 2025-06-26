const filterFields = (obj: any, allowedFields: string[]) => {
  const newObj: any = {};
  allowedFields.forEach((field) => {
    if (obj[field]) {
      newObj[field] = obj[field];
    }
  });
  return newObj;
};

export default filterFields;