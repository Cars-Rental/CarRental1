import { carModel } from "../../DB/model/car.model.js";

export const addcar = async (req, res, next) => {
  const { carbrand, carname, carprice, owner } = req.body;
  const addedcar = await carModel.create({
    carbrand,
    carname,
    carprice,
    owner: req.user.id,
  });
  await addedcar.populate("owner", "userName email role phone");
  res
    .status(200)
    .json({ success: true, message: "cars added", data: { addedcar } });
};

export const deletecar = async (req, res, next) => {
  const { id } = req.params;
  const deletecar = await carModel.findByIdAndDelete(id);
  if (!deletecar) {
    res.status(401).json({ success: true, message: "cars not found" });
  }
  res.status(200).json({ message: "car deleted successfly" });
};

export const getallcar = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalCars = await carModel.countDocuments();

  const cars = await carModel.find().skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    message: "all cars",
    data: cars,
  });
};

export const updatecar = async (req, res, next) => {
  const { id } = req.params;
  const { carbrand, carname, carprice } = req.body;
  const updatedcar = await carModel.findByIdAndUpdate(
    id,
    { carbrand, carname, carprice },
    { new: true },
  );
  if (!updatecar) {
    res.status(401).json({ message: "cars not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "car updated", data: { updatedcar } });
};

export const getbyid = async (req, res, next) => {
  const { id } = req.params;
  const getcarbyid = await carModel.findById(id);
  if (!getcarbyid) {
    res.status(401).json({ message: "cars not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "car updated", data: { getcarbyid } });
};
