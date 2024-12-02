import Artists from '../models/Artists.js';

export const unverifiedArtistsWithOrders = async () => {
    const unverifiedArtists = await Artists.aggregate([
        {
          $lookup: {
            from: "orders", // the name of the Orders collection
            localField: "_id", // field from Artists
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
          },
        },
    ]);

    return unverifiedArtists;
}