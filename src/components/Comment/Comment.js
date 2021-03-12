import "./Comment.css";
import api from "../../apis/api";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

function Comment(props) {
  const authContext = useContext(AuthContext);

  const [comment, setComment] = useState({ ...props.comment });

  const commentTextCopy = props.comment.text;

  const [editionActive, setEditionActive] = useState(false);

  async function handleDelete(event) {
    event.preventDefault();
    try {
      await api.delete(`/comment/${props.comment._id}`);
      props.setToggle(!props.toggle);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(event) {
    setComment({ ...comment, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.patch(`/comment/${props.comment._id}`, {
        ...comment,
        updated: Date.now(),
      });
      setEditionActive(!editionActive);
      props.setToggle(!props.toggle);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancel() {
    setComment({ ...comment, text: commentTextCopy });
    setEditionActive(!editionActive);
  }

  return (
    <div className="comment">
      {!editionActive && (
        <div className="">
          <div className="info-comment">
            Criado em {new Date(props.comment.created).toLocaleString()} por{" "}
            {props.comment.creator}{" "}
            {props.comment.updated &&
              `e atualizado em ${new Date(
                props.comment.updated
              ).toLocaleString()}`}
          </div>
          <div className="text-comment">{props.comment.text}</div>

          {authContext.loggedInUser.user._id === props.comment.creatorId && (
            <div className="footer">
              <button onClick={handleDelete}>Excluir</button>
              <button onClick={() => setEditionActive(!editionActive)}>
                Editar
              </button>
            </div>
          )}
        </div>
      )}

      {editionActive && (
        <form className="form" onSubmit={handleSubmit}>
          <textarea
            id="text"
            name="text"
            value={comment.text}
            onChange={handleChange}
          ></textarea>
          <div>
            <button type="submit">Atualizar</button>
            <button type="submit" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Comment;
