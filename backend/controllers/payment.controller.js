// import { stripe } from "../lib/stripe.js";
// import Coupon from "../models/coupon.model.js";
// import Order from "../models/order.model.js";

// // 🧠 Utility: create a temporary Stripe coupon
// async function createStripeCoupon(discountPercentage) {
//     const coupon = await stripe.coupons.create({
//         percent_off: discountPercentage,
//         duration: "once",
//     });
//     return coupon.id;
// }

// // 🧠 Utility: create a new coupon for user if they spent over $200
// async function createNewCoupon(userId) {
//     await Coupon.findOneAndDelete({ userId });

//     const newCoupon = new Coupon({
//         code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
//         discountPercentage: 10,
//         expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//         userId,
//     });

//     await newCoupon.save();
// }

// export const createCheckoutSession = async (req, res) => {
//     try {
//         const { products, couponCode } = req.body;

//         if (!Array.isArray(products) || products.length === 0) {
//             return res.status(400).json({ message: "Products array is required" });
//         }

//         let totalAmount = 0;
//         const lineItems = products.map((item) => {
//             const amount = Math.round(item.price * 100); // Convert to cents
//             totalAmount += amount * item.quantity;
//             return {
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: item.name,
//                         images: [item.image],
//                     },
//                     unit_amount: amount,
//                 },
//                 quantity: item.quantity || 1,
//             };
//         });

//         let coupon = null;
//         if (couponCode) {
//             coupon = await Coupon.findOne({
//                 code: couponCode,
//                 userId: req.user._id,
//                 isActive: true,
//             });
//         }

//         if (coupon) {
//             const discount = Math.round(totalAmount * (coupon.discountPercentage / 100));
//             totalAmount -= discount;
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: lineItems,
//             mode: "payment",
//             success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//             discounts: coupon
//                 ? [
//                       {
//                           coupon: await createStripeCoupon(coupon.discountPercentage),
//                       },
//                   ]
//                 : [],
//             metadata: {
//                 userId: String(req.user._id),
//                 couponCode: couponCode || "",
//                 products: JSON.stringify(
//                     products.map((p) => ({
//                         id: p._id,
//                         quantity: p.quantity,
//                         price: p.price,
//                     }))
//                 ),
//             },
//         });

//         if (totalAmount >= 20000) {
//             await createNewCoupon(req.user._id);
//         }

//         res.status(200).json({ id: session.id });
//     } catch (error) {
//         console.error("Error in createCheckoutSession controller:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// export const checkoutSuccess = async (req, res) => {
//     try {
//         const { sessionId } = req.body;

//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         if (session.payment_status === "paid") {
//             if (session.metadata.couponCode) {
//                 await Coupon.findOneAndUpdate(
//                     {
//                         code: session.metadata.couponCode,
//                         userId: session.metadata.userId,
//                     },
//                     { isActive: false }
//                 );
//             }

//             const products = JSON.parse(session.metadata.products);
//             const newOrder = new Order({
//                 user: session.metadata.userId,
//                 products: products.map((p) => ({
//                     product: p.id,
//                     quantity: p.quantity,
//                     price: p.price,
//                 })),
//                 totalAmount: session.amount_total / 100,
//                 stripeSessionId: sessionId,
//             });

//             await newOrder.save();

//             return res.status(200).json({
//                 success: true,
//                 message: "Order created successfully",
//                 orderId: newOrder._id,
//             });
//         }

//         res.status(400).json({ message: "Payment not completed" });
//     } catch (error) {
//         console.error("Error in checkoutSuccess:", error);
//         res.status(500).json({ message: "Error processing checkout", error: error.message });
//     }
// };











import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";

// 🧠 Utility: create a temporary Stripe coupon
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

// 🧠 Utility: create a new coupon for user if they spent over $200
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		userId,
	});

	await newCoupon.save();
}

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ message: "Products array is required" });
		}

		let totalAmount = 0;
		const lineItems = products.map((item) => {
			const amount = Math.round(item.price * 100); // USD cents
			totalAmount += amount * item.quantity;
			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: item.name,
						images: [item.image],
					},
					unit_amount: amount,
				},
				quantity: item.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});
		}

		if (coupon) {
			const discount = Math.round(totalAmount * (coupon.discountPercentage / 100));
			totalAmount -= discount;
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: String(req.user._id),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ id: session.id });
	} catch (error) {
		console.error("Error in createCheckoutSession:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return res.status(400).json({ message: "Payment not completed" });
		}

		// ✅ 1. Check if order already exists
		const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
		if (existingOrder) {
			return res.status(200).json({
				success: true,
				message: "Order already exists",
				orderId: existingOrder._id,
			});
		}

		const products = JSON.parse(session.metadata.products);
		const userObjectId = new mongoose.Types.ObjectId(session.metadata.userId);

		// ✅ 2. Deactivate coupon if applied
		if (session.metadata.couponCode) {
			await Coupon.findOneAndUpdate(
				{
					code: session.metadata.couponCode,
					userId: userObjectId,
				},
				{ isActive: false }
			);
		}

		// ✅ 3. Create the order
		const newOrder = new Order({
			user: userObjectId,
			products: products.map((p) => ({
				product: p.id,
				quantity: p.quantity,
				price: p.price,
			})),
			totalAmount: session.amount_total / 100,
			stripeSessionId: sessionId,
		});

		await newOrder.save();

		return res.status(200).json({
			success: true,
			message: "Order created successfully",
			orderId: newOrder._id,
		});
	} catch (error) {
		console.error("Error in checkoutSuccess:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};
