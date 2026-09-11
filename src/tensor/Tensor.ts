// Tensor = Float32Array + shape + strides

type TensorArray = number | TensorArray[];

export class Tensor {
    // data loaded into a Float32Array by the constructor
    readonly data: Float32Array;
    // Matrix shape 
    readonly shape: number[];
    // Strides for each dimension of the matrix
    readonly strides: number[];

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor
    constructor (
        // When tensor, give data and shape
        data: Float32Array, 
        shape: number[]
    ) {
        this.data = data;
        this.shape = shape;

        // make expected shape
        let expectedSize = 1;
        for (let i = 0; i < shape.length; i++) {
            expectedSize *= shape[i];
        }

        if (data.length !== expectedSize) {
            throw new Error(
                `Data length ${data.length} does not match expected size ${expectedSize} for shape ${shape}`);
        }

        this.strides= new Array(shape.length);
        // start from the last dimension and work backwards
        let stride = 1;

        // for each dimension, take 1 from the shape 
        // and multiply by the previous stride to get the new stride
        for (let i = shape.length -1; i>= 0; i--){
            this.strides[i] = stride;
            stride *= shape[i];
        }
    }

    // Create a Tensor from a nested array
    static fromArray(input: TensorArray): Tensor{
        // get the shape from input array
        const shape = Tensor.getShape(input);

        // prepare for 32 bit float array
        const flattened: number[] = [];

        // flatten the input array into a 1D array (but where is flattend defined?)
        Tensor.flatten(input, flattened);

        return new Tensor (new Float32Array(flattened), shape);
    }

    // calculate shape of nested array
    private static getShape(input: TensorArray): number[] {

        // A single number has no dimensions below it
        // so it would have no shape
        if (typeof input === "number") {
            return [];
        }
        // An empty array has a shape of [0]
        if (input.length === 0) {
            return [0];
        }

        // Find the shape of the first item
        // WHY IS THIS CALLING ITSELF??????
        const childShape = Tensor.getShape(input[0]);

        // Check that all items have the same shape
        for (let i = 1; i < input.length; i++) {
            const currentShape = Tensor.getShape(input[i]);

        // make sure every child shape is the same as the first child shape
            if(
                currentShape.length !== childShape.length ||
                currentShape.some(
                    (size, index) => size !== childShape[index]
                )
            ) {
                throw new Error("All items must have the same shape");
            }
        }

        // Return the shape of the input array
        return [input.length, ...childShape];
    }

    private static flatten(input: TensorArray, output: number[]): void {
        if (typeof input === "number"){
            output.push(input);
            return; 
        }

        for (const item of input) {
            Tensor.flatten(item, output);
        }
    }

    // uses the Tensor's strides to calculate flat index
    get(...indices: number[]): number {
        // if the indeces are not same as shape throw error
        if (indices.length !== this.shape.length) {
            throw new Error("Wrong number of indices");
        }

        // now check if the indices are within bounds of the shape
        for (let i = 0; i < indices.length; i++) {
            if (indices[i] < 0 || indices[i] >= this.shape[i]) {
                throw new Error(`Index ${indices[i]} is out of bounds`);
            }
        }

        let flatIndex = 0;


        for (let i = 0; i < indices.length; i++) {
            // index * stride for each dimension = flat index
            flatIndex += indices[i] * this.strides[i];
        }

    return this.data[flatIndex];
    }

    
    
}