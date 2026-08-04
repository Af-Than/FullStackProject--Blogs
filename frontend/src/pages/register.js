import { useState, useContext } from "react";
import axios from "axios";
import "./register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { AuthContext } from "../helpers/authcontext";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const initialValues = {
    username: "",
    email: "",
    password: ""
  };

  const handleSubmit = (values, { setFieldError, setSubmitting }) => {
    axios
      .post("http://localhost:3000/auth", values)
      .then((res) => {
        if (res.data.error) {
          if (res.data.error.toLowerCase().includes("username")) {
            setFieldError("username", res.data.error);
          } else {
            alert(res.data.error);
          }
          return;
        }

        localStorage.setItem("accessToken", res.data.accessToken);
        setAuthState({
          username: res.data.username || values.username,
          id: res.data.id,
          status: true,
        });
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        const errorMsg = err.response?.data?.error;
        if (errorMsg && errorMsg.toLowerCase().includes("username")) {
          setFieldError("username", errorMsg);
        } else {
          alert("Registration failed. Please try again.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .required("Password is required"),
  });

  return (
    <div className="create-post-container">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="post-form">
            {/* Username Field */}
            <label className="form-label" htmlFor="inputusername">Username</label>
            <Field
              type="text"
              id="inputusername"
              name="username"
              placeholder="Username"
              className="form-input"
            />
            {/* This tag now renders both Yup errors AND backend "Username exists" errors */}
            <ErrorMessage name="username" component="div" className="error-message" />

            {/* Email Field */}
            <label className="form-label" htmlFor="inputemail">Email</label>
            <Field
              type="email"
              id="inputemail"
              name="email"
              placeholder="Email address"
              className="form-input"
            />
            <ErrorMessage name="email" component="div" className="error-message" />

            {/* Password Field */}
            <label className="form-label" htmlFor="inputpassword">Password</label>
            <div className="password-wrapper">
              <Field
                type={showPassword ? "text" : "password"}
                id="inputpassword"
                name="password"
                placeholder="Password"
                className="form-input"
              />
              <button
                type="button"
                className="show-password-btn"
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                👁
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="error-message" />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;