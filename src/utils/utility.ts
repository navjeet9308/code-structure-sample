import moment from 'moment';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
 export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
      return true;
    } else if (typeof value !== 'number' && value === '') {
      return true;
    } else if (typeof value === 'undefined' || value === undefined) {
      return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
      return true;
    } else {
      return false;
    }
  };

  export const getWeekRange = (week = 0)=>{
     var weekStart = moment(new Date()).format('YYYY-MM-DD'); 
     var weekEnd = moment().subtract(week,'w').format("YYYY-MM-DD"); 
     return ([weekStart,weekEnd]);
  }
  export const getMonthRange = (month = 0)=>{
    var weekStart = moment(new Date()).format('YYYY-MM-DD'); 
    var weekEnd = moment().subtract(month,'months').format("YYYY-MM-DD"); 
    return ([weekStart,weekEnd]);
 }