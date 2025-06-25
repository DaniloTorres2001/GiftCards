// Email validator
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

//Future Date validator
const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day
    return inputDate > today;
};

//Amount validator
const isValidAmount = (amount) => {
    return typeof amount === 'number' && amount > 0;
};

module.exports = {
    isValidEmail,
    isFutureDate,
    isValidAmount
};
