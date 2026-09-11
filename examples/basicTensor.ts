import { Tensor } from "../src/tensor/Tensor";

const tensor = Tensor.fromArray([
    [10, 20, 30],
    [40, 50, 60]
]);

console.log("Data:", tensor.data);
console.log("Shape:", tensor.shape);
console.log("Strides:", tensor.strides);

console.log("Value:", tensor.get(1, 2));