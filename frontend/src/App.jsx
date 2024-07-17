import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios'

function App() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
axios.defaults.withCredentials = true;
  
     const handleSubmit = (e) => {
       e.preventDefault();
       setError("");
       setSuccess("");
       axios.post('https://deploy-mern-api.vercel.app/register', {name, email, password})
       .then(result => {
         console.log(result);
         setSuccess("Registration successful!");
         setName("");
         setEmail("");
         setPassword("");
       })
       .catch(err => {
         console.error(err);
         if (err.response) {
           setError(err.response.data);
         } else if (err.request) {
           setError("No response from server. Please try again later.");
         } else {
           setError("Error: " + err.message);
         }
       });
     }

     return (
       <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
         <div className="bg-white p-3 rounded w-25">
           <h2>Register</h2>
           {error && <div className="alert alert-danger">{error}</div>}
           {success && <div className="alert alert-success">{success}</div>}
           <form onSubmit={handleSubmit}>
             <div className="mb-3">
               <label htmlFor="name">
                 <strong>Name</strong>
               </label>
               <input
                 type="text"
                 placeholder="Enter Name"
                 autoComplete="off"
                 name="name"
                 className="form-control rounded-0"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
               />
             </div>
             <div className="mb-3">
               <label htmlFor="email">
                 <strong>Email</strong>
               </label>
               <input
                 type="email"
                 placeholder="Enter Email"
                 autoComplete="off"
                 name="email"
                 className="form-control rounded-0"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </div>
             <div className="mb-3">
               <label htmlFor="password">
                 <strong>Password</strong>
               </label>
               <input
                 type="password"
                 placeholder="Enter Password"
                 name="password"
                 className="form-control rounded-0"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
             </div>
             <button type="submit" className="btn btn-success w-100 rounded-0">
               Register
             </button>
           </form>
           <p className="mt-3">Already Have an Account</p>
           <button className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
             Login
           </button>
         </div>
       </div>
     );
   }

   export default App;
