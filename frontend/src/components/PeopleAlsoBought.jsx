import { useEffect, useState } from 'react'
import ProductCard from "./ProductCard"
import axios from "../lib/axios"
import { toast } from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const PeopleAlsoBought = () => {
  const [recomendations, setRecomendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecomendations = async () => {
      try {
    const res=   await axios.get("/products/recommendations")
        setRecomendations(res.data)
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch recomendations")
      } finally {
        setLoading(false)

      }
    }
    fetchRecomendations();
  },[]);
  if (loading) return <LoadingSpinner/>

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
        {recomendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought
