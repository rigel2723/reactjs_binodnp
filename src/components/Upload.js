import React, {Component} from 'react';
import './css/Upload.css';
export default  class Upload extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.savePhoto = this.savePhoto.bind(this)
    this.state = {
      imageList: [],
      category: "",
      imageInfo: {},
      reloadPage: false,
      showAlert: {
        visible: false,
        message: 'Loading..',
        type: 'error'
      }
    }
  }
  render() {
    return (
      <div className="fade-in">
        <div className="overlay"></div>
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
            </div>
            <div className="modal-body">
              <div className="category-container">
                <span id="categ-txt">Category</span>
                <select id="select-category" onChange={(e) => this.selectCategory(e)}>
                  <option value="">-- Choose Category --</option>
                  <option value="Personal">Personal</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Nature">Nature</option>
                </select>
              </div>
              <div className="input-file-container">
                <label htmlFor="input-file" className="lbl-input-file">
                  <img src={require('./../assets/image/upload_w.png')} width="27px" draggable="false" />
                  &nbsp;SELECT FILE TO UPLOAD
                  <input type="file" multiple className="input-file" id="input-file" onChange={ (e) => this.handleChange(e.target.files) } accept="image/*" />
                </label>
              </div>
              <div className="image-preview-container">
                {this.state.imageList.length < 1 &&
                  <div id="no-image-selected">No photo selected</div>
                }
                {this.state.imageList.map((item,index)=>{
                  return (
                    <img className="prev-image" src={this.state.imageList[index]} key={index} />
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              {this.state.showAlert.visible &&
                <div className={"alert-container fade-in " + this.state.showAlert.type}>{this.state.showAlert.message}</div>
              }
              <div className="btn-container">
                <button className="cancel" onClick={this.closeModal}>
                  
                <img src={require('./../assets/image/close_w.png')} width="27px" draggable="false" />
                &nbsp;Close
                </button>
                <button className="ok" onClick={this.savePhoto}>
                <img src={require('./../assets/image/upload_w.png')} width="27px" draggable="false" />
                  &nbsp;Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleChange(evt) {
    if (evt.length > 0) {
      let allImages = []
      let allInfo = []
      for (let i =0; i < evt.length; i ++) {
        if (evt[i].type.includes('image/')) {
          allImages.push(URL.createObjectURL(evt[i]))
          allInfo.push(evt[i])
        } else {
          this.showAlertDialog('Removed ' + evt[i].name + '. File is not valid', 'error')
        }
      }
      this.setState({ imageList: allImages, imageInfo: allInfo })
    }
    
  }

  selectCategory(evt) {
    this.setState({category: evt.target.value})
  }

  closeModal() {
    this.props.toggleModal(this.state.reloadPage);
  }

  savePhoto(event) {
    event.preventDefault()
    if (this.state.category == "") {
      this.showAlertDialog('Please select image category!', 'error')
      return false
    }
    var formData = new FormData();
    let input_file = this.state.imageInfo
    formData.append('album', this.state.category);
    if (Object.keys(input_file).length < 1) {
      this.showAlertDialog('Please select image to upload!', 'error')
      return false
    }
    for (let i = 0; i < Object.keys(input_file).length; i ++) {
      formData.append("documents", input_file[i]);
      console.log(input_file[i])
    }
    const requestOptions = {
      method: 'PUT',
      body: formData
    };
    this.showAlertDialog('Saving Photo/s..')
    fetch("http://localhost:8888/photos", requestOptions)
      .then(res => res.json())
      .then((result) => {
        console.log(result)
        if (result.message.toLowerCase() == 'ok') {
          this.showAlertDialog('Success, Photo/s has been saved')
          this.setState({imageList: [], imageInfo: {}})
          this.setState({reloadPage: true})
        } else {
          this.showAlertDialog(result.message, 'error')
        }
      })
  }

  showAlertDialog(message, type = "success") {
    this.setState({showAlert: {visible: true, message: message, type: type}})
    setTimeout(() => {
    this.setState({showAlert: {visible: false, message: 'Loading', type: 'success'}})
    }, 1500)
  }
}