import mongoose from "mongoose"
import slugify from "slugify"

const BrandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of brand']
    },
    slug: String,
    image: {
        type: String,
        // require: [true, 'Please provide image to brand']
    }
})

BrandSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

export default new mongoose.model('Brand', BrandSchema)