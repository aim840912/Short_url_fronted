import React, { Component } from 'react';

class CreateArea extends Component {
    state = {
        long_url: ""
    }

    handleChange = (event) => {
        this.setState({
            long_url: event.target.value
        })
    }

    postHandler = (e) => {
        e.preventDefault()
        fetch('http://localhost:8080/surl/submit', {
            method: 'POST',
            body: JSON.stringify({
                url: this.state.long_url
            }),
            headers: {
                Authorization: 'Bearer ' + this.props.token,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Creating a post failed!')
            }
            return res.json()
        }).then(resData => {
            this.setState({
                long_url: '',
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.postHandler}>
                    <input
                        type="text"
                        long_url="long_url"
                        onChange={this.handleChange}
                        value={this.state.long_url}
                        placeholder="Paste your long URL" />
                    <button >Add</button>
                </form>
            </div >
        )
    }
}
export default CreateArea