import { carModel } from "../DB/model/carRent.model.js";
import { carbuymodel } from "../DB/model/carBuy.model.js";
import { orderModel } from "../DB/model/order.model.js";
import { orderBuyModel } from "../DB/model/orderBuy.model.js";

export async function getTraderStats(ownerId) {
  const [rentCarsCount, saleCarsCount, rentEarningsAgg, saleEarningsAgg] =
    await Promise.all([
      carModel.countDocuments({ owner: ownerId }),
      carbuymodel.countDocuments({ owner: ownerId }),
      orderModel.aggregate([
        { $match: { owner: ownerId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      orderBuyModel.aggregate([
        { $match: { owner: ownerId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),
    ]);

  const rentEarnings = rentEarningsAgg[0]?.total || 0;
  const saleEarnings = saleEarningsAgg[0]?.total || 0;

  return {
    carsCount: rentCarsCount + saleCarsCount,
    rentCarsCount,
    saleCarsCount,
    earnings: rentEarnings + saleEarnings,
  };
}


export async function getTraderStatsBulk(ownerIds) {
  const [rentCounts, saleCounts, rentEarnings, saleEarnings] = await Promise.all([
    carModel.aggregate([
      { $match: { owner: { $in: ownerIds } } },
      { $group: { _id: "$owner", count: { $sum: 1 } } },
    ]),
    carbuymodel.aggregate([
      { $match: { owner: { $in: ownerIds } } },
      { $group: { _id: "$owner", count: { $sum: 1 } } },
    ]),
    orderModel.aggregate([
      { $match: { owner: { $in: ownerIds }, status: "completed" } },
      { $group: { _id: "$owner", total: { $sum: "$totalPrice" } } },
    ]),
    orderBuyModel.aggregate([
      { $match: { owner: { $in: ownerIds }, status: "completed" } },
      { $group: { _id: "$owner", total: { $sum: "$carprice" } } },
    ]),
  ]);

  const map = new Map();
  ownerIds.forEach((id) => map.set(id.toString(), { carsCount: 0, earnings: 0 }));

  rentCounts.forEach((r) => {
    const entry = map.get(r._id.toString());
    if (entry) entry.carsCount += r.count;
  });
  saleCounts.forEach((r) => {
    const entry = map.get(r._id.toString());
    if (entry) entry.carsCount += r.count;
  });
  rentEarnings.forEach((r) => {
    const entry = map.get(r._id.toString());
    if (entry) entry.earnings += r.total;
  });
  saleEarnings.forEach((r) => {
    const entry = map.get(r._id.toString());
    if (entry) entry.earnings += r.total;
  });

  return map;
}
