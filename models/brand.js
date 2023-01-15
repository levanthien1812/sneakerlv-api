const mongoose = require('mongoose')
const slugify = require('slugify')

const BrandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of brand']
    },
    slug: String
})

BrandSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

module.exports = new mongoose.model('Brand', BrandSchema)