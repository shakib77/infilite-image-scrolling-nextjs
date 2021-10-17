import {useState, useEffect, useRef} from 'react';
import styles from './Home.module.css'

const HomeComponent = () => {
    const classes = styles;

    const [photos, setPhotos] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false)

    const fetchPhotos = async (pageNumber) => {
        const Access_Key = "VaS3ud1C-0gdW1nw41FbBryaV_Q5obZ04o-3Vi2QC1E"
        const res = await fetch(`https://api.unsplash.com/photos/?client_id=${Access_Key}&page=${pageNumber}&per_page=30`)
        const data = await res.json()
        // console.log('data=>', data)
        setPhotos((p) => [...p, ...data])
        // console.log('photos->', photos);
        setLoading(true)
    }

    useEffect(() => {
        fetchPhotos(pageNumber);
    }, [pageNumber])

    const loadMore = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
    }

    const pageEnd = useRef();
    let num = 1;

    useEffect(() => {
        if (loading) {
            handleScroll();
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    num++;
                    // if (num >= 10) {
                    //     observer.unobserve(pageEnd.current)
                    // }

                    if (photos?.length >= 1200) {
                        observer.unobserve(pageEnd.current)
                    }

                }

            }, {threshold: 1});

            observer.observe(pageEnd.current)

        }

    }, [loading, num])

    const handleScroll = () => {
        window.onscroll = (ev) => {
            if ((window.innerHeight + window.scrollY) > document.body.offsetHeight) {
                // console.log('bottom of->');
                loadMore();
            }
        };
    }

    return (
        <div className="box">
            <ul className={classes.photoGrid}>
                {
                    photos?.map((photo, index) => (
                        <li className={classes.List} key={index}>
                            <img className={classes.Image} src={photo.urls.small} alt={photo.img}/>

                            {/*<p>{photo.user.first_name + ' ' + photo.user.last_name}</p>*/}
                            {/*<span>Like: {photo.user.total_likes}</span>*/}
                        </li>
                    ))
                }
            </ul>
            {
                loading && <div className={classes.loading}>
                    <h2>Loading....</h2>
                    <h3>{photos?.length}</h3>
                    <button onClick={loadMore} ref={pageEnd}>
                        Load More
                    </button>
                </div>
            }
        </div>
    );
}

export default HomeComponent;
