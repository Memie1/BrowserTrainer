// Tensor = Float32Array + shape + strides


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
        // TODO: validate shape, calculate strides, ensure data length matches shape
    }

    // uses the Tensor's strides to calculate flat index
    
    get(...indices: number[]): number {
        // if the indeces are not same as shape throw error
        if (indices.length !== this.shape.length) {
            throw new Error("Wrong number of indices");
        }

        // why twice?
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