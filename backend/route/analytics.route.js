// import express from 'express';
// import { adminRoute, protectRoute } from '../middlleware/auth.middleware.js';
// import { getAnalyticsData,getDailySaleData } from '../controllers/analytics.controller.js';

// const router = express.Router();

//  router.get('/', protectRoute, adminRoute, async (req, res) => {
//   try {
//     const analyticsData = await getAnalyticsData();

//     const endDate = new Date(); // today
//     const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days

//     const dailySaleData = await getDailySaleData(startDate, endDate);

//     res.json({
//       analyticsData,
//       dailySaleData,
//     });
//   } catch (error) {
//     console.error("Error fetching analytics data:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });



// export default router;


import express from 'express';
import { adminRoute, protectRoute } from '../middlleware/auth.middleware.js';
import { getAnalyticsData, getDailySaleData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySaleData = await getDailySaleData(startDate, endDate);
    
    // Format daily sale data for Recharts
    const formattedDailyData = dailySaleData.map(item => ({
      name: item.day,       // e.g., "Mon", "Tue"
      sales: item.sales,
      revenue: item.revenue
    }));

    res.json({
      analyticsData,
      dailySalesData: formattedDailyData,  // Changed to match frontend expectation
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;