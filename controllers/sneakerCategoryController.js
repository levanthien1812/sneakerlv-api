import sneakerCategory from "../models/sneakerCategory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";
import fse from 'fs-extra'
import Sneaker from "../models/sneaker.js";
import sneaker from "../models/sneaker.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sneakerId = req.body.sneakerId
        const path = './public/images/sneakers/' + sneakerId + '/categories'
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
}).single('image')

export const uploadCategoryImage = (req, res, next) => {
    upload(req, res, err => {
        if (err) {
            next(err)
        } else {
            if (req.files && req.files.image) {
                req.body.image = req.files.image[0].filename
            }
            next()
        }
    })
}

export const createSneakerCategory = catchAsync(async (req, res, next) => {
    const categoriesReqData = req.body
    const category = await sneakerCategory.create({
        ...categoriesReqData,
        sneaker: req.body.sneakerId
    })

    return res.status(200).json({
        status: 'success',
        data: category
    })
})

export const getCategoriesBySneaker = catchAsync(async (req, res, next) => {
    const {
        slug
    } = req.params
    const sneaker = await Sneaker.findOne({
        slug
    })
    if (!sneaker) {
        return new AppError("Can not find this sneaker!", 404)
    }
    const categories = await sneakerCategory.find({
        sneaker: sneaker._id
    })
    return res.status(200).json({
        status: "success",
        data: categories
    })
})

export const deleteExcept = catchAsync(async (req, res, next) => {
    const sneaker = await Sneaker.findOne({
        slug: req.params.slug
    })
    const price = await sneakerCategory.findOne({
        sneaker: sneaker._id
    }).sort('-price')

    res.json(price.price)
})