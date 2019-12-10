import yup = require('yup')

const rot: ('a'|'b'|'c')[] = ['a', 'b', 'c']
const mixed = yup.mixed<typeof rot[number]>().oneOf([rot]) // WHY??/

const a = (a: ReadonlyArray<typeof rot[number]> | Array<typeof rot[number]>)=> {}
a(['a'])
a(rot)
const v: 'a'[] = ['a']
a(v)
 