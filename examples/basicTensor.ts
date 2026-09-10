import {Tensor} from '../src/tensor/Tensor';

const tensor = new Tensor(
    new Float32Array([1,2,3,4,5,6]),
    [2,3 ] // define shape
)

console.log(tensor.shape);
console.log(tensor.strides);
console.log(tensor.get(1, 2));