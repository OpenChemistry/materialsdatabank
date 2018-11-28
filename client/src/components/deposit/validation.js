export const required = (val) => {
  let msg = '* field is required'
  if (!val) {
    return msg
  }
  if (val === '') {
    return msg
  }
  return null;
}

export function arrayValidation(size) {
  return (val) => {
    try {
      let arr = JSON.parse(val);
      if (Array.isArray(arr)) {
        if (size) {
          if (size[0] !== arr.length) {
            return 'Provide an array with the right dimensions';
          } else {
            if (size[1]) {
              for (let a of arr) {
                if (size[1] !== a.length) {
                  return 'Provide an array with the right dimensions';
                }
              }
            }
          }
        }
      } else {
        return 'Provide a valid array';
      }
    } catch(e) {
      return 'Provide a valid array';
    }
  }
}

export const ensureNumber = (val) => {
  let msg = 'This field must be a number';
  if (Number.isFinite(parseFloat(val))) {
    return null;
  } else {
    return msg;
  }
}