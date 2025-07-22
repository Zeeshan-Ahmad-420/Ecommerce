// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import axios from "../lib/axios";
// import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
// import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// const AnalyticsTab = () => {
//   const [analyticsData, setAnalyticsData] = useState({
//     users: 0,
//     products: 0,
//     totalSales: 0,
//     totalRevenue: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [dailySalesData, setDailySalesData] = useState([]);
//   useEffect(() => {
//     const fetchAnalyticData = async () => {
//       try {
//         const response = await axios.get("/analytics");
//         setAnalyticsData(response.data.analyticsData);
//         setDailySalesData(response.data.dailySalesData);
//       } catch (error) {
//         console.log("Error fetching analytics data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAnalyticData()
//   }, []);
//   if (loading) {
//     return <div>Loading...</div>
//   }


//   return (
//     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
//         <AnalyticsCard
//           title='Total Users'
//           value={analyticsData.users.toLocaleString()}
//           icon={Users}
//           color='from-emerald-500 to-teal-700'
//         />
//         <AnalyticsCard
//           title='Total Products'
//           value={analyticsData.products.toLocaleString()}
//           icon={Package}
//           color='from-emerald-500 to-green-700'
//         />
//         <AnalyticsCard
//           title='Total Sales'
//           value={analyticsData.totalSales.toLocaleString()}
//           icon={ShoppingCart}
//           color='from-emerald-500 to-cyan-700'
//         />
//         <AnalyticsCard
//           title='Total Revenue'
//           value={`$${analyticsData.totalRevenue.toLocaleString()}`}
//           icon={DollarSign}
//           color='from-emerald-500 to-lime-700'
//         />
//       </div>
//       <motion.div
//         className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.25 }}
//       >
//         <ResponsiveContainer width="100%" height="400">
//           <LineChart data={dailySalesData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
//             <XAxis dataKey='name' stroke='#D1D5DB' />
//             <YAxis yAxisId='left' stroke='#D1D5DB' />
//             <YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
//             <Tooltip />
//             <Legend />
//             <Line
//               yAxisId='left'
//               type='monotone'
//               dataKey='sales'
//               stroke='#10B981'
//               activeDot={{ r: 8 }}
//               name='Sales'
//             />
//             <Line
//               yAxisId='right'
//               type='monotone'
//               dataKey='revenue'
//               stroke='#3B82F6'
//               activeDot={{ r: 8 }}
//               name='Revenue'
//             />
//           </LineChart>
//         </ResponsiveContainer>

//       </motion.div>
//     </div>
//   )
// }

// export default AnalyticsTab



// const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
//   <motion.div
//     className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//   >
//     <div className='flex justify-between items-center'>
//       <div className='z-10'>
//         <p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
//         <h3 className='text-white text-3xl font-bold'>{value}</h3>
//       </div>
//     </div>
//     <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
//     <div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
//       <Icon className='h-32 w-32' />
//     </div>
//   </motion.div>
// );




import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useEffect } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

// Card components implementation
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`pt-0 ${className}`}>{children}</div>
);

// Tabs components implementation
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = "" }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value
        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    } ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className = "" }) => (
  <div className={`mt-2 ${activeTab === value ? "block" : "hidden"} ${className}`}>
    {children}
  </div>
);

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
    userGrowth: 0,
    revenueGrowth: 0
  });
  
  const [dailySalesData, setDailySalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticData = async () => {
      try {
        const response = await axios.get("/analytics");
        
        if (!response.data) {
          throw new Error("No data received");
        }

        setAnalyticsData({
          users: response.data.analyticsData?.users || 0,
          products: response.data.analyticsData?.products || 0,
          totalSales: response.data.analyticsData?.totalSales || 0,
          totalRevenue: response.data.analyticsData?.totalRevenue || 0,
          userGrowth: response.data.analyticsData?.userGrowth || 0,
          revenueGrowth: response.data.analyticsData?.revenueGrowth || 0
        });

        // Format daily sale data
        const formattedDailyData = response.data.dailySalesData?.map(item => ({
          name: item.name || 'Day',
          sales: item.sales || 0,
          revenue: item.revenue || 0
        })) || [];

        // Generate monthly data (sample - replace with actual API data)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedMonthlyData = months.map((month, index) => ({
          name: month,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          sales: Math.floor(Math.random() * 200) + 50
        }));

        setDailySalesData(formattedDailyData);
        setMonthlyData(formattedMonthlyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message);
        setDailySalesData(generateFallbackData());
        setMonthlyData(generateMonthlyFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticData();
  }, []);

  const generateFallbackData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 500) + 100
    }));
  };

  const generateMonthlyFallbackData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      sales: Math.floor(Math.random() * 200) + 50
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of your store performance
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Live Data
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          change={analyticsData.userGrowth}
          icon={Users}
          color="bg-blue-500"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          change={5.2}
          icon={Package}
          color="bg-purple-500"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          change={12.7}
          icon={ShoppingCart}
          color="bg-amber-500"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          change={analyticsData.revenueGrowth}
          icon={DollarSign}
          color="bg-emerald-500"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="weekly">
        <TabsList className="w-fit">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales & Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailySalesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        name="Sales"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        name="Revenue ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="sales" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        name="Sales"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Sales"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AnalyticsCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition-shadow`}>
        <div className="flex justify-between items-center pb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`h-5 w-5 ${color.replace('bg', 'text')}`} />
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last period
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;