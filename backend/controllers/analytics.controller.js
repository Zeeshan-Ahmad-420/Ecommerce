// import Order from '../models/order.model.js';
// import User from '../models/user.model.js'
// import Product from '../models/product.model.js';

// export const getAnalyticsData = async () => {
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments();

//     const salesData = await Order.aggregate([
//         {
//             $group: {
//                 _id: null, // it groups all documents together
//                 totalSales: { $sum: 1 }, // total number of orders
//                 totalRevenue: { $sum: "$totalAmount" }, // total revenue
//             }
//         }
//     ]);
//     const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };
//     return {
//         users: totalUsers,
//         products: totalProducts,
//         totalSales,
//         totalRevenue
//     };
// }

// export const getDailySaleData= async (startDate, endDate) => {
//     const dailySaleData = await Order.aggregate([
//         {
//             $match: {
//                 createdAt: {
//                     $gte: startDate,
//                     $lte: endDate
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//                 sales: { $sum: 1 },
//                revenue: { $sum: "$totalAmount" }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
        
//         const dateArray=await getDatesInRange(startDate, endDate);
//     ]);
//    } 

//    function getDatesInRange(startDate, endDate) {
//     const dates = [];
//     let currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//         dates.push( currentDate.toISOString().split('T')[0]);
//         currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return dates;
    
// }


import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue
    };
};

export const getDailySaleData = async (startDate, endDate) => {
    const dailySaleData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const dateArray = getDatesInRange(new Date(startDate), new Date(endDate));
   return  dateArray.map(date=>{
    const foundData=dailySaleData.find(item=>item._id===date);
    return {
        date,
        sales:foundData ?.sales || 0,
        revenue:foundData ?.revenue || 0,
    }
   })
};

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
