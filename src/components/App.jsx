import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import InputShortUrl from './InputShortUrl'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import UrlPage from './UrlPage'
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

Modal.setAppElement('#root')

class App extends Component {
    state = {
        isAuth: false,
        token: null,
        userId: null,
        error: null,
        posts: [],
        modalIsOpen: false,
        modalTitle: "",
        modalInformation: "",
        message: ""
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');

        if (!token || !expiryDate) {
            return;
        }

        this.loadPost(token)
        if (new Date(expiryDate) <= new Date()) {
            this.logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        this.setState({ isAuth: true, token: token, userId: userId });
        this.setAutoLogout(remainingMilliseconds);
    }

    loadPost = (token) => {
        fetch('http://localhost:8080/surl', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch')
            }
            return res.json()
        }).then(resData => {
            this.setState({
                posts: resData
            })
        }).catch(err => {
            console.log(err)
        })
    }

    setAutoLogout = (milliseconds) => {
        setTimeout(() => {
            this.logoutHandler();
        }, milliseconds);
    };

    logoutHandler = () => {
        this.setState({ isAuth: false, token: null });

        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    };

    closeModal = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            modalTitle: "",
            modalInformation: "",
            message: ""
        })
    }

    loginHandler = (event, authData) => {
        event.preventDefault()
        fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: authData.email,
                password: authData.password
            })
        })
            .then((res) => {
                if (res.status === 422) {
                    throw new Error('Validation failed')
                }
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Could not authenticate you')
                }
                return res.json()
            }).then(resData => {
                this.setState({
                    isAuth: true,
                    token: resData.token,
                    authLoading: false,
                    userId: resData.userId
                });

                localStorage.setItem('token', resData.token)
                localStorage.setItem('userId', resData.user._id)

                const remainingMilliseconds = 60 * 60 * 1000;
                const expiryDate = new Date(
                    new Date().getTime() + remainingMilliseconds
                );
                localStorage.setItem('expiryDate', expiryDate.toISOString());
                this.setAutoLogout(remainingMilliseconds);
            }).catch((err) => {
                console.log(err);
                this.setState({
                    isAuth: false,
                    authLoading: false,
                    error: err
                });
            });
    }

    signupHandler = (event, authData) => {
        event.preventDefault()
        // fetch('https://authapi-264513.appspot.com/auth/signup', {
        fetch('http://localhost:8080/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: authData.name,
                email: authData.email,
                password: authData.password
            })
        }).then(res => {
            if (res.status === 422) {
                throw new Error(
                    "Validation failed. Make sure the email address isn't used yet!"
                );
            }
            if (res.status !== 200 && res.status !== 201) {
                console.log('Error!');
                throw new Error('Creating a user failed!');
            }
            return res.json();
        }).then(resData => {
            this.setState({
                modalIsOpen: true,
                modalTitle: 'Sign up Success'
            })
        }).catch(err => {
        });
    }


    render() {
        return <div>
            <Header isLogin={this.state.isAuth} onLogout={this.logoutHandler} />
            {
                !this.state.isAuth ?
                    (
                        <div>
                            <LoginPage onLogin={this.loginHandler} />
                            <SignupPage onSignup={this.signupHandler} />
                        </div>
                    ) :
                    <div>
                        <InputShortUrl token={this.state.token} />
                        <UrlPage userId={this.state.userId} token={this.state.token} />

                    </div>
            }
            <Modal
                isOpen={this.state.modalIsOpen}
                style={customStyles}
                contentLabel="Modal"
                onRequestClose={this.closeModal}>
                <h1>{this.state.modalTitle}</h1>
                <div>{this.state.modalInformation}</div>
                <p> </p>
                <button onClick={this.closeModal}>close</button>
            </Modal>
            <Footer />
        </div >
    }
}


export default App