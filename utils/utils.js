/* check if a number is a natural number */
function isNaturalNumber(n) {
  if (typeof n !== 'number') {
    return false; 
  }

  return (n > 0.0) && (Math.floor(n) === n) && n !== Infinity;
}

/* GET api: check if the key "from" in request body is 0 or a natural number */
function isValidFrom(n) {
  if (typeof n !== 'number') {
    return false; 
  }

  return (n >= 0.0) && (Math.floor(n) === n) && n !== Infinity;
}

function getTimeNow() {
  return new Date().getTime();
}

module.exports = { isNaturalNumber, isValidFrom, getTimeNow };
