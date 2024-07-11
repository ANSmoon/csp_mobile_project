import { useState, useEffect } from 'react'
import img4 from '../../assets/marketing_img4.jpg'
import img2 from '../../assets/marketing_img2.jpg'
import img3 from '../../assets/marketing_img3.jpg'

import img2Wide from '../../assets/marketing_img2_wide.jpg'
import img3Wide from '../../assets/marketing_img3_wide.jpg'
import { useGetUsingBannerQuery } from '../../services/banner/bannerApiSlice'

const DateRange = (props) => {
    // 이미지 데이터

    // const images = [img2, img3, img4]
    const imagesWide = [img2Wide, img3Wide]
    // 사용자...계속 차단된다. 아까 잠깐 됐는데 뭐지?

    const { data: images, isLoading, error } = useGetUsingBannerQuery()
    useEffect(() => {
        console.log('🖼️slide img', images, isLoading, error)
    }, [images, isLoading, error])

    const storeName = localStorage.getItem('store-name')
    const [cycle, setCycle] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        let interval

        const goToNextSlide = () => {
            if (screenWidth > 600) {
                const nextIndex = (currentIndex + 1) % imagesWide.length
                setCurrentIndex(nextIndex)
            } else if (images) {
                const nextIndex = (currentIndex + 1) % images.banners.length
                setCurrentIndex(nextIndex)
            }
        }
        if (cycle) {
            interval = setInterval(goToNextSlide, 3000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [currentIndex, cycle, screenWidth])

    const handleResize = () => {
        setScreenWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const goToSlide = (index) => {
        setCurrentIndex(index)
    }
    const prevSlide = () => {
        const prevIndex =
            (currentIndex - 1 + images.banners?.length) % images.banners?.length
        setCurrentIndex(prevIndex)
    }

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % images.banners?.length
        setCurrentIndex(nextIndex)
    }

    const [touchStartX, setTouchStartX] = useState(null)
    const [touchEndX, setTouchEndX] = useState(null)

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStartX && touchEndX) {
            const diff = touchStartX - touchEndX
            if (diff > 50) {
                nextSlide()
            } else if (diff < -50) {
                prevSlide()
            }
        }

        setTouchStartX(null)
        setTouchEndX(null)
    }

    const renderIndicators = (imgList) => {
        return (
            <div className="relative z-10">
                <div className="flex justify-end p-6 mt-8">
                    {imgList.map((_, index) => (
                        <span
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 mx-1 bg-gray-300 rounded-full cursor-pointer ${
                                index === currentIndex ? 'bg-gray-900' : ''
                            }`}
                        ></span>
                    ))}
                </div>
            </div>
        )
    }

    const carousel = () => {
        if (screenWidth > 600) {
            return (
                <div
                    // className="relative flex flex-col"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full h-0 pb-[25%] mt-12"
                >
                    {renderIndicators(imagesWide)}
                    {imagesWide.map((imageUrl, index) => (
                        <div
                            key={index}
                            className={`absolute top-2 transition-opacity ${
                                index === currentIndex
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        >
                            <img
                                src={imageUrl}
                                alt={` ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            )
        } else if (isLoading) {
            return <div>loading...</div>
        } else if (images) {
            return (
                <div
                    // className="relative flex flex-col"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full h-0 pb-[55%] mt-12"
                >
                    {renderIndicators(images.banners)}
                    {images.banners.map((item, index) => (
                        <div
                            key={index}
                            className={`absolute top-2 transition-opacity ${
                                index === currentIndex
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        >
                            <img
                                src={item.image.filePath}
                                alt={` ${index + 1}`}
                                className="object-cover w-full h-full h-auto"
                            />
                        </div>
                    ))}
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col">
            {/* 이미지 캐러셀 */}
            {carousel()}

            {/* 날짜표시 */}
            <span className="z-10 p-4 pl-8 text-xl font-bold bg-white rounded-t-xl border-b">
                ☕ {storeName}
            </span>
        </div>
    )
}

export default DateRange
