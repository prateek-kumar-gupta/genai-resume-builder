import React from 'react'

const Login = () => {
  return (
    <main>
        <div className = "form-container">
             <h1>Login</h1>

             <form>
              <div calssName = "input-group">
                <lable htmlFor = "email">Email</lable>
                <input type = "email" name = "email" id = "email" placeholder = "Enter your email" />
                </div>
                <div calssName = "input-group">
                    <label htmlFor = "password">Password</label>
                    <input type = "password" name = "password" id = "password" placeholder = "Enter your password" />
                
                    </div>
            <button className = "button primary-button" >Login</button>
             </form>
            </div>
    </main>
    )
}

export default Login