import {Component} from 'react'
import {BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {bookDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/book-hub/books/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedBookDetails = {
        id: data.book_details.id,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        aboutBook: data.book_details.about_book,
        rating: data.book_details.rating,
        readStatus: data.book_details.read_status,
        title: data.book_details.title,
        aboutAuthor: data.book_details.about_author,
      }
      this.setState({
        bookDetails: updatedBookDetails,
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

  renderBookDetailsSuccessView = () => {
    const {bookDetails} = this.state
    return (
      <div className="card-container">
        <div key={bookDetails.id} className="bookDetails-item-container">
          <img
            src={bookDetails.coverPic}
            alt={bookDetails.title}
            className="bookDetails-image"
          />
          <div className="bookDetails-container">
            <h1 className="bookDetails-title">{bookDetails.title}</h1>
            <p className="bookDetails-author">{bookDetails.authorName}</p>
            <div className="bookDetails-item-avg-rating-container">
              <p className="bookDetails-rating">Avg Rating</p>
              <BsFillStarFill className="bookDetails-star-icon" />
              <p className="bookDetails-rating-points">{bookDetails.rating}</p>
            </div>
            <p className="bookDetails-status">
              Status:{' '}
              <span className="bookDetails-status-value">
                {bookDetails.readStatus}
              </span>
            </p>
          </div>
        </div>
        <hr className="bookDetails-hr-line" />
        <div className="description-container">
          <h1 className="bookDetails-about-author">About Author</h1>
          <p className="bookDetails-author-description">
            {bookDetails.aboutAuthor}
          </p>
          <h1 className="bookDetails-about-book">About Book</h1>
          <p className="bookDetails-about-book-description">
            {bookDetails.aboutBook}
          </p>
        </div>
      </div>
    )
  }

  renderBooksShelfFailureView = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dkpxole2a/image/upload/v1670040769/failure%20View%20Image.png"
        alt="failure view"
        className="no-books-image"
      />
      <p>Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.getBookDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderBookDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderBooksShelfFailureView()
      case apiStatusConstants.inProgress:
        return this.renderBookLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="bookDetails-main-container">
          <div className="bookDetails-card-container">
            {this.renderBookDetails()}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default BookDetails
