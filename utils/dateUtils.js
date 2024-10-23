function dateNow() {
    const now = new Date();

    const utcOffset = now.getTimezoneOffset(); 
    const philippinesOffset = 8 * 60; 
    const philippinesTime = new Date(now.getTime() + (philippinesOffset - utcOffset) * 60000);

    let month = '' + (philippinesTime.getMonth() + 1),
        day = '' + philippinesTime.getDate(),
        year = philippinesTime.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


module.exports = {
    dateNow
};
