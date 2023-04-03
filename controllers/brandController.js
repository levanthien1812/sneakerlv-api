import Brand from "../models/brand.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllBrands = catchAsync(async (req, res, next) => {
    const brands = await Brand.find()

    return res.status(200).json({
        status: 'success',
        data: brands
    })
})