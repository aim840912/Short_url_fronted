import React, { Component } from "react";
import DeleteIcon from "@material-ui/icons/Delete";


class UrlPage extends Component {

  state = {
    posts: []
  }

  componentDidMount() {
    this.loadPost(this.props.token)
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
      // resData.map(resd => {
      this.setState({
        posts: resData
        // urlname: resData.url_name,
        // surl: resData.shortUrl
        // }) 
      })
      // console.log(this.state.posts)

    }).catch(err => {
      console.log(err)
    })
  }

  deletePostHandler(urlId) {
    // console.log(this.props.token)
    fetch('http://localhost:8080/surl/' + urlId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Deleting a post failed!')
      }
      return res.json()
    }).then(resData => {
      this.loadPost(this.props.token)
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    return (
      <div>
        {this.state.posts.map(element => (
          <div key={element._id} className="note" >
            <h1>{element.url_name}</h1>
            <p>短網址 ▼</p>
            <a href={`http://localhost:8080${element.shortUrl}`}>{`http://localhost:8080${element.shortUrl}`}</a>

            {this.props.userId === element.owner && <button onClick={() => this.deletePostHandler(element._id)}> <DeleteIcon /></button>}
          </div>
        ))}
      </div>
    );
  }
}

export default UrlPage;
