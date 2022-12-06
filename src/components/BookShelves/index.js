import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'
import Footer from '../Footer'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class BookShelves extends Component {
  state = {
    books: [],
    apiStatus: apiStatusConstants.initial,
    searchText: '',
    bookshelfName: bookshelvesList[0].value,
    activeBookShelfLabel: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBookShelves()
  }

  getBookShelves = async () => {
    const {searchText, bookshelfName} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchText}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedBooks = data.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        readStatus: eachBook.read_status,
        rating: eachBook.rating,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        books: updatedBooks,
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

  renderBookShelfSuccessView = () => {
    const {books} = this.state

    return (
      <>
        {books.length === 0 ? (
          this.renderNoBooksView()
        ) : (
          <ul className="book-list-container">
            {books.map(eachBook => (
              <li key={eachBook.id} className="bookshelf-item-container">
                <Link to={`/books/${eachBook.id}`}>
                  <img
                    src={eachBook.coverPic}
                    alt={eachBook.title}
                    className="bookshelf-image"
                  />
                </Link>
                <div className="bookshelf-details-container">
                  <h1 className="book-title">{eachBook.title}</h1>
                  <p className="book-author">{eachBook.authorName}</p>
                  <div className="book-item-avg-rating-container">
                    <p className="book-rating">Avg Rating</p>
                    <BsFillStarFill className="star-icon" />
                    <p className="rating-points">{eachBook.rating}</p>
                  </div>
                  <p className="book-status">
                    Status :{' '}
                    <span className="book-status-value">
                      {eachBook.readStatus}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  renderNoBooksView = () => {
    const {searchText} = this.state
    return (
      <div className="no-books-container">
        <img
          src="https://res.cloudinary.com/dkpxole2a/image/upload/v1669554151/book%20not%20found%20view.png"
          alt="no books"
        />
        <p>Your search for {searchText} did not find any matches.</p>
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
        onClick={this.getBookShelves}
      >
        Try Again
      </button>
    </div>
  )

  renderTargetBookShelf = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookShelfSuccessView()
      case apiStatusConstants.failure:
        return this.renderBooksShelfFailureView()
      case apiStatusConstants.inProgress:
        return this.renderBookLoadingView()
      default:
        return null
    }
  }

  onClickLabel = eachBook => {
    this.setState(
      {
        activeBookShelfLabel: eachBook.label,
        bookshelfName: eachBook.value,
      },
      this.getBookShelves,
    )
  }

  onSearchInput = event => {
    this.setState({searchText: event.target.value})
  }

  onSearchButtonClick = () => {
    this.getBookShelves()
  }

  render() {
    const {activeBookShelfLabel} = this.state
    return (
      <div>
        <Header bookshelves />
        <div className="bookShelf-container">
          <div className="bookShelf-list-container">
            <div className="bookShelf-dashboard">
              <h1 className="dashboard-heading">Bookshelves</h1>
            </div>
            <ul className="dashboard-container">
              {bookshelvesList.map(eachBook => {
                const activeButtonClass =
                  eachBook.label === activeBookShelfLabel ? 'active-button' : ''
                return (
                  <button
                    type="button"
                    className={`dashboard-item-all ${activeButtonClass}`}
                    key={eachBook.id}
                    onClick={() => this.onClickLabel(eachBook)}
                  >
                    {eachBook.label}
                  </button>
                )
              })}
            </ul>
          </div>
          <div className="books-list-container">
            <div className="books-heading-container">
              <h1 className="bookshelf-heading">
                {activeBookShelfLabel} Books
              </h1>
              <div className="search-container">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input-element"
                  onChange={this.onSearchInput}
                />
                <button
                  type="button"
                  onClick={this.onSearchButtonClick}
                  className="search-button"
                  testid="searchButton"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            <div className="bookshelf-mobile-title">
              <h1 className="dashboard-heading">Bookshelves</h1>
            </div>
            <ul className="dashboard-mobile-container">
              {bookshelvesList.map(eachBook => {
                const activeButtonClass =
                  eachBook.label === activeBookShelfLabel
                    ? 'active-mobile-container-buttons'
                    : ''
                return (
                  <button
                    type="button"
                    className={`mobile-container-buttons ${activeButtonClass}`}
                    key={eachBook.id}
                    onClick={() => this.onClickLabel(eachBook)}
                  >
                    {eachBook.label}
                  </button>
                )
              })}
            </ul>
            {this.renderTargetBookShelf()}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default BookShelves
