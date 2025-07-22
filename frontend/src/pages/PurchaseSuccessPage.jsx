import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState(null);
	const { clearCart } = useCartStore();
	const [confettiVisible, setConfettiVisible] = useState(true);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout-success", { sessionId });
				clearCart();
				setTimeout(() => setConfettiVisible(false), 5000); // Stop confetti after 5s
			} catch (error) {
				console.error("Checkout success error:", error);
				setError("Something went wrong while confirming your order.");
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");

		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("Session ID not found in URL.");
		}
	}, [clearCart]);

	if (isProcessing) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-900 text-white">
				Processing your order...
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen flex items-center justify-center text-red-500 bg-gray-900">
				{error}
			</div>
		);
	}

	return (
		<div className="h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-800 relative">
			{confettiVisible && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					gravity={0.08}
					numberOfPieces={400}
					recycle={false}
					style={{ zIndex: 99 }}
				/>
			)}

			<div className="max-w-md w-full bg-gray-850 border border-gray-700 rounded-2xl shadow-2xl p-8 sm:p-10 relative z-10 text-center">
				<div className="flex justify-center">
					<CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
				</div>
				<h1 className="text-3xl font-bold text-emerald-400 mb-2">Purchase Successful!</h1>
				<p className="text-gray-300 mb-2">
					Thank you for your order. We’re processing it now.
				</p>
				<p className="text-sm text-emerald-400 mb-6">
					Check your email for order details and updates.
				</p>

				<div className="bg-gray-750 rounded-lg p-4 text-sm text-gray-400 mb-6 text-left">
					<div className="flex justify-between mb-2">
						<span>Order number</span>
						<span className="font-semibold text-emerald-400">#12345</span>
					</div>
					<div className="flex justify-between">
						<span>Estimated delivery</span>
						<span className="font-semibold text-emerald-400">3–5 business days</span>
					</div>
				</div>

				<div className="space-y-4">
					<button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
						<HandHeart className="mr-2" size={18} />
						Thanks for trusting us!
					</button>
					<Link
						to="/"
						className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
					>
						Continue Shopping
						<ArrowRight className="ml-2" size={18} />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;

