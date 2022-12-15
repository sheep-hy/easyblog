const regs = {
  phone: /^((1[0-9]))\d{9}$/,
  account: /^[0-9a-zA-Z_]{1,}$/,
  password: /^\w+$/,
  pInt: /^[1-9]+[0,9]*$/,// 正整数
  pointNumber: /^([0-9]\d{0,9}|0)([.]?|(\.\d{1,10})?)$/, //小数
  money: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1,9][0,9]*\.\d{1,2})))$/ //金额

}
const verify = (rule, value, reg, callback) => {
  if (value) {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  } else {
    callback()
  }
}
export default{
  phone:(rule,value,callback)=>{
    return verify(rule,value,regs.phone,callback)
  },
  account:(rule,value,callback)=>{
    return verify(rule,value,regs.account,callback)
  },
  password:(rule,value,callback)=>{
    return verify(rule,value,regs.password,callback)
  },
  pInt:(rule,value,callback)=>{
    return verify(rule,value,regs.pInt,callback)
  },
  pointNumber:(rule,value,callback)=>{
    return verify(rule,value,regs.pointNumber,callback)
  },
  money:(rule,value,callback)=>{
    return verify(rule,value,regs.money,callback)
  },
}