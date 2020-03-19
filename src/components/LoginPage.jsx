import React, { useState } from 'react'

function LoginPage(props) {
    const [account, setAccount] = useState({
        email: '',
        password: '',
    })

    function inputChangeHandler(event) {
        const { name, value } = event.target

        setAccount(prevAccount => {
            return {
                ...prevAccount,
                [name]: value
            }
        })
    }
    return (
        <div>
            <form onSubmit={(e) => {
                props.onLogin(e, {
                    email: account.email,
                    password: account.email
                })
            }}>
                <h1 className="h1-items">Login</h1>
                <hr/>
                <label>email</label>
                <input name="email" onChange={inputChangeHandler} value={
                    account.email} placeholder="輸入 email" />
                <label>password</label>
                <input name="password" onChange={inputChangeHandler} value={
                    account.password} type="password" placeholder="輸入 password" />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default LoginPage