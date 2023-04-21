import multer from 'multer'
import ReadFeatures from '../utils/readFeatures.js'
import Sneaker from '../models/sneaker.js'
import catchAsync from '../utils/catchAsync.js'
import Cart from '../models/cart.js'
import AppError from '../utils/appError.js'
import sneakerCategory from '../models/sneakerCategory.js'
import fse from 'fs-extra'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sneakerId = req.body.id
        const path = './public/images/sneakers/' + sneakerId;
        fse.mkdirsSync(path)
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E5)}.jpg`
        const fileName = file.fieldname + '-' + uniqueSuffix
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please select only images'))
    }
}

const upload = multer({
    storage,
    fileFilter
}).fields([{
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 5
    }
])

export const uploadSneakerImages = (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            next(err)
        } else {
            if (req.files) {
                if (req.files.coverImage) {
                    req.body.coverImage = req.files.coverImage[0].filename
                }
                if (req.files.images) {
                    req.body.images = []
                    req.files.images.map(img => {
                        req.body.images.push(img.filename)
                    })
                }
            }
            next()
        }
    })
}

export const createSneaker = catchAsync(async (req, res, next) => {
    const sneakerReq = req.body
    const newSneaker = await Sneaker.create(sneakerReq)

    // if (!newSneaker.defaultCategory) {
    //     const defaultCategory = await sneakerCategory.findOne({
    //         sneaker: req.body.id,
    //         isDefault: true
    //     })
    //     newSneaker.defaultCategory = defaultCategory
    //     newSneaker.save()
    // }

    if (newSneaker) {
        res.status(200).json({
            status: 'success',
            data: newSneaker
        })
    }
})

export const getSneakers = catchAsync(async (req, res, next) => {
    let sneakersQuery
    // Dont use await so that find() returns a query
    // query will be executed later
    if (req.query.search) {
        sneakersQuery = Sneaker.find({
            name: {
                $regex: req.query.search,
                $options: 'i'
            }
        })
    } else {
        sneakersQuery = Sneaker.find()
    }

    let features = (new ReadFeatures(sneakersQuery, req.query)).filter().sort().paginate()
    const sneakers = await features.query

    // find min and max price
    sneakers.forEach(async snk => {
        const minPriceSneaker = await sneakerCategory.findOne({
            sneaker: snk._id
        }).sort('price')
        const maxPriceSneaker = await sneakerCategory.findOne({
            sneaker: snk._id
        }).sort('-price')

        if (minPriceSneaker && minPriceSneaker) {
            snk.price = {
                min: minPriceSneaker.price,
                max: maxPriceSneaker.price
            }
        }
        await snk.save()
    })

    return res.status(200).json({
        status: 'success',
        quantity: sneakers.length,
        data: sneakers
    })
})

export const getSneaker = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.findOne({
        slug: req.params.slug
    })

    const categories = await sneakerCategory.find({
        sneaker: sneaker._id
    })

    const related = await Sneaker.find({
        brand: sneaker.brand,
        id: {
            $ne: sneaker.id
        }
    }).limit(10)

    return res.status(200).json({
        status: 'success',
        data: {
            sneaker,
            categories,
            related
        }
    })
})

export const updateSneaker = catchAsync(async (req, res, next) => {

})

export const deleteSneaker = catchAsync(async (req, res, next) => {
    await Sneaker.deleteOne({
        slug: req.params.slug
    })

    return res.status(200).json({
        status: 'success',
    })
})

export const favoriteSneaker = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.findOne({
        slug: req.params.slug
    })
    let favorites = sneaker.favorites
    if (!favorites.includes(req.user.id)) {
        favorites.push(req.user.id)
    } else {
        const index = favorites.indexOf(req.user.id)
        favorites.splice(index, 1)
    }

    await sneaker.save()

    return res.status(202).json({
        status: 'success',
        quantity: sneaker.favorites.length
    })
})