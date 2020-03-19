import React, { useState } from 'react';

function SingupPage(props) {
    const [account, setAccount] = useState({
        name: '',
        email: '',
        password: ''
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
                props.onSignup(e, {
                    name: account.name,
                    email: account.email,
                    password: account.email
                })
            }}>
                <h1 className="h1-items">SignUp</h1>
                <hr />
                <label>name</label>
                <input name="name" onChange={inputChangeHandler} value={
                    account.name} placeholder="輸入 name" />

                <label>email</label>
                <input name="email" onChange={inputChangeHandler} value={
                    account.email} type="email" placeholder="輸入 email" />
                <label>password</label>
                <input name="password" onChange={inputChangeHandler} value={
                    account.password} type="password" placeholder="輸入 password 要大於 7 個字" />

                <button type="submit" >Signup</button>
            </form>
        </div>
    )
}

export default SingupPage