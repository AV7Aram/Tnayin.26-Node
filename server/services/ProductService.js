class ProductService {
    constructor(models) {
        this.models = models;
    }

    async getAllProducts() {
        return await this.models.prod.find();
    }

    async getProductById(id) {
        return await this.models.prod.findById(id);
    }

    async createProduct(productData) {
        const product = new this.models.prod(productData);
        await product.save();
        return product._id;
    }

    async updateProduct(id, updateData) {
        updateData.updatedAt = new Date();
        const updatedProduct = await this.models.prod.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        return updatedProduct;
    }

    async deleteProduct(id) {
        const result = await this.models.prod.deleteOne({ _id: id });
        return result.deletedCount;
    }
}

module.exports = { ProductService };