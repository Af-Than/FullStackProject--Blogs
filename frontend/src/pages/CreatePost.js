import { Formik, Form, Field, ErrorMessage } from "formik";
import './CreatePosts.css';
import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import * as Yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../helpers/authcontext";

function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const initialValues = {
    title: "",
    content: "",
  };

  useEffect(() => {
    if(!localStorage.getItem("accessToken") ) {
      navigate("/auth/login");
    }
  },[authState.status, navigate]);
  const handleSubmit = (values) => {
    axios.post("http://localhost:3000/posts", values, {
      headers: { accessToken: localStorage.getItem("accessToken") }
    }).then((res) => {
      console.log("Post created successfully:");
      navigate("/"); // Redirect to home page after successful post creation
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to create post. Please log in.");
    });
  };



  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
  });

  return (
    <div className="create-post-container">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form className="post-form">
          <label className="form-label">Title</label>
          <Field
            type="text"
            id="inputtitle"
            name="title"//same as the one in yup validation schema and initial values//
            placeholder="Title"
            className="form-input"
          />
          <ErrorMessage name="title" component="div" className="error-message" />

          <label className="form-label">Content</label>
          <Field
            type="text"
            id="inputcontent"
            name="content"
            placeholder="Content"
            className="form-input content-input"
          />
          <ErrorMessage name="content" component="div" className="error-message" />

  
          <ErrorMessage name="authorname" component="div" className="error-message" />

          <button type="submit" className="submit-btn">Create Post</button>
        </Form>
      </Formik>
    </div>
  );

};
export default CreatePost;