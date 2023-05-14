import catchAsync from "../utils/catchAsync.js";
import UserModel from "../models/user.js";
import ShippingInfo from "../models/shippingInfo.js";
import AppError from "../utils/appError.js";
import fse from "fs-extra";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "./public/images/users/" + req.user.id;
    fse.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}.jpg`;
    const fileName = file.fieldname + "-" + uniqueSuffix;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please select only images"));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("photo");

export const uploadUserPhoto = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      if (req.file) {
        req.body.photo = req.file.filename;
      }
      next();
    }
  });
};

export const updateUser = catchAsync(async (req, res, next) => {
  const updateData = req.body;
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
    }
  );
  if (!updatedUser) {
    return res.status(404).json({
      status: "fail",
      message: "Something went wrong when updating user profile!",
    });
  }

  return res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const createShippingInfo = catchAsync(async (req, res, next) => {
  const { address, phoneNum } = req.body;
  if (
    await ShippingInfo.exists({
      address: address,
      phoneNum: phoneNum,
    })
  )
    return next(new AppError("Duplicated shipping address! Try again."));

  const newShippingInfo = await ShippingInfo.create({
    ...req.body,
    user: req.user._id,
  });

  console.log(newShippingInfo)

  return res.status(200).json({
    status: "success",
    data: JSON.stringify(newShippingInfo),
  });
});

export const getShippingInfo = catchAsync(async (req, res, next) => {
  const shippingInfos = await ShippingInfo.find({ user: req.user._id });

  return res.status(200).json({
    status: "success",
    quantity: shippingInfos.length,
    data: shippingInfos,
  });
});

export const deleteShippingInfo = catchAsync(async (req, res, next) => {
  await ShippingInfo.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    status: "success",
  });
});

export const updateShippingInfo = catchAsync(async (req, res, next) => {
  const { address, phoneNum } = req.body;
  if (
    await ShippingInfo.exists({
      address: address,
      phoneNum: phoneNum,
    })
  )
    return next(new AppError("Duplicated shipping address! Try again."));

  const updatedShippingInfo = await ShippingInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    data: updatedShippingInfo,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).select(
    "name email phoneNum photo gender"
  );

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

export const deleteAllShippingInfo = catchAsync(async (req, res, next) => {
  await ShippingInfo.deleteMany()
})
