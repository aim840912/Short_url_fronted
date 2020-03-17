import React, { useState } from 'react';

function CreateArea(props) {

    const [url, setUrl] = useState({
        long_url: "",
    })

    function handleChange(event) {
        console.log(event.target)
        const { long_url, value } = event.target

        setUrl(prevUrl => {
            return {
                ...prevUrl,
                long_url: value
            }
        })
    }
    function postHandler(e) {
        e.preventDefault()
        fetch('http://localhost:8080/surl/submit', {
            method: 'POST',
            body: JSON.stringify({
                url:url.long_url
            }),
            headers: {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Creating a post failed!')
            }
            return res.json()
        }).then(resData => {
            setUrl({
                long_url: '',
            })
        }).catch((err) => {
          console.log(err)
        });
    }

    return (
        <div>
            <form onSubmit={postHandler}>
                <input
                    type="text"
                    long_url="long_url"
                    onChange={handleChange}
                    value={url.long_url}
                    placeholder="Paste your long URL"
                />
                <button >Add</button>

            </form>
        </div>
    )
}

export default CreateArea