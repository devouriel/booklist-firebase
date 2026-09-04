import { useParams, Link, useNavigate } from 'react-router-dom';
import Notes from '../components/Notes.jsx';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { eraseBook, toggleRead } from '../store/booksSlice.js';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/config.js';

function SingleBookPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState("");
  const [fetchStatus, setFetchStatus] = useState("idle");

  function handleEraseBook(id) {
    if (confirm('Are you sure you want to erase this book and all notes associated with it?')) {
      dispatch(eraseBook(id));
      navigate("/");
    }
  }

  function handleToggleRead(info) {
    dispatch(toggleRead({ id: info.id, isRead: info.isRead }));
    setBook({ ...book, isRead: !info.isRead });
  }

  const fetchBook = async (book_id) => {
    try {
      const docRef = doc(db, "books", book_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBook({ id: docSnap.id, ...docSnap.data() });
      }
      setFetchStatus("success");
    } catch (error) {
      console.error("Error fetching book:", error);
      setFetchStatus("error");
    }
  }

  useEffect(() => {
    if (fetchStatus == 'idle') { // Fetch books only if the status is 'idle' . preventing infinite fetches
      fetchBook(id);
    }
  }, []);

  return (
    <>
      <div className="container">
        <Link to="/">
          <button className="btn">
            ← Back to Books
          </button>
        </Link>

        {book ?

          <div>
            <div className="single-book">
              <div className="book-cover">
                <img src={book.cover} />
              </div>

              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <h4 className="book-author">{book.author}</h4>
                <p>{book.synopsis}</p>
                <div className="read-checkbox">
                  <input
                    onClick={() => { handleToggleRead({ id: book.id, isRead: book.isRead }) }}
                    type="checkbox"
                    defaultChecked={book.isRead} />
                  <label>{book.isRead ? "Already Read It" : "Haven't Read it yet"}</label>
                </div>
                <div onClick={() => handleEraseBook(book.id)} className="erase-book">
                  Erase book
                </div>
              </div>
            </div>

            <Notes bookId={id} />
          </div>

          : fetchStatus == 'success' ?

            <div>
              <p>Book not found. Click the button above to go back to the list of books.</p>
            </div>

            : fetchStatus == 'error' ?

              <div>
                <p>An error occurred while fetching the book. Please try again later.</p>
              </div>

              :
              <div>
                <p>Loading...</p>
              </div>

        }


      </div>


    </>
  )
}

export default SingleBookPage
