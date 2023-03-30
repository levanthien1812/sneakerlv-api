import sneakerCategory from "../models/sneakerCategory";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const createSneakerCategory = catchAsync(async (req, res, next) => {
    const categoriesReqData = req.body.categories
    const categoriesData = categoriesReqData.map(item => {
        return {
            ...item,
            
        }
    })

    const categories = await sneakerCategory.create()
})