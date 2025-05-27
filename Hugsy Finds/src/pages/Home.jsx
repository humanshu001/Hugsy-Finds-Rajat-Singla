import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import BestSellingProducts from '../components/BestSellingProducts'
import SpecialAboutUs from '../components/SpecialAboutUs'
import Instagram from '../components/Instagram'
import CustomerReviews from '../components/CustomerReviews'

export default function Home() {
  return (
    <>
        <Header />
        <HeroSection />
        <BestSellingProducts />
        <SpecialAboutUs />
        <Instagram />
        <CustomerReviews />
        <Footer />
    </>
  )
}
