import React, { Component } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
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


class UrlPage extends Component {
  state = {
    posts: [],
    patchpost: [],
    modalIsOpen: false,
    modalTitle: "",
    modalInformation: "",
  }

  componentDidMount() {
    this.loadPost(this.props.token)
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
      modalTitle: "",
      modalInformation: "",
      message: ""
    })
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

  loadPatchPost = (urlId) => {
    fetch('http://localhost:8080/surl/patch/' + urlId, {
      method: "GET"
    }).then(res => {
      return res.json()
    }).then(resData => {
      this.setState({
        patchpost: resData.url_name,
        modalIsOpen: true
      })
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

  editPostHandler(urlId) {
    fetch('http://localhost:8080/surl/' + urlId, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Deleting a post failed!')
      }
      return res.json()
    }).then((resData) => {

    })
  }

  render() {
    return (
      <div>
        {
          this.state.posts.map(element => (
            <div key={element._id} className="note" >
              <h1>{element.url_name}</h1>
              <p>短網址 ▼</p>
              <a href={`http://localhost:8080${element.shortUrl}`}>{`http://localhost:8080${element.shortUrl}`}</a>
              {this.props.userId === element.owner && <button onClick={() => this.deletePostHandler(element._id)}> <DeleteIcon /></button>}
              {this.props.userId === element.owner && <button onClick={() => this.loadPatchPost(element._id)}> <EditIcon /></button>}
              <Modal
                isOpen={this.state.modalIsOpen}
                style={customStyles}
                contentLabel="Modal"
                onRequestClose={this.closeModal}>
                <form>
                  <label>The Url that you want to shorten</label>
                  <input
                    name="Url"
                    value={this.state.patchpost}
                    onChange={this.state.patchpost} />
                  <button onClick={() => this.editPostHandler(element._id)}><CheckIcon /></button>
                </form>
              </Modal>
            </div>
          ))
        }
      </div >
    );
  }
}

export default UrlPage;
