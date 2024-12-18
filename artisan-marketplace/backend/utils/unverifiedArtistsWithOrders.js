// artisan-marketplace\backend\utils\unverifiedArtistsWithOrders.js
import Artists from '../models/Artists.js';

export const unverifiedArtistsWithOrders = async () => {
  try {
    const unverifiedArtists = await Artists.aggregate([
      {
        $lookup: {
          from: "orders", // the name of the Orders collection
          localField: "id", // use the 'id' field from Artists
          foreignField: "artisanId", // field from Orders
          as: "orders", // alias for joined data
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" }, // count the number of orders for each artisan
        },
      },
      {
        $match: {
          verified: false, // only include unverified artisans
          orderCount: { $gte: 5 }, // only include artisans with 5 or more orders
        },
      },
      {
        $project: {
          orders: 0, // exclude the orders array from the output if not needed
          _id: 0, // exclude the default _id field
        },
      },
    ]);

    return unverifiedArtists;
  } catch (error) {
    throw new Error("Error fetching unverified artists with orders: " + error.message);
  }
};
