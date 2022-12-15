import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {books: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedTopRated = data.books.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        books: updatedTopRated,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBookLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderTopRatedBookSuccessView = () => {
    const {books} = this.state
    const settings = {
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 500,
      slidesToScroll: 1,
      slidesToShow: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 786,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <div className="slick-container">
        <h1 className="top-rated-book-heading">
          Find Your Next Favorite Books?
        </h1>
        <p className="top-rated-book-paragraph">
          You are in the right place. Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprisingly insightful
          recommendations.
        </p>
        <Link to="/shelf" className="text-underline-none">
          <button type="button" className="find-button nav-option-button ">
            Find Books
          </button>
        </Link>

        <div className="all-slides-container">
          <div className="top-rated-card-container">
            <h1 className="top-rated-card-heading">Top Rated Books</h1>
            <Link to="/shelf" className="text-underline-none">
              <button
                type="button"
                className="find-button find-book-lg-button "
              >
                Find Books
              </button>
            </Link>
          </div>

          <Slider {...settings}>
            {books.map(eachBook => {
              const {id} = eachBook
              return (
                <div key={id} className="book-container">
                  <Link to={`/books/${id}`} className="text-underline-none">
                    <img
                      src={eachBook.coverPic}
                      alt={eachBook.title}
                      className="favorite-book"
                    />

                    <h1 className="book-home-title">{eachBook.title}</h1>
                    <p className="book-author-name">{eachBook.authorName}</p>
                  </Link>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    )
  }

  renderTargetBooksFailureView = () => (
    <div>
      <h1 className="failure-view-heading">Find Your Next Favorite Books?</h1>
      <p className="failure-view-paragraph">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommendations.
      </p>
      <div className="failure-view-card">
        <div className="failure-view-card-container">
          <h1 className="failure-view-card-heading">Top Rated Books</h1>
          <button type="button" className="failure-view-card-button">
            Find Books
          </button>
        </div>
        <img
          src="https://res.cloudinary.com/dkpxole2a/image/upload/v1670040769/failure%20View%20Image.png"
          alt="failure view"
        />
        <p className="failure-view-error-message">
          Something went wrong. Please try again
        </p>
        <button type="button" onClick={this.getTopRatedBooks}>
          Try Again
        </button>
      </div>
    </div>
  )

  renderTargetBooks = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedBookSuccessView()
      case apiStatusConstants.failure:
        return this.renderTargetBooksFailureView()
      case apiStatusConstants.inProgress:
        return this.renderBookLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <Header home />
        {this.renderTargetBooks()}
        <Footer />
      </div>
    )
  }
}

export default Home
