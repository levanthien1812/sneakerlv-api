import mongoose from "mongoose"
import slugify from "slugify"
const Schema = mongoose.Schema

const SneakerSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: [true, 'This ID is already taken! Try another ID']
    },
    name: {
        type: String,
        required: [true, 'Please provide the name of sneaker!']
    },
    coverImage: {
        type: String,
        require: [true, 'Please provide the cover image of sneaker!']
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    description: String,
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
    },
    slug: String,
})

SneakerSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

export default mongoose.model('Sneaker', SneakerSchema)