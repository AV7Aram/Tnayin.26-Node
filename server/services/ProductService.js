class ProductService {
    constructor(models) {
        this.models = models;
    }

    async getProducts() {
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

async addProductImage(id, imagePath) {
    console.log('Adding image to product:', id, 'Image path:', imagePath);
    
    const product = await this.models.prod.findByIdAndUpdate(
        id,
        { $push: { additionalImages: imagePath } },
        { new: true }
    );
    
    console.log('Product after update:', product);
    return product;
}

    async removeProductImage(id, imagePath) {
        const product = await this.models.prod.findByIdAndUpdate(
            id,
            { $pull: { additionalImages: imagePath } },
            { new: true }
        );
        return product;
    }
}

module.exports = { ProductService };