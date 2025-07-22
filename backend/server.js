import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './route/auth.route.js'
import productRoutes from './route/product.route.js'
import cookieParser from 'cookie-parser'
import cartRoutes from './route/cart.route.js'
import couponRoutes from './route/coupon.route.js'
import paymentRoutes from './route/payment.route.js'
import analyticsRoutes from './route/analytics.route.js'
import { connectDB } from './lib/db.js'
import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(express.json({ limit: "10mb" })) // allow to parse JSON bodies
app.use(cookieParser())  // allow to parse cookies

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupon', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connectDB()
})